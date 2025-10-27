import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RetrievalAgent } from '../retrieval-agent';

// Mock the embedding function
vi.mock('@/lib/embeddings', () => ({
    embedQuery: vi.fn().mockResolvedValue(new Array(384).fill(0.1)),
}));

describe('RetrievalAgent', () => {
    let agent: RetrievalAgent;
    
    beforeEach(() => {
        agent = new RetrievalAgent();
    });
    
    it('should retrieve documents for a query', async () => {
        const query = 'What is the salary policy?';
        const results = await agent.retrieve(query);
        
        expect(results).toBeDefined();
        expect(results).toBeInstanceOf(Array);
    });
    
    it('should store queries in memory', async () => {
        const query = 'test query';
        await agent.retrieve(query);
        
        const memory = await agent.checkMemory('test');
        expect(memory.length).toBeGreaterThan(0);
        expect(memory[0].query).toBe(query);
    });
    
    it('should handle empty results gracefully', async () => {
        // Mock empty results
        vi.mock('@/lib/pinecone/client', () => ({
            index: {
                query: vi.fn().mockResolvedValue({ matches: [] }),
            },
        }));
        
        const results = await agent.retrieve('nonexistent query');
        expect(results).toHaveLength(0);
    });
});