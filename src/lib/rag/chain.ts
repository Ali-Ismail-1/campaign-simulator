import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { index } from '@/lib/pinecone/client';
import { env } from '@/utils/env';

// Initialize the LLM
const llm = new ChatOpenAI({
    apiKey: env.OPENAI_API_KEY,
    model: 'gpt-4o-mini',
    temperature: 0.7,
});

// Initialize the embeddings
const embeddings = new OpenAIEmbeddings({
    apiKey: env.OPENAI_API_KEY,
    model: 'text-embedding-3-small',
});

// Initialize the Pinecone store
const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
});

// Create the retriever
const retriever = vectorStore.asRetriever({ k: 4 });

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
            const docs = await retriever.invoke(input.question);
            return docs.map(doc => doc.pageContent).join('\n\n');
        },
        question: (input: {question: string}) => input.question,
    },
    prompt,
    llm,
    new StringOutputParser(),
]);