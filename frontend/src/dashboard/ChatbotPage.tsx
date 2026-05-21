import { useState, useEffect, useRef } from 'react';
import { User, ChatMessage, apiFetch } from './shared';

export default function ChatbotPage({ user }: { user: User }) {
  const initMsg: ChatMessage = {
    role: 'assistant',
    content: `Bonjour ${user.nom} ! 👋 Je suis Mowajih AI. Je connais votre profil, vos notes et vos intérêts. Comment puis-je vous aider ?`,
  };
  const [messages, setMessages] = useState<ChatMessage[]>([initMsg]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'Quelle CPGE me conseilles-tu ?',
    'Comment améliorer mes maths ?',
    'Quels concours dois-je préparer ?',
    'Quel métier correspond à mon profil ?',
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const resetConversation = () => setMessages([initMsg]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      // Pass full history for memory (last 10 exchanges = 20 messages)
      const history = newMessages.slice(-20, -1).map(m => ({ role: m.role, content: m.content }));
      const data = await apiFetch('/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({ message: msg, eleveId: user.id, history }),
      });
      setMessages(m => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: "Désolé, une erreur s'est produite. Vérifiez votre connexion." }]);
    } finally {
      setLoading(false);
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button onClick={resetConversation} style={{
          fontSize: 12, color: '#94a3b8', background: 'rgba(255,255,255,0.8)',
          border: '1px solid #e2e8f0', borderRadius: 8, padding: '5px 12px',
          cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
        }}>
          🔄 Nouvelle conversation
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 8 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700,
              background: msg.role === 'assistant' ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#f1f5f9',
              color: msg.role === 'assistant' ? '#fff' : '#64748b',
            }}>
              {msg.role === 'assistant' ? '🤖' : user.nom.charAt(0).toUpperCase()}
            </div>
            <div style={{
              maxWidth: '75%', padding: '12px 16px', fontSize: 13.5, lineHeight: 1.6, whiteSpace: 'pre-wrap',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#fff',
              color: msg.role === 'user' ? '#fff' : '#1e293b',
              boxShadow: msg.role === 'user' ? '0 4px 12px rgba(124,58,237,0.3)' : '0 2px 8px rgba(15,12,41,0.06)',
              border: msg.role === 'assistant' ? '1px solid rgba(139,92,246,0.1)' : 'none',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {showSuggestions && (
          <div style={{ padding: '4px 0' }}>
            <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Suggestions</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  padding: '7px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  background: 'rgba(124,58,237,0.08)', color: '#7c3aed',
                  border: '1px solid rgba(124,58,237,0.2)', transition: 'all .15s',
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🤖</div>
            <div style={{ background: '#fff', borderRadius: '18px 18px 18px 4px', padding: '14px 18px', border: '1px solid rgba(139,92,246,0.1)', display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 150, 300].map(delay => (
                <span key={delay} style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa', display: 'inline-block', animation: 'bounce 1s infinite', animationDelay: `${delay}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ paddingTop: 14, borderTop: '1px solid rgba(139,92,246,0.08)' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Posez votre question à Mowajih AI..."
            className="dash-input"
            style={{ flex: 1 }}
            onFocus={e => (e.target.style.borderColor = '#7c3aed')}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              width: 44, height: 44, borderRadius: 12, border: 'none',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              background: input.trim() && !loading ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#e2e8f0',
              color: input.trim() && !loading ? '#fff' : '#94a3b8',
              fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'all .2s',
              boxShadow: input.trim() && !loading ? '0 4px 12px rgba(124,58,237,0.35)' : 'none',
            }}
          >↑</button>
        </div>
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>
          Se souvient de votre conversation · Contexte personnalisé · {messages.length - 1} message{messages.length !== 2 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
