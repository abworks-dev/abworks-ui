import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useCallback, useState } from 'react'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

export function useControllableState<T>({ prop, defaultProp, onChange }: { prop?: T; defaultProp: T; onChange?: (value: T) => void }) {
  const [uncontrolled, setUncontrolled] = useState(defaultProp)
  const value = prop === undefined ? uncontrolled : prop
  const setValue = useCallback((next: T) => {
    if (prop === undefined) setUncontrolled(next)
    onChange?.(next)
  }, [onChange, prop])
  return [value, setValue] as const
}
