import { describe, it, expect, vi } from 'vitest';
import { POST } from '../route';

describe('/api/multi-agent', () => {
    it('should return 400 if query is missing', async () => {
        const req = new Request('http://localhost:3000/api/multi-agent', {
            method: 'POST',
            body: JSON.stringify({}),
        });
        
        const response = await POST(req);
        const data = await response.json();
        
        expect(response.status).toBe(400);
        expect(data.error).toBeDefined();
    });
    
    it('should process valid query', async () => {
        const req = new Request('http://localhost:3000/api/multi-agent', {
            method: 'POST',
            body: JSON.stringify({ query: 'test query' }),
        });
        
        const response = await POST(req);
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.result).toBeDefined();
    });
    
    it('should handle errors gracefully', async () => {
        // Mock orchestrator to throw error
        vi.mock('@/agents/orchestrator', () => ({
            MultiAgentOrchestrator: class {
                async process() {
                    throw new Error('Test error');
                }
            },
        }));
        
        const req = new Request('http://localhost:3000/api/multi-agent', {
            method: 'POST',
            body: JSON.stringify({ query: 'test' }),
        });
        
        const response = await POST(req);
        expect(response.status).toBe(500);
    });
});