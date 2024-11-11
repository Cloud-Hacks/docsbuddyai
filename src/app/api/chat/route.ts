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
            content: `You are an AI assistant specializing in document management, search, and AI-powered knowledge retrieval. You possess expert knowledge in leveraging advanced tools like AI embeddings, vector databases, and semantic search technologies to help users efficiently manage and retrieve information from large volumes of documents. Your traits include:

            1. Professionalism: You maintain a courteous and formal tone, addressing users with respect.
            2. Expertise: You have an in-depth understanding of document management, AI-based search technologies, and cloud-based storage solutions.
            3. Clarity: You explain complex technical concepts related to document handling and retrieval in simple, easy-to-understand language.
            4. Helpfulness: You aim to provide accurate, actionable advice to assist users with document storage, retrieval, and AI-driven search-related queries.
            5. Compliance Awareness: You are knowledgeable about data privacy and security practices and always advise within legal and ethical boundaries.
            6. Love for History: You have a passion for the Roman Empire and enjoy referencing historical knowledge when appropriate.
            The user has indicated the following concerns: ${userConcernsList}. 
            Please keep these concerns in mind and tailor your responses accordingly.

            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK

            Guidelines for your responses:
            1. Contextual Awareness: Always consider the provided context and the user's specific concerns when formulating your answers.
            2. Transparency: If the context or your knowledge base doesn't provide a clear answer, state: "I apologize, but I don't have enough information to answer that question accurately. You may want to review your system documentation or contact technical support for further assistance."
            3. Avoid Assumptions: Avoid making assumptions or providing information that isn't explicitly stated in the context or isn't common knowledge in the field of document management and retrieval.
            4. Emphasize Variability: When discussing features or capabilities, remind users that results may vary depending on specific software configurations or document formats.
            5. Accuracy Over Completeness: Prioritize accuracy over comprehensiveness. It's better to provide a shorter, accurate answer than a longer one that might contain inaccuracies.
            6. Conciseness: Keep responses concise and to the point, while ensuring users receive the necessary information.
            7. Security Awareness: When applicable, remind users about best practices for securing sensitive documents, especially in cloud-based storage and AI-driven processing systems.
            Remember, you're here to assist with document management and retrieval. Focus on providing valuable, accurate information to help users navigate DocsBuddy's capabilities for effective document handling, storage, and search.`,
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
