import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: 'Hello! I am your Pietra Plume Design Concierge. Ask me about our 15-day Agile renovations or for design advice!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Prepare history for API (exclude the very first greeting if needed, or map strictly)
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await getChatResponse(history, userMsg.text);
      
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      console.error("Chat error", error);
      let errorText = "I'm having trouble connecting to the design studio right now.";
      if (error.message && error.message.includes("API Key")) {
          errorText = "I cannot reply right now because the API Key is missing. Please check your configuration.";
      }
      const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: errorText };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] h-[500px] rounded-lg shadow-2xl border border-stone-200 mb-4 flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300 overflow-hidden">
          {/* Header */}
          <div className="bg-stone-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-600 rounded-full">
                <Sparkles size={14} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm">Pietra Plume Concierge</h3>
                <div className="flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                   <span className="text-[10px] text-stone-300 uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 bg-stone-50 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    msg.role === 'user' ? 'bg-stone-200 text-stone-600' : 'bg-stone-900 text-amber-500'
                  }`}
                >
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                
                <div 
                  className={`p-3 rounded-lg text-sm leading-relaxed max-w-[80%] shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-amber-100 text-amber-900 rounded-tr-none' 
                      : 'bg-white text-stone-700 rounded-tl-none border border-stone-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} />
                 </div>
                 <div className="bg-white p-4 rounded-lg rounded-tl-none border border-stone-100 shadow-sm">
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-stone-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-grow bg-stone-50 border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="bg-stone-900 text-white p-2 rounded hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 ${
          isOpen ? 'bg-stone-800 text-white rotate-90' : 'bg-amber-600 text-white hover:bg-amber-500'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

    </div>
  );
};