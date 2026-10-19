import type { MessagePart } from './message-types'

export const aiElementsSource = {
  owner: 'ai-elements',
  repository: 'https://github.com/vercel/ai-elements',
  commit: '6a9d5b1822ffb10bba4bd97175f01edd7d8651cd',
  sourceRoot: 'packages/elements/src',
  license: 'Apache-2.0',
  adaptation: 'ABWorks DTOs, semantic tokens, and runtime-neutral props',
  components: ['audio-player', 'transcription', 'voice-selector', 'agent', 'artifact', 'environment-variables', 'file-tree', 'package-info', 'schema-display', 'snippet', 'stack-trace', 'terminal', 'test-results', 'sandbox', 'commit'],
} as const

export type MessagePartOf<T extends MessagePart['type']> = Extract<MessagePart, { type: T }>
export type { RuntimeMessage, MessagePart, MessageRole } from './message-types'
