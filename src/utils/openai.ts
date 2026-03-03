export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ModuleContext {
  title: string;
  phase: string;
}

const SYSTEM_PROMPT = `Você é um assistente especialista em Linux e linha de comando (CLI).
Você ajuda estudantes que estão aprendendo comandos no terminal pela primeira vez.
Responda sempre em português brasileiro (pt-BR).
Seja conciso e use exemplos práticos.
Use formatação simples (sem markdown pesado).
Se o aluno perguntar algo fora do tema, redirecione gentilmente para Linux/CLI.`;

export async function sendChatMessage(
  messages: ChatMessage[],
  moduleContext?: ModuleContext
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const systemContent = moduleContext
    ? `${SYSTEM_PROMPT}\n\nO aluno está no módulo "${moduleContext.title}", fase: ${moduleContext.phase}.`
    : SYSTEM_PROMPT;

  const systemMessages: ChatMessage[] = [
    { role: 'system', content: systemContent },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [...systemMessages, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`API_ERROR_${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
