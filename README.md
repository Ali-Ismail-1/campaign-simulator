# 🤖 Production-Grade RAG System

> A comprehensive Retrieval-Augmented Generation (RAG) implementation showcasing modern AI engineering practices, built for education and production deployment.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![LangChain](https://img.shields.io/badge/LangChain-1.0-green?style=for-the-badge)](https://langchain.com/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-orange?style=for-the-badge)](https://www.pinecone.io/)

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [RAG Pipeline Explained](#-rag-pipeline-explained)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Security & Privacy](#-security--privacy)
- [Performance](#-performance)
- [Blog Series](#-blog-series)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

This project demonstrates a **complete RAG (Retrieval-Augmented Generation) system** that combines vector search with large language models to provide accurate, context-aware answers from your own knowledge base.

**Built by an AI Engineer for AI Engineers** — This implementation prioritizes:
- 🔍 **Transparency**: Every step is documented and explained
- 🛠️ **Modularity**: Each component can be understood and modified independently
- 🎓 **Education**: Designed to teach RAG concepts through practical implementation
- 🔒 **Security**: Built-in PII redaction and data sanitization
- 💰 **Cost-Efficiency**: Local embeddings reduce API costs

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         RAG PIPELINE                             │
└─────────────────────────────────────────────────────────────────┘

   User Question
        │
        ▼
   ┌─────────────────┐
   │  STEP 1         │
   │  Embedding      │──── Xenova all-MiniLM-L6-v2 (384 dims)
   │  Component      │──── Runs locally, no API calls
   └────────┬────────┘
            │ Vector (float[384])
            ▼
   ┌─────────────────┐
   │  STEP 2         │
   │  Vector Store   │──── Pinecone Index
   │  Connection     │──── Serverless, auto-scaling
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │  STEP 3         │
   │  Semantic       │──── Cosine similarity search
   │  Retrieval      │──── Top-K documents (k=4)
   └────────┬────────┘
            │ Matched Documents
            ▼
   ┌─────────────────┐
   │  STEP 4         │
   │  Context        │──── PII Redaction
   │  Processing     │──── SSN, DOB, Salary filtering
   └────────┬────────┘
            │ Sanitized Context
            ▼
   ┌─────────────────┐
   │  STEP 5         │
   │  LLM            │──── GPT-4o-mini
   │  Generation     │──── Context + Question → Answer
   └────────┬────────┘
            │
            ▼
      Final Answer
```

---

## ✨ Key Features

### 🧠 **AI/ML Features**
- **Local Embeddings**: Privacy-first approach using Xenova Transformers
- **Vector Search**: Semantic similarity search powered by Pinecone
- **Context-Aware Generation**: LangChain orchestration with OpenAI GPT models
- **PII Protection**: Automatic redaction of sensitive information

### 🛠️ **Engineering Features**
- **Type-Safe**: Full TypeScript implementation
- **Modular Design**: Clean separation of concerns
- **Error Handling**: Comprehensive error recovery
- **Environment-Based Config**: Easy deployment across environments
- **Modern Stack**: Next.js 16 with App Router

### 📚 **Developer Experience**
- **Well-Documented**: Inline documentation explaining each step
- **Blog-Ready**: Code organized for educational content
- **Clean Architecture**: Easy to understand and extend
- **Open Source**: Learn from and contribute to the codebase

---

## 🔧 Tech Stack

### **Frontend**
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS 4** - Modern, utility-first styling
- **React 19** - Latest React features

### **AI/ML**
- **LangChain** - LLM orchestration framework
- **OpenAI GPT-4o-mini** - Text generation
- **Xenova Transformers** - Local embedding model
- **Pinecone** - Vector database for semantic search

### **Infrastructure**
- **Vercel** - Deployment platform (recommended)
- **Pinecone Serverless** - Auto-scaling vector DB
- **Environment Variables** - Secure configuration management

---

## 🔄 RAG Pipeline Explained

### What is RAG?

**Retrieval-Augmented Generation** enhances LLMs by providing relevant context from your knowledge base before generating answers. This solves several problems:

1. **Hallucination**: LLMs can make up information → RAG grounds answers in real data
2. **Knowledge Cutoff**: LLMs have training data cutoffs → RAG uses current information
3. **Domain-Specific**: LLMs lack specialized knowledge → RAG provides your documents

### The Six Steps

```typescript
// STEP 1: Convert question to numbers (embeddings)
question → [0.23, -0.45, 0.78, ...] // 384 dimensions

// STEP 2: Connect to vector database
Pinecone Index ← Pre-embedded documents

// STEP 3: Find similar documents
Query vector → Search → Top 4 matches

// STEP 4: Clean and prepare context
Retrieved text → Remove PII → Clean context

// STEP 5: Generate answer with LLM
Context + Question → GPT-4o-mini → Answer

// STEP 6: Return to user
Answer → Display
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Pinecone account ([Sign up free](https://www.pinecone.io/))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/rag-assistant.git
cd rag-assistant

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys
```

### Environment Setup

Create a `.env.local` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
LLM_TEMPERATURE=0.7

# Pinecone Configuration
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX=your-index-name
```

### Create Pinecone Index

```bash
# Using Pinecone CLI or Dashboard
# Important: Set dimension to 384 (matches all-MiniLM-L6-v2)
Name: your-index-name
Dimensions: 384
Metric: cosine
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your RAG assistant!

---

## 📁 Project Structure

```
rag-assistant/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts          # API endpoint for chat
│   │   ├── page.tsx                  # Main UI
│   │   ├── layout.tsx                # App layout
│   │   └── globals.css               # Global styles
│   ├── lib/
│   │   ├── rag/
│   │   │   └── chain.ts              # ⭐ Core RAG pipeline (6 steps)
│   │   ├── pinecone/
│   │   │   └── client.ts             # Pinecone initialization
│   │   └── langgraph/
│   │       └── graph.ts              # Advanced orchestration
│   └── utils/
│       └── env.ts                    # Environment variable validation
├── public/                           # Static assets
├── .env.local                        # Environment variables (create this)
├── .env.example                      # Environment template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

---

## ⚙️ Configuration

### Embedding Models

**Current**: `xenova/all-MiniLM-L6-v2` (384 dimensions, local)

**Why Local Embeddings?**
- ✅ **Privacy**: Questions never leave your server
- ✅ **Cost**: Completely free, no API charges
- ✅ **Speed**: After initial download (~50MB), it's faster
- ✅ **Compliance**: GDPR/HIPAA friendly

**Alternatives**:
```typescript
// OpenAI Small (cloud, 1536 dims)
const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-small'
});

// OpenAI Large (cloud, 3072 dims)
const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-large'
});
```

⚠️ **Important**: Pinecone index dimensions must match your embedding model!

### LLM Models

**Current**: `gpt-4o-mini` (Fast, cost-effective)

**Alternatives**:
- `gpt-4o` - More capable, higher cost (~15x)
- `gpt-4-turbo` - Balanced performance
- `gpt-3.5-turbo` - Faster, lower cost (legacy)

### Retrieval Configuration

```typescript
// In src/lib/rag/chain.ts

// Number of documents to retrieve
const topK = 4; // Adjust based on your needs (2-10 typical)

// Similarity threshold (optional)
scoreThreshold: 0.7 // Only return matches above this score
```

---

## 🔒 Security & Privacy

### PII Redaction

The system automatically redacts sensitive information before sending to the LLM:

- **Social Security Numbers**: `123-45-6789` → `SSN: [REDACTED]`
- **Date of Birth**: `01/15/1990` → `DOB: [REDACTED]`
- **Salary Information**: `$125,000` → `Salary: [REDACTED]`

```typescript
// Customize in src/lib/rag/chain.ts
function sanitizeForLLM(text: string, options = {
    removeSSN: true,
    removeDOB: true,
    removeSalary: true
})
```

**Add Custom Redaction:**
```typescript
// Example: Redact credit cards
if (options.removeCreditCard) {
    cleaned = cleaned.replace(
        /\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}/g,
        'CC: [REDACTED]'
    );
}
```

### Local Embeddings

Using Xenova means:
- ✅ Questions never sent to embedding API
- ✅ No external embedding costs
- ✅ Privacy-compliant processing
- ✅ Works offline (after model download)

### API Security

**Recommended Additions** (not implemented yet):
- Rate limiting (e.g., `next-rate-limit`)
- API key authentication
- CORS configuration
- Request size limits

---

## ⚡ Performance

### Benchmarks

| Operation | Time | Notes |
|-----------|------|-------|
| **Cold Start** | ~2-3s | First query, model loading |
| **Warm Queries** | ~1-2s | Subsequent queries |
| **Embedding** | ~100-200ms | Local processing |
| **Vector Search** | ~50-100ms | Pinecone latency |
| **LLM Generation** | ~1-2s | OpenAI API call |

### Optimization Tips

```typescript
// 1. Reduce retrieved documents (faster, less context)
const results = await retrieveDocuments(queryEmbedding, 2); // Instead of 4

// 2. Lower temperature (faster, more deterministic)
temperature: 0.3 // Instead of 0.7

// 3. Use smaller model
model: 'gpt-4o-mini' // Already optimized!

// 4. Implement caching
// Cache frequent questions to avoid repeat processing
```

### Scalability Considerations

- **Pinecone**: Serverless tier auto-scales
- **Next.js**: Deploy on Vercel for edge caching
- **Embeddings**: Model loads once per serverless function
- **Rate Limiting**: Implement to control costs

---

## 📝 Blog Series

This codebase is designed to support a comprehensive blog series on RAG implementation:

### Planned Articles

1. **Introduction to RAG** - What, why, and when to use RAG
2. **Vector Embeddings Deep Dive** - Understanding the math behind semantic search
3. **Vector Databases Explained** - Why Pinecone, and how it works
4. **Semantic Search Mechanics** - Cosine similarity and retrieval strategies
5. **Context Processing & Security** - PII redaction and data sanitization
6. **LLM Prompt Engineering** - Crafting effective prompts for RAG
7. **Production Considerations** - Security, scaling, and monitoring
8. **Advanced RAG Patterns** - Hybrid search, re-ranking, and more

> **Coming Soon**: Links will be added as articles are published

### Use This Code

Each component in `src/lib/rag/chain.ts` is documented as a standalone step, making it easy to explain in blog posts or tutorials. The code is designed to be:

- **Copy-paste friendly** - Each step works independently
- **Clearly commented** - Explanations inline with code
- **Production-quality** - Not just toy examples

---

## 🤝 Contributing

Contributions are welcome! This project serves as both a production implementation and educational resource.

### Areas for Contribution

- 🐛 Bug fixes and error handling improvements
- 📚 Documentation enhancements
- 🎨 UI/UX improvements
- 🧪 Test coverage
- 🔧 New features (streaming, caching, authentication)
- 📖 Blog content and tutorials
- 🌍 Internationalization

### Development Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- TypeScript for type safety
- ESLint for code quality
- Meaningful commit messages
- Documentation for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**TL;DR**: You can use this code for anything, including commercial projects. Just keep the copyright notice.

---

## 🎓 About the Author

**AI Engineer | Developer Advocate**

This project demonstrates:
- ✅ Production-grade AI system design
- ✅ Clear technical communication
- ✅ Modern full-stack development
- ✅ Educational content creation
- ✅ Open-source contribution

Building in public and sharing knowledge about AI engineering. Passionate about making complex AI concepts accessible and practical.

### Why This Project?

RAG systems are becoming fundamental to AI applications, but many tutorials skip important details like:
- How to handle PII in retrieved context
- Why certain embedding models work better
- The tradeoffs between local and cloud processing
- How to structure code for production

This project addresses those gaps.

**Connect with me**:
- 🐦 Twitter: [@Ali_F_Ismail]
- 💼 LinkedIn: [https://www.linkedin.com/in/ali-ismail-35196615/]
- 📝 Blog: [https://ali-ismail.com/]
- 🐙 GitHub: [@ali-ismail-1]

---

## 🙏 Acknowledgments

- [LangChain](https://langchain.com/) - For the excellent LLM orchestration framework
- [Pinecone](https://www.pinecone.io/) - For the vector database infrastructure
- [Xenova](https://github.com/xenova/transformers.js) - For bringing transformers to JavaScript
- [Next.js](https://nextjs.org/) - For the incredible React framework
- [OpenAI](https://openai.com/) - For the GPT models

---

## 📚 Additional Resources

### Learning RAG
- [LangChain RAG Tutorial](https://python.langchain.com/docs/use_cases/question_answering/)
- [Pinecone Learning Center](https://www.pinecone.io/learn/)
- [Vector Embeddings Explained](https://www.youtube.com/watch?v=wjZofJX0v4M)

### Related Projects
- [LangChain.js](https://github.com/langchain-ai/langchainjs)
- [Transformers.js](https://github.com/xenova/transformers.js)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

[Report Bug](https://github.com/yourusername/rag-assistant/issues) · [Request Feature](https://github.com/yourusername/rag-assistant/issues) · [Documentation](https://github.com/yourusername/rag-assistant/wiki)

Made with ❤️ and ☕ by an AI Engineer

</div>
