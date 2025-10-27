import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RetrievalAgent } from '../retrieval-agent';

// Mock the embedding function
vi.mock('@/lib/embeddings', () => ({
    embedQuery: vi.fn().mockResolvedValue(new Array(384).fill(0.1)),
}));

vi.mock('@/lib/rag/chain', () => ({
    embedQuery: vi.fn().mockResolvedValue(new Array(384).fill(0.1)),
    retrieveDocuments: vi.fn().mockResolvedValue([
      { id: 'doc1', score: 0.9 },
      { id: 'doc2', score: 0.7 },
    ]),
  }));
  
  vi.mock('@langchain/openai', () => ({
    ChatOpenAI: class {
      async invoke(_: any) {
        return { content: 'retrieval' };
      }
    }
  }));
  
  vi.mock('@/utils/env', () => ({
    env: { OPENAI_MODEL: 'gpt-4o-mini', LLM_TEMPERATURE: 0 }
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
    
    // it('should handle empty results gracefully', async () => {
    //     // Mock empty results
    //     vi.mock('@/lib/pinecone/client', () => ({
    //         index: {
    //             query: vi.fn().mockResolvedValue({ matches: [] }),
    //         },
    //     }));
        
    //     const results = await agent.retrieve('nonexistent query');
    //     expect(results).toHaveLength(0);
    // });
});