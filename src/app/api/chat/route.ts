import { ragChain } from '@/lib/rag/chain';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { question } = await request.json();

        if (!question) {
            return NextResponse.json(
                { error: 'Question is required' },
                { status: 400 }
            );
        }

        // Run the RAG chain
        const answer = await ragChain.invoke({ question });

        return NextResponse.json({ answer });
    } catch (error) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            { error: 'Failed to process question' },
            { status: 500 }
        );
    }
}