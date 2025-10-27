// ============================================
// RAG CHAIN IMPLEMENTATION
// This file demonstrates a complete RAG (Retrieval Augmented Generation) system
// Pipeline: Question → Embedding → Retrieval → Context Processing → Generation
// ============================================
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PineconeStore } from '@langchain/pinecone';
import { RunnableSequence } from '@langchain/core/runnables';
import { index } from '@/lib/pinecone/client';
import { env } from '@/utils/env';
import { pipeline } from '@xenova/transformers';



// ============================================
// STEP 1: EMBEDDING COMPONENT
// Purpose: Convert text questions into vector embeddings
// Input: string (question)
// Output: number[] (embedding vector)
// ============================================
let embedder: any = null;

async function getEmbedder() {
    if (!embedder) {
        console.log('Initializing sentence transformer');
        embedder = await pipeline('feature-extraction', 'xenova/all-MiniLM-L6-v2');
    }
    return embedder;
}

async function embedQuery(text: string): Promise<number[]> {
    const model = await getEmbedder();
    const output = await model(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

// Alternative: OpenAI Embeddings (commented out but available)
const embeddings = new OpenAIEmbeddings({
    apiKey: env.OPENAI_API_KEY,
    model: 'text-embedding-3-small',
});


// ============================================
// STEP 2: VECTOR STORE CONNECTION
// Purpose: Connect to Pinecone vector database
// ***NOTE: I am currently use the Pinecone client directly for fine-grained control
// The index is initialized in @/lib/pinecone/client
// ============================================

// The Pinecone index is imported and ready to use
// It's initialized elsewhere and contains our pre-embedded documents
// let vectorStorePromise: Promise<PineconeStore> | null = null;

// function getVectorStore() {
//     if (!vectorStorePromise) {
//         console.log('Initializing Pinecone store');
//         vectorStorePromise = PineconeStore.fromExistingIndex(embeddings, {
//             pineconeIndex: index,
//         });
//         console.log('Pinecone store initialized');
//     }
//     return vectorStorePromise;
// }


// ============================================
// STEP 3: RETRIEVAL COMPONENT
// Purpose: Find relevant documents from vector database
// This happens inside the RAG chain (see below)
// Uses semantic similarity search via embeddings
// ============================================
async function retrieveDocuments(embeddedQuestion: number[], topK: number = 4) {
    
    // Search Pinecone for similar document vectors
    const results = await index.query({
        vector: embeddedQuestion,
        topK: topK,
        includeMetadata: true,
    });
    
    
    console.log(`Retrieved ${results.matches.length} documents`);
    return results;
}



// ============================================
// STEP 4: CONTEXT PROCESSING
// Purpose: Sanitize and prepare retrieved documents
// Redact sensitive information before sending to LLM
// Input: string (raw text from database)
// Output: string (sanitized text)
// ============================================
function sanitizeForLLM(text: string, options = {
    removeSSN: true,
    removeDOB: true,
    removeSalary: true
}): string {
    let cleaned = text;
    
    if (options.removeSSN) {
        cleaned = cleaned.replace(/SSN:?\s*\d{3}-\d{2}-\d{4}/gi, 'SSN: [REDACTED]');
    }
    
    if (options.removeDOB) {
        cleaned = cleaned.replace(/DOB:?\s*\d{2}\/\d{2}\/\d{4}/gi, 'DOB: [REDACTED]');
    }
    
    if (options.removeSalary) {
        cleaned = cleaned.replace(/Salary:?\s*\$[\d,]+/gi, 'Salary: [REDACTED]');
    }
    
    return cleaned;
}



// ============================================
// STEP 5: GENERATION COMPONENT
// Purpose: LLM that generates the final answer
// Uses retrieved context + original question
// Input: { context: string, question: string }
// Output: string (answer)
// ============================================
const llm = new ChatOpenAI({
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL,
    temperature: env.LLM_TEMPERATURE,
});
// Create prompt template
const prompt = ChatPromptTemplate.fromTemplate(`
Answer the question based only on the following context:

{context}

Question: {question}

Answer:`);

// ============================================
// STEP 6: THE COMPLETE RAG CHAIN
// Purpose: Orchestrates the entire RAG pipeline
// Flow: Question → Embed → Retrieve → Sanitize → Generate → Answer
// Input: { question: string }
// Output: string (answer)
// ============================================
export const ragChain = RunnableSequence.from([
    {
        context: async (input: {question: string}) => {
            console.log('Retrieving documents for question:', input.question);

            // embed the questions using the sentence transformer
            const queryEmbedding = await embedQuery(input.question);
            console.log('Embedded query:', queryEmbedding);


            const results = await retrieveDocuments(queryEmbedding, 4);

            // THIS IS WHERE YOU REDACT DATA FROM LLM CONTEXT
            return results.matches
                .map(match => {
                    const text = match?.metadata?.text;
                    return typeof text === 'string' ? sanitizeForLLM(text) : '';
                })
                .filter((text: string) => text.length > 0)
                .join('\n\n');
            // const vectorStore = await getVectorStore();
            // const retriever = vectorStore.asRetriever({ k: 4 });
            // const docs = await retriever.invoke(input.question);
            // console.log('Retrieved documents:', docs.length);
            // return docs.map(doc => doc.pageContent).join('\n\n');
        },
        question: (input: {question: string}) => input.question,
    },
    prompt,
    llm,
    new StringOutputParser(),
]);