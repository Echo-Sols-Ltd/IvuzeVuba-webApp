"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastContext = React.createContext<{
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
} | null>(null)

type Toast = {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const removeToast = React.useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
  }, [])

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((currentToasts) => [...currentToasts, { ...toast, id }])

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      removeToast(id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-xs w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "relative flex flex-col gap-1 p-4 rounded-md shadow-lg transition-all",
              "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
              "animate-in fade-in-0 slide-in-from-top-full sm:slide-in-from-right-full",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-full"
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {toast.title}
              </h3>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {toast.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {toast.description}
              </p>
            )}
          </div>
        ))}
      </div>
      {null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToasterProvider")
  }
  return context
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((currentToasts) => [...currentToasts, { ...toast, id }])

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id))
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}
