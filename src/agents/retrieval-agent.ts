import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { env } from '@/utils/env';
import { embedQuery, retrieveDocuments } from "@/lib/rag/chain";

export class RetrievalAgent {
    private llm: ChatOpenAI;
    private name = "RetrievalAgent";

    constructor() {
        this.llm = new ChatOpenAI({
            model: env.OPENAI_MODEL,
            temperature: env.LLM_TEMPERATURE,
        });
    }

    // Memory: Store what agent has retrieved
    private memory: Array<{ query: string; docs: any[]}> = [];

    async retrieve(query: string) {
        console.log(`[${this.name}] Retrieving documents for query: ${query}`);

        // Existing retrival logic
        const embedding = await embedQuery(query);
        const results = await retrieveDocuments(embedding, 8);

        // Store in memory
        this.memory.push({ query, docs: results });

        return results;
    }

    // Tool: Agent can check its own memory
    async checkMemory(query: string) {
        const similar = this.memory.filter(m => 
            m.query.toLowerCase().includes(query.toLowerCase())
        );
        return similar;
    }
}