import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, getStoredApiKey, setStoredApiKey } from '../../utils/openai';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  moduleContext?: {
    title: string;
    phase: string;
  };
}

export function Chat({ moduleContext }: ChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(getStoredApiKey);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyDraft, setKeyDraft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function handleSaveKey() {
    setStoredApiKey(keyDraft);
    setApiKey(keyDraft.trim());
    setShowKeyInput(false);
    setKeyDraft('');
  }

  function handleRemoveKey() {
    setStoredApiKey('');
    setApiKey('');
    setShowKeyInput(false);
    setKeyDraft('');
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const response = await sendChatMessage(apiMessages, apiKey, moduleContext);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '';
      let errorMessage = 'Erro ao conectar com o assistente. Tente novamente.';
      if (msg === 'API_KEY_MISSING' || msg === 'API_ERROR_401') {
        errorMessage = 'Chave da API inválida ou ausente. Clique no ícone de chave para configurar.';
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg flex items-center justify-center transition-colors duration-200"
        aria-label={isOpen ? 'Fechar assistente' : 'Abrir assistente'}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[400px] max-h-[500px] flex flex-col bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-slate-700">
            <h3 className="text-gray-200 font-semibold text-sm">Assistente CLI</h3>
            <div className="flex items-center gap-2">
              {/* Key config button */}
              <button
                onClick={() => setShowKeyInput((v) => !v)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Configurar chave da API"
                title={apiKey ? 'Chave configurada' : 'Configurar chave da API'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </button>
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Fechar chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* API Key input panel */}
          {showKeyInput && (
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-700 space-y-2">
              <p className="text-xs text-slate-400">
                Cole sua chave da API da OpenAI. Ela fica salva apenas no seu navegador.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={keyDraft}
                  onChange={(e) => setKeyDraft(e.target.value)}
                  placeholder={apiKey ? '••••••••' : 'sk-...'}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-gray-200 placeholder-gray-500 outline-none focus:border-cyan-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
                />
                <button
                  onClick={handleSaveKey}
                  disabled={!keyDraft.trim()}
                  className="px-2 py-1.5 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded text-xs transition-colors"
                >
                  Salvar
                </button>
              </div>
              {apiKey && (
                <button
                  onClick={handleRemoveKey}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remover chave salva
                </button>
              )}
            </div>
          )}

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
            {messages.length === 0 && !isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">
                    Pergunte qualquer coisa sobre Linux e CLI!
                  </p>
                  {!apiKey && (
                    <p className="text-xs text-slate-500">
                      Clique no ícone de chave para configurar sua API key da OpenAI.
                    </p>
                  )}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-cyan-500/20 text-gray-200'
                      : 'bg-slate-700 text-gray-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-gray-400 px-3 py-2 rounded-lg text-sm italic">
                  Pensando...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="flex items-center gap-2 p-3 border-t border-slate-700 bg-slate-900">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua pergunta..."
              disabled={isLoading}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors"
              aria-label="Enviar mensagem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
