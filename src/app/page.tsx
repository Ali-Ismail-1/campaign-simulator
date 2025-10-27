'use client';

import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer');
      }

      setAnswer(data.answer);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
      console.error('Frontend error:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
      <main className="w-full max-w-2xl">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            RAG Assistant
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Ask me anything from your knowledge base
          </p>

          {/* Input Area */}
          <div className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question here..."
              className="w-full h-32 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={loading}
            />

            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-medium transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'Thinking...' : 'Ask Question'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">
                ❌ {error}
              </p>
            </div>
          )}

          {/* Answer Display */}
          {answer && (
            <div className="mt-6 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                ANSWER
              </h2>
              <p className="text-zinc-900 dark:text-zinc-50 whitespace-pre-wrap leading-relaxed">
                {answer}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}