import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PineconeStore } from '@langchain/pinecone';
import { RunnableSequence } from '@langchain/core/runnables';
import { index } from '@/lib/pinecone/client';
import { env } from '@/utils/env';
import { pipeline } from '@xenova/transformers';

// Initialize the LLM
const llm = new ChatOpenAI({
    apiKey: env.OPENAI_API_KEY,
    model: 'gpt-4o-mini',
    temperature: 0.7,
});

// Initialize the sentence transformer
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

// Initialize the embeddings
const embeddings = new OpenAIEmbeddings({
    apiKey: env.OPENAI_API_KEY,
    model: 'text-embedding-3-small',
});


// Initialize the Pinecone store
let vectorStorePromise: Promise<PineconeStore> | null = null;
// const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
//     pineconeIndex: index,
// });

function getVectorStore() {
    if (!vectorStorePromise) {
        console.log('Initializing Pinecone store');
        vectorStorePromise = PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: index,
        });
        console.log('Pinecone store initialized');
    }
    return vectorStorePromise;
}


// Create the retriever
//const retriever = vectorStore.asRetriever({ k: 4 });

// Create prompt template
const prompt = ChatPromptTemplate.fromTemplate(`
Answer the question based only on the following context:

{context}

Question: {question}

Answer:`);

// Build the RAG chain
export const ragChain = RunnableSequence.from([
    {
        context: async (input: {question: string}) => {
            console.log('Retrieving documents for question:', input.question);

            // embed the questions using the sentence transformer
            const queryEmbedding = await embedQuery(input.question);
            console.log('Embedded query:', queryEmbedding);

            // Query the Pinecone index
            const results = await index.query({
                vector: queryEmbedding,
                topK: 4,
                includeMetadata: true,
            });
            console.log('Pinecone query results:', results);


            return results.matches
                .map(match => match.metadata?.text || '')
                .filter((text:any) => typeof text === 'string' && text.length > 0)
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