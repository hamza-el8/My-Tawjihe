import { useState, useRef, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Bonjour ${user?.nom} ! Je suis Mowajih AI. Comment puis-je vous aider dans votre orientation ?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const { data } = await api.post('/chatbot/message', { message: msg, eleveId: user.id });
      setMessages(m => [...m, { role: 'assistant', text: data.reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: "Désolé, une erreur s'est produite. Vérifiez votre clé API OpenAI." }]);
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-black text-gray-800 mb-6">🤖 Chatbot IA</h2>
      <div className="card flex flex-col" style={{ height: '70vh' }}>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm ${
                m.role === 'user' ? 'text-white' : 'bg-gray-100 text-gray-800'
              }`} style={m.role === 'user' ? { background: '#0f2044' } : {}}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl text-sm text-gray-500">⏳ En train de répondre...</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t p-4 flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Posez votre question..." className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm" />
          <button onClick={send} disabled={loading || !input.trim()} className="btn-gold px-6 py-2 rounded-full text-sm">Envoyer</button>
        </div>
      </div>
    </Layout>
  );
}
