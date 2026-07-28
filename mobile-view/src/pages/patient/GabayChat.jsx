import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GabayChat() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Kumusta, Maria! I'm Gabay. Ask me anything about your results, appointments, or healthy habits — kahit walang signal."
    }
  ]);

  const suggestions = [
    "What does my result mean?",
    "How do I lower my sugar?",
    "Is my data private?"
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "I'm a simulated AI assistant for this demo. I can help you understand your health data." }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-surface page-enter relative z-50">
      <div className="flex items-center gap-3 px-4 py-4 bg-surface-container-lowest border-b border-outline-variant shrink-0 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white text-xl">auto_awesome</span>
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg leading-tight text-on-surface">Gabay</h2>
          <p className="text-[11px] text-secondary leading-tight mt-0.5">On-device model · 41 MB · no data leaves the phone</p>
        </div>
        <div className="flex items-center gap-1.5 bg-green-100 px-2.5 py-1 rounded-full border border-green-200">
          <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
          <span className="text-[10px] font-bold text-green-800 uppercase tracking-wider">Ready</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-sm shadow-md' : 'bg-surface-container text-on-surface rounded-bl-sm border border-outline-variant shadow-sm'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-surface-container-lowest border-t border-outline-variant shrink-0 pb-safe">
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map(s => (
            <button key={s} onClick={() => handleSend(s)} className="px-4 py-2 bg-surface rounded-full border border-outline-variant text-sm font-semibold text-secondary hover:bg-surface-container transition-colors shadow-sm active:scale-95">
              {s}
            </button>
          ))}
        </div>
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Tanong lang — I'm here to help..." 
            className="w-full bg-surface-container pl-5 pr-14 py-4 rounded-full border border-outline-variant focus:border-primary focus:outline-none transition-colors text-on-surface placeholder:text-secondary shadow-inner"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="absolute right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity active:scale-90"
          >
            <span className="material-symbols-outlined text-xl">arrow_upward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
