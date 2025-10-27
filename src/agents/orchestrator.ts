import { RouterAgent } from "./router-agent";
import { RetrievalAgent } from "./retrieval-agent";
import { AnalysisAgent } from "./analysis-agent";

export class MultiAgentOrchestrator {
    private router: RouterAgent;
    private retrieval: RetrievalAgent;
    private analysis: AnalysisAgent;

    // Shared memory across agents
    private sharedMemory: {
        conversationHistory: Array<{ role: string; content: string }>;
        retrieveDocs: any[];
    } = {
        conversationHistory: [],
        retrieveDocs: [],
    }

    constructor() {
        this.router = new RouterAgent();
        this.retrieval = new RetrievalAgent();
        this.analysis = new AnalysisAgent();
    }

    async process(userQuery: string) {
        console.log(`[Orchestrator] Processing query: ${userQuery}`);

        // Step 1: Router decides
        const agentType = await this.router.route(userQuery);

        // Step 2: Execute appropriate agent
        let result;

        if (agentType === 'retrieval') {
            const docs = await this.retrieval.retrieve(userQuery);
            this.sharedMemory.retrieveDocs = docs;

            // Check if analysis is needed
            const needsAnalysis = await this.shouldAnalyze(userQuery);
            if (needsAnalysis) {
                const stats = await this.analysis.analyzeData(docs);
                const insight = await this.analysis.generateInsights(stats, userQuery);
                result = { docs, stats, insight };
            } else {
                result = { docs, analysis: null, insight: null };
            }
        } else if (agentType === 'analysis') {
            // Analyze previously retrieved docs
            if (this.sharedMemory.retrieveDocs.length > 0) {
                const stats = await this.analysis.analyzeData(this.sharedMemory.retrieveDocs);
                result = { stats };
            } else {
                result = { error: 'No data to analyze. Please retrieve data first.' };
            }
        } else {
            result = {
                message: 'I cannot help with that query. Please rephrase.'
            };
        }

        // Setp 3: Updated shared memory
        this.sharedMemory.conversationHistory.push(
            { role: 'user', content: userQuery },
            { role: 'assistant', content: JSON.stringify(result) },
        );

        console.log(`[Orchestrator] Result: ${JSON.stringify(result)}`);
        return result;
    }

    private async shouldAnalyze(query: string): Promise<boolean> {
        // simple heuristic: if query contains analysis keywords
        const analysisKeywords = [
            'how many', 'statistics', 'average', 'compare', 'analyze', 'summary', 'trend'
        ];
        return analysisKeywords.some(kw => query.toLowerCase().includes(kw));
    }

    // Tool: Agents can access shared memory
    getSharedMemory() {
        return this.sharedMemory;
    }
}