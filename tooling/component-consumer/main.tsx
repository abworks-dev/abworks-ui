// Resolve every barrel as declarations too, without forcing all runtime modules into this smoke bundle.
import type * as RootExports from '@abworks-dev/ui'
import type * as CoreExports from '@abworks-dev/ui/core'
import type * as TableExports from '@abworks-dev/ui/data-table'
import type * as TreeFixtureExports from '@abworks-dev/ui/testing/tree-fixture'
export type PublicBarrels = [typeof RootExports, typeof CoreExports, typeof TableExports, typeof TreeFixtureExports]
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '@abworks-dev/ui/core/button'
import { Input } from '@abworks-dev/ui/core/input'
import { Label } from '@abworks-dev/ui/core/label'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@abworks-dev/ui/core/dialog'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@abworks-dev/ui/core/tooltip'

function App() {
  const [count, setCount] = useState(0)
  const [submitted, setSubmitted] = useState('')
  return <main style={{ padding: 32, maxWidth: 640 }}>
    <h1>ABWorks archive consumer</h1>
    <Button onClick={() => setCount(count + 1)}>Count {count}</Button>
    <form onSubmit={event => {
      event.preventDefault()
      setSubmitted(String(new FormData(event.currentTarget).get('name')))
    }}>
      <Label htmlFor="name">Name</Label>
      <Input id="name" name="name" required />
      <Button type="submit">Save</Button>
      <output aria-label="Saved name">{submitted}</output>
    </form>
    <Dialog>
      <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogTitle>Archive dialog</DialogTitle>
        <DialogDescription>Portal inherits the document theme.</DialogDescription>
        <Input aria-label="Dialog input" />
      </DialogContent>
    </Dialog>
    <TooltipProvider><Tooltip>
      <TooltipTrigger render={<Button />}>Help</TooltipTrigger>
      <TooltipContent>Archive tooltip</TooltipContent>
    </Tooltip></TooltipProvider>
    <Button onClick={() => document.documentElement.classList.toggle('dark')}>Toggle dark</Button>
  </main>
}

createRoot(document.getElementById('root')!).render(<App />)
