import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { btn, card, input } from '@/Components/ui';

type ChatMessage = {
  role: 'assistant' | 'user';
  text: string;
};

const suggestions = [
  'What should I do during a flood?',
  'Show open evacuation centers',
  'What are the active alerts?',
  'List emergency hotlines',
];

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hello. I can help you find local safety guidelines, active alerts, evacuation centers, and hotlines.' },
  ]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const submitMessage = (value: string) => {
    const submitted = value.trim();
    if (!submitted || sending) {
      return;
    }

    setMessages((current) => [...current, { role: 'user', text: submitted }]);
    setSending(true);
    router.post(route('chat.reply'), { message: submitted }, {
      preserveScroll: true,
      onSuccess: (page) => {
        const response = (page.props as { answer?: string }).answer;
        if (response) {
          setMessages((current) => [...current, { role: 'assistant', text: response }]);
        }
        setMessage('');
      },
      onError: () => setMessages((current) => [...current, { role: 'assistant', text: 'I could not process that message. Please try a shorter question.' }]),
      onFinish: () => setSending(false),
    });
  };

  return (
    <AppLayout title="Emergency assistant">
      <section className={`${card} mx-auto max-w-3xl`}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div>
            <h2 className="font-bold text-amber-400">Abuyog preparedness assistant</h2>
            <p className="mt-1 text-sm text-stone-400">Answers use the latest information listed in this system.</p>
          </div>
          <a href={route('guidelines')} className="text-sm font-semibold text-orange-400 hover:text-orange-300">Safety guide</a>
        </div>

        <div aria-live="polite" className="mb-5 max-h-[55vh] min-h-64 space-y-3 overflow-y-auto pr-1">
          {messages.map((item, index) => (
            <div key={`${item.role}-${index}`} className={`max-w-[90%] whitespace-pre-line rounded-md px-4 py-3 text-sm leading-6 ${item.role === 'user' ? 'ml-auto bg-orange-800 text-white' : 'border border-stone-700 bg-stone-950 text-stone-200'}`}>
              <p className="mb-1 text-xs font-bold uppercase text-amber-400">{item.role === 'user' ? 'You' : 'Assistant'}</p>
              {item.text}
            </div>
          ))}
          {sending && <p className="text-sm text-stone-500">Checking local emergency information...</p>}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button key={suggestion} type="button" disabled={sending} onClick={() => submitMessage(suggestion)} className="rounded border border-stone-700 px-3 py-2 text-left text-xs text-stone-300 hover:border-amber-500 hover:text-amber-300 disabled:opacity-50">
              {suggestion}
            </button>
          ))}
        </div>

        <form onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); submitMessage(message); }} className="flex items-end gap-2">
          <label className="sr-only" htmlFor="chat-message">Your question</label>
          <textarea id="chat-message" className={`${input} min-h-12 resize-y`} rows={2} maxLength={500} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about alerts, shelters, or preparedness" />
          <button className={btn} type="submit" disabled={sending || !message.trim()}>{sending ? 'Sending...' : 'Send'}</button>
        </form>
        <p className="mt-3 text-xs text-red-300">For immediate danger, call 911. This assistant is not an emergency dispatch service.</p>
      </section>
    </AppLayout>
  );
}