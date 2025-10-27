import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MultiAgentOrchestrator } from '../orchestrator';

vi.mock('../router-agent', () => ({
    RouterAgent: class {
      async route(q: string) {
        return q.toLowerCase().includes('how many') ? 'analysis' : 'retrieval';
      }
    }
  }));
  
  vi.mock('@langchain/openai', () => ({
    ChatOpenAI: class {
      async invoke(_: any) {
        return { content: 'ok' };
      }
    }
  }));
  
  vi.mock('@/lib/rag/chain', () => ({
    embedQuery: vi.fn().mockResolvedValue(new Array(384).fill(0.1)),
    retrieveDocuments: vi.fn().mockResolvedValue([
      { id: 'doc1', score: 0.8 },
      { id: 'doc2', score: 0.6 }
    ]),
  }));
  
  vi.mock('@/utils/env', () => ({
    env: { OPENAI_MODEL: 'gpt-4o-mini', LLM_TEMPERATURE: 0 }
  }));

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