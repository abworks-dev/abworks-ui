/** Presentation-only message shapes. No transport, workspace or persistence authority. */
export type MessageRole = 'system' | 'user' | 'assistant' | 'tool'

export type MessagePart =
  | { type: 'text'; text: string }
  | { type: 'reasoning'; text: string }
  | {
      type: 'tool-call'
      toolCallId: string
      toolName: string
      input: unknown
      status: 'pending' | 'running' | 'waiting-approval' | 'succeeded' | 'failed'
    }
  | { type: 'tool-result'; toolCallId: string; output: unknown; isError?: boolean }
  | { type: 'file'; mediaType: string; url: string; filename?: string }

/** Existing Nexus messages are structurally assignable; runtime validation stays caller-owned. */
export type RuntimeMessage = {
  id: string
  role: MessageRole
  parts: MessagePart[]
  createdAt?: string
  metadata?: Record<string, unknown>
}
