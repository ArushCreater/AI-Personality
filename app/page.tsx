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
      <header className="sticky top-0 z-10 border-b border-white/[0.08] bg-black/80 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 animate-fade-in">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-sm sm:text-base font-semibold text-white/90">
              Arush's AI Twin
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow"></div>
              <span className="text-xs text-white/50 hidden sm:inline">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8"
      >
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className={`transition-all duration-[2000ms] ease-out ${messages.length > 0 ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
            {messages.length === 0 && (
            <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] animate-fade-in">
              <div className="text-center space-y-6 sm:space-y-8 max-w-md px-4">
                {/* Animated Profile Picture with Gradient Aura */}
                <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32">
                  {/* Outer Glow Rings */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 blur-2xl animate-pulse-slow"></div>
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-xl animate-spin-slow"></div>
                  
                  {/* Middle Gradient Ring */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-purple-500/30 via-blue-500/30 to-indigo-500/30 blur-lg animate-float"></div>
                  
                  {/* Inner Gradient Border */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 p-[2px] animate-float" style={{ animationDelay: "0.2s" }}>
                    <div className="w-full h-full rounded-full bg-black"></div>
                  </div>
                  
                  {/* Profile Picture */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-sm flex items-center justify-center animate-float" style={{ animationDelay: "0.1s" }}>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-white/5 to-white/10 border border-white/20 flex items-center justify-center">
                      {/* User Profile Icon */}
                      <svg className="w-10 h-10 sm:w-14 sm:h-14 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Floating Particles */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-purple-400/60 blur-sm animate-float-particle"></div>
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-blue-400/60 blur-sm animate-float-particle" style={{ animationDelay: "1s" }}></div>
                  <div className="absolute top-1/4 -left-4 w-2.5 h-2.5 rounded-full bg-indigo-400/50 blur-sm animate-float-particle" style={{ animationDelay: "0.5s" }}></div>
                  <div className="absolute bottom-1/4 -right-4 w-2 h-2 rounded-full bg-purple-300/50 blur-sm animate-float-particle" style={{ animationDelay: "1.5s" }}></div>
                </div>

                {/* Text Content */}
                <div className="space-y-2 sm:space-y-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-white/90 tracking-tight">
                    Welcome
                  </h2>
                  <p className="text-white/40 text-xs sm:text-sm leading-relaxed px-2 sm:px-4">
                    Ask me about my experience in AI, cloud development, or any of my projects.
                  </p>
                </div>
              </div>
            </div>
            )}
          </div>

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2 sm:gap-4 animate-slide-up ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                message.role === "user" 
                  ? "bg-white text-black shadow-lg shadow-white/20" 
                  : "bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/20"
              }`}>
                {message.role === "user" ? (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0 space-y-1 sm:space-y-2 group">
                <div className={`prose prose-invert max-w-none ${
                  message.role === "user" ? "text-right" : ""
                }`}>
                  <div className={`inline-block text-left ${
                    message.role === "user" ? "max-w-[90%] sm:max-w-[85%]" : "max-w-full"
                  }`}>
                    <p className="text-sm sm:text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap break-words m-0 animate-text-appear">
                      {message.content}
                    </p>
                  </div>
                </div>
                
                {/* Message Actions */}
                <div className={`flex items-center gap-2 opacity-0 sm:group-hover:opacity-100 transition-all duration-200 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}>
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 active:bg-white/15 transition-all duration-200 hover:scale-110 active:scale-95"
                    title="Copy to clipboard"
                  >
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/50 hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 sm:gap-4 animate-slide-up">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center animate-pulse-glow">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex space-x-1 sm:space-x-1.5">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/30 rounded-full animate-bounce-smooth"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/30 rounded-full animate-bounce-smooth" style={{ animationDelay: "0.15s" }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/30 rounded-full animate-bounce-smooth" style={{ animationDelay: "0.3s" }}></div>
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
          className="fixed bottom-24 sm:bottom-32 left-1/2 -translate-x-1/2 p-2.5 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce-in shadow-xl shadow-white/10"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 px-3 sm:px-6 py-3 sm:py-4 md:py-6 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none safe-area-bottom">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl px-2 py-2 focus-within:border-white/20 transition-all duration-300 hover:border-white/15">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Arush..."
              disabled={isLoading}
              rows={1}
              className="flex-1 bg-transparent text-white text-sm sm:text-[15px] placeholder-white/40 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none max-h-32 py-2 sm:py-2.5 px-3 sm:px-4 leading-6"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white text-black hover:bg-white/90 focus:outline-none disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100"
            >
              {isLoading ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

