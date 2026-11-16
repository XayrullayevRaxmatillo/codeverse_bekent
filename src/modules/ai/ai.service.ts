import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyModel, Doc, M } from '../../database/schemas';
import { aiStatus, ChatMessage, complete } from '../../lib/ai/providers';
import { buildSystemPrompt } from '../../lib/ai/prompts';
import { levelForXp } from '../../lib/gamification';
import { tx } from '../../lib/i18n';
import type { ChatDto } from './ai.controller';

@Injectable()
export class AiService {
  constructor(
    @InjectModel(M.Lesson) private readonly lessons: AnyModel,
    @InjectModel(M.Challenge) private readonly challenges: AnyModel,
  ) {}

  status() {
    const s = aiStatus();
    return { enabled: s.enabled, provider: s.provider, setup: s.enabled ? null : s.setup };
  }

  async chat(user: Doc, { mode, lang, message, code, error, lessonId, challengeId, history }: ChatDto) {
    const [lesson, challenge] = await Promise.all([
      lessonId ? this.lessons.findById(lessonId).select('title').lean<any>() : null,
      challengeId ? this.challenges.findById(challengeId).select('title instructions').lean<any>() : null,
    ]);
    const system = buildSystemPrompt({
      mode,
      lang,
      level: levelForXp(user.xp),
      lessonTitle: lesson ? tx(lesson.title, lang) : null,
      challenge: challenge ? `${tx(challenge.title, lang)} — ${tx(challenge.instructions, lang).slice(0, 800)}` : null,
    });
    const parts: string[] = [];
    if (message) parts.push(message);
    if (code) parts.push(`\nCode:\n\`\`\`\n${code}\n\`\`\``);
    if (error) parts.push(`\nError message:\n\`\`\`\n${error}\n\`\`\``);
    if (!parts.length) parts.push(mode === 'generate' ? 'Generate a practice challenge for my level.' : 'Help me.');
    // Tarix navbatma-navbat bo'lishi kerak: user/assistant
    const msgs: ChatMessage[] = [];
    for (const m of history) if (!msgs.length ? m.role === 'user' : msgs[msgs.length - 1].role !== m.role) msgs.push(m as ChatMessage);
    if (msgs.length && msgs[msgs.length - 1].role === 'user') msgs.pop();
    msgs.push({ role: 'user', content: parts.join('\n') });
    const reply = await complete({ system, messages: msgs, maxTokens: mode === 'review' || mode === 'generate' ? 1600 : 1000 });
    return { reply };
  }
}
