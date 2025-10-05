"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom && messages.length > 0);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/[0.08] bg-black/80 backdrop-blur-xl px-6 py-4 animate-fade-in">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10">
              <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-base font-semibold text-white/90">
              Arush's AI Twin
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow"></div>
              <span className="text-xs text-white/50">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-8"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
              <div className="text-center space-y-6 max-w-md">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10">
                  <svg
                    className="w-7 h-7 text-white/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white/90 mb-2">
                    Chat with Arush
                  </h2>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Ask me anything about AI, physics, coding, or just have a conversation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 animate-slide-up ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                message.role === "user" 
                  ? "bg-white text-black" 
                  : "bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
              }`}>
                {message.role === "user" ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0 space-y-2 group">
                <div className={`prose prose-invert max-w-none ${
                  message.role === "user" ? "text-right" : ""
                }`}>
                  <div className={`inline-block text-left ${
                    message.role === "user" ? "max-w-[85%]" : "max-w-full"
                  }`}>
                    <p className="text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap break-words m-0">
                      {message.content}
                    </p>
                  </div>
                </div>
                
                {/* Message Actions */}
                <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}>
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
                    title="Copy to clipboard"
                  >
                    <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 animate-fade-in">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/20 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 animate-fade-in shadow-lg"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-white/[0.08] bg-black/80 backdrop-blur-xl px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2 bg-white/5 border border-white/10 rounded-3xl px-4 py-2 focus-within:border-white/20 focus-within:bg-white/[0.07] transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Arush's AI Twin..."
              disabled={isLoading}
              rows={1}
              className="flex-1 bg-transparent text-white/90 text-[15px] placeholder-white/30 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none max-h-32 py-2"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 p-2 rounded-xl bg-white text-black hover:bg-white/90 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-white/30 text-center mt-3">
            Press Enter to send, Shift + Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
}

