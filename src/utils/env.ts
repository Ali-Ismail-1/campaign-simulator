import 'dotenv/config';

export const env = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    PINECONE_API_KEY: process.env.PINECONE_API_KEY || '',
    PINECONE_INDEX: process.env.PINECONE_INDEX || '',
};