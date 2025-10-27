import { ragChain } from '@/lib/rag/chain';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        console.log('Received request');
        const { question } = await request.json();
        console.log('Question:', question);

        if (!question) {
            console.log('No question provided');
            return NextResponse.json(
                { error: 'Question is required' },
                { status: 400 }
            );
        }

        // Run the RAG chain
        console.log('Running RAG chain');
        const answer = await ragChain.invoke({ question });
        console.log('Answer:', answer);

        return NextResponse.json({ answer });
    } catch (error) {
        console.log('Error in chat API');
        console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
        console.error('Error message:', error instanceof Error ? error.message : error);
        console.error('Full error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Failed to process question';

        return NextResponse.json(
            { 
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined 
            },
            { status: 500 }
        );
    }
}