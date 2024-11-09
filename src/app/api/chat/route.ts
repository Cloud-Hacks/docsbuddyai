import fetch from 'node-fetch';
import { db } from '@/lib/db';
import { getContext } from '@/lib/context';
import { chats, messages as _messages, userConcerns } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = 'edge';

const VULTR_API_KEY = process.env.VULTR_API_KEY;
const VULTR_API_BASE_URL = "https://api.vultrinference.com/v1/chat/completions";

// Define a basic Message type if not already defined
interface Message {
    role: "user" | "system";
    content: string;
}

export async function POST(req: Request) {
    try {
        const { messages, chatId } = await req.json();
        const lastMessage = messages[messages.length - 1];
        const _chats = await db.select().from(chats).where(eq(chats.id, chatId));

        if (_chats.length !== 1) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }
        
        // Save user message into db
        await db.insert(_messages).values({
            chatId,
            content: lastMessage.content,
            role: "user",
        });

        // Fetch user concerns
        const _concerns = await db.select().from(userConcerns).where(eq(userConcerns.chatId, chatId));
        const userConcernsList = _concerns.map(c => c.concern).join(", ");

        // Get the context based on the user query and relevant file
        const fileKey = _chats[0].fileKey;
        const context = await getContext(lastMessage.content, fileKey);

        // Generate the prompt for Vultr
        const prompt = {
            role: "system",
            content: `You are an AI assistant specializing in insurance and policy matters. You possess expert knowledge in various types of insurance including health, life, auto, home, and business insurance. Your traits include:

            1. Professionalism: You maintain a courteous and formal tone, addressing users with respect.
            2. Expertise: You have in-depth understanding of insurance terms, policies, and industry practices.
            3. Clarity: You explain complex insurance concepts in simple, easy-to-understand language.
            4. Helpfulness: You aim to provide accurate, actionable advice to assist users with their insurance-related queries.
            5. Compliance awareness: You're knowledgeable about insurance regulations and always advise within legal and ethical boundaries.
            6. You also love the roman empire and its history.
            The user has indicated the following concerns: ${userConcernsList}
            Please keep these concerns in mind and tailor your responses accordingly.

            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK

            Guidelines for your responses:
            1. Always consider the provided context and the user's specific concerns when formulating your answers.
            2. If the context or your knowledge base doesn't provide a clear answer, state: "I apologize, but I don't have enough information to answer that question accurately. You may want to check your specific policy details or contact your insurance provider for more information."
            3. Avoid making assumptions or providing information that isn't explicitly stated in the context or isn't general knowledge in the insurance industry.
            4. If asked about specific policy details that aren't provided in the context, advise the user to check their policy documents or contact their insurance provider.
            5. When discussing costs or coverage, always emphasize that these can vary based on individual circumstances and policy details.
            6. If relevant, suggest ways for users to potentially reduce their insurance costs or improve their coverage, based on general best practices in the industry.
            7. Always prioritize accuracy over comprehensiveness. It's better to provide a shorter, accurate answer than a longer one that might contain inaccuracies.
            8. Please try to be as concise as possible, if health insurance doesnt cover something, mention programs in the State of California that might help the user with costs or legal remedies
            9. Don't generate in markdown, rather use plain text.
            Remember, you're here to assist with insurance-related queries and concerns. Focus on providing valuable, accurate information to help users understand their insurance matters better.`,
        };

        // Vultr API request
        const response = await fetch(VULTR_API_BASE_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${VULTR_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama2-7b-chat-Q5_K_M",
                messages: [
                    prompt,
                    ...messages.filter((message: Message) => message.role === "user"),
                ],
                max_tokens: 512,
                stream: true,
            }),
        });

        // Stream Vultr response and save AI response to the database
        const stream = new ReadableStream({
            async start(controller) {
                let aiResponse = '';
                
                for await (const chunk of response.body as any) {
                    const textChunk = new TextDecoder().decode(chunk);
                    aiResponse += textChunk;
                    controller.enqueue(textChunk);
                }

                // Save the AI response into the database when complete
                await db.insert(_messages).values({
                    chatId,
                    content: aiResponse,
                    role: "system",
                });

                controller.close();
            },
            cancel(reason) {
                console.error("Stream canceled:", reason);
            }
        });

        return new Response(stream, {
            headers: { "Content-Type": "text/event-stream" },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
