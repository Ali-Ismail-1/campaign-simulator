import { ChatOpenAI } from "@langchain/openai";
import { env } from "@/utils/env";
import { Anek_Latin } from "next/font/google";

export class AnalysisAgent {
    private llm: ChatOpenAI;
    private name = "AnalysisAgent";

    constructor() {
        this.llm = new ChatOpenAI({
            model: env.OPENAI_MODEL,
            temperature: env.LLM_TEMPERATURE,
        });
    }

    // Tool: Calculate statistics
    async analyzeData(data: any[]) {
        console.log(`[${this.name}] Analyzing ${data.length} items`);

        // Example: Analyze retrieval scores
        const scores = data.map(item => item.score || 0);
        return {
            count: scores.length,
            avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
            minScore: Math.min(...scores),
            maxScore: Math.max(...scores),
        };
    }


    // Tool: Generate insights
    async generateInsights(analysis: any, context: string) {
        const prompt = `
Given this analysis: ${JSON.stringify(analysis)}

Context: ${context}

Provide a brief insight about the data quality.`;

        const result = await this.llm.invoke(prompt);
        return result.content.toString();
    }
}