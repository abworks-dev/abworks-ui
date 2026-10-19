import { createRoot } from 'react-dom/client'
import { Message } from '@aboard/ai-ui/message'
import type { RuntimeMessage } from '@aboard/ai-ui'
import type * as CanvasExports from '@aboard/ai-ui/canvas'
export type OptionalGraphExports = typeof CanvasExports

const message: RuntimeMessage = {
  id: 'external-message',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Optional AI archive consumer' }],
}
const root = document.createElement('section')
root.setAttribute('aria-label', 'Optional AI example')
document.body.append(root)
createRoot(root).render(<Message message={message} />)
