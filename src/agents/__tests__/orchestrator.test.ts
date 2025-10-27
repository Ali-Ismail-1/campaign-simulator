import { describe, it, expect, beforeEach } from 'vitest';
import { MultiAgentOrchestrator } from '../orchestrator';

describe('MultiAgentOrchestrator', () => {
    let orchestrator: MultiAgentOrchestrator;
    
    beforeEach(() => {
        orchestrator = new MultiAgentOrchestrator();
    });
    
    it('should route to retrieval agent for knowledge queries', async () => {
        const result = await orchestrator.process(
            'What is our vacation policy?'
        );
        
        expect(result).toHaveProperty('docs');
        expect(result.docs).toBeDefined();
    });
    
    it('should route to analysis agent for analytical queries', async () => {
        // First retrieve some data
        await orchestrator.process('Show me employee data');
        
        // Then analyze
        const result = await orchestrator.process(
            'How many documents did we find?'
        );
        
        expect(result).toHaveProperty('stats');
    });
    
    it('should maintain shared memory across calls', async () => {
        await orchestrator.process('First query');
        await orchestrator.process('Second query');
        
        const memory = orchestrator.getSharedMemory();
        expect(memory.conversationHistory.length).toBe(4); // 2 queries + 2 responses
    });
});