import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Chat({ auth, chat, messages: initialMessages }) {
    const [messages, setMessages] = useState(initialMessages || []);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (chat) {
            window.Echo.private(`chat.${chat.id}`)
                .listen('MessageSent', (e) => {
                    setMessages(prev => [...prev, e.message]);
                });
        }
        return () => {
            if (chat) window.Echo.leave(`chat.${chat.id}`);
        };
    }, [chat]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(route('chat.send', chat.id), {
                message: newMessage,
                type: 'text'
            });
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight uppercase">Pusat Bantuan & Live Chat</h2>}
        >
            <Head title="Live Chat | Simak Buy" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col h-[600px]">
                        {/* Chat Header */}
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-black">SB</div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase leading-none">Support Team Simak Buy</h3>
                                <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                                </p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-5 rounded-[1.5rem] text-sm font-bold ${msg.sender_id === auth.user.id ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                                        {msg.message}
                                        <p className={`text-[9px] mt-2 font-black uppercase opacity-60 ${msg.sender_id === auth.user.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-slate-50 bg-slate-50/30">
                            <form onSubmit={sendMessage} className="flex gap-4">
                                <input 
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Tulis pesan Anda di sini..."
                                    className="flex-1 px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-indigo-600 focus:ring-0 transition-all font-bold text-sm shadow-inner"
                                />
                                <button 
                                    type="submit"
                                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                                >
                                    Kirim <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
