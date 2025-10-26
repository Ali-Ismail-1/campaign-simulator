import 'dotenv/config';

export const env = {
    OPEN_API_KEY: process.env.OPEN_API_KEY || '',
    PINECONE_API_KEY: process.env.PINECONE_API_KEY || '',
    PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT || '',
    PINECONE_INDEX: process.env.PINECONE_INDEX || '',
};