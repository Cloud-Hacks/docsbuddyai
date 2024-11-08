import fetch from 'node-fetch';

const VULTR_API_KEY = process.env.VULTR_API_KEY;
const VULTR_API_BASE_URL = "https://api.vultrinference.com/v1";

// Function to create a vector store collection in Vultr
export async function createVultrCollection(collectionName: string) {
  try {
    const response = await fetch(VULTR_API_BASE_URL + "/vector_store", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VULTR_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: collectionName,
      }),
    });
    const result = await response.json();
    console.log("Vultr Collection Response:", result);

    if (response.ok && result.id) {
      return result.id; // Return the collection ID
    } else {
      throw new Error("Failed to create Vultr vector store collection");
    }
  } catch (error) {
    console.error("Error creating Vultr collection:", error);
    throw error;
  }
}

// Function to create embeddings for a given text using Vultr's API and return the embedding data
export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await fetch(`${VULTR_API_BASE_URL}/embeddings`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VULTR_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama2-7b-chat-Q5_K_M", // Adjust to Vultr's embedding model name
        input: text.replace(/\n/g, " "),
        encoding_format: "float",
      }),
    });

    const result = await response.json();
    console.log("Vultr Embedding Response:", result);

    // Check if the response contains embedding data
    if (response.ok && result.data && result.data.length > 0) {
      return result.data[0].embedding as number[]; // Return the embedding array
    } else {
      throw new Error("Invalid response structure from Vultr embedding API");
    }
  } catch (error) {
    console.error("Error calling Vultr embeddings API:", error);
    throw error;
  }
}

// Function to add an embedding item to a Vultr collection
export async function addItemToVultrCollection(collectionId: string, text: string, description?: string) {
  try {
    // First, get embeddings for the text
    const embedding = await getEmbeddings(text);

    // Then, store the embedding in the specified collection
    const response = await fetch(`${VULTR_API_BASE_URL} + "/vector_store" + "/${collectionId}/items"`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VULTR_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: text,
        description: description || text.slice(0, 100), // Default description
        embedding, // Directly pass the embedding data
      }),
    });

    const result = await response.json();
    console.log("Vultr Item Response:", result);

    if (response.ok && result.id) {
      return result.id; // Return the item ID
    } else {
      throw new Error("Failed to add item to Vultr vector store collection");
    }
  } catch (error) {
    console.error("Error adding item to Vultr collection:", error);
    throw error;
  }
}
