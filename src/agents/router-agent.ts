import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { env } from "@/utils/env";

type AgentType = 'retrieval' | 'analysis' | 'fallback';

export class RouterAgent {
    private llm: ChatOpenAI;

    constructor() {
        this.llm = new ChatOpenAI({
            model: env.OPENAI_MODEL,
            temperature: env.LLM_TEMPERATURE,
        });
    }

    async route(userQuery: string): Promise<AgentType> {
        const prompt = ChatPromptTemplate.fromTemplate(`
You are a routing agent. Determine which agent should handle this query:
- "retrieval": Query needs information from the knowledge base.
- "analysis": Query needs data analysis or calculations.
- "fallback": Query is unclear or cannot be handled.

Query: {query}

Respond with ONLY one word: retrieval, analysis, or fallback.
`);
        const chain = prompt.pipe(this.llm);
        const result = await chain.invoke({ query: userQuery });

        const decision = result.content.toString().toLowerCase().trim();
        console.log(`[RouterAgent] Routing decision: ${decision} for query: ${userQuery}`);

        return decision as AgentType;
    }
}