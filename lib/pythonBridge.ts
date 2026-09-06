import type { Advice, Transaction } from "@/types/finance"
import { mockPythonBridge } from "./mockPythonBridge"

export interface PythonBridge {
  loadJson(filePath: string): Promise<Transaction[]>
  parsePdf(filePath: string): Promise<Transaction[]>
  generateAdvice(transactions: Transaction[]): Promise<Advice[]>
}

declare global {
  interface Window {
    pythonBridge?: PythonBridge
  }
}

const apiBridge: PythonBridge = {
  async loadJson(filePath: string): Promise<Transaction[]> {
    return mockPythonBridge.loadJson(filePath)
  },

  async parsePdf(filePath: string): Promise<Transaction[]> {
    // В браузерном режиме parsePdf вызывается через /api/parse-pdf с FormData,
    // этот метод остается для совместимости с Electron
    return mockPythonBridge.parsePdf(filePath)
  },

  async generateAdvice(_transactions: Transaction[]): Promise<Advice[]> {
    const res = await fetch("/api/get-advice", { method: "POST" })
    if (!res.ok) {
      const text = await res.text()
      console.error("get-advice failed:", text)
      throw new Error("Не удалось получить советы")
    }
    return res.json()
  },
}

export function getPythonBridge(): PythonBridge {
  if (typeof window !== "undefined" && window.pythonBridge) {
    return window.pythonBridge
  }
  // В браузере / Next.js используем apiBridge, а не мок
  if (typeof window !== "undefined") {
    return apiBridge
  }
  return mockPythonBridge
}