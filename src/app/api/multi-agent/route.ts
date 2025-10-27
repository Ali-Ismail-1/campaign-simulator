import { NextResponse } from 'next/server';
import { MultiAgentOrchestrator } from '@/agents/orchestrator';

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json (
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        const orchestrator = new MultiAgentOrchestrator();
        const result = await orchestrator.process(query);

        return NextResponse.json({
            success: true,
            result,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('Error in multi-agent API:', error);
        return NextResponse.json(
            {
                error: 'Failed to process query',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
