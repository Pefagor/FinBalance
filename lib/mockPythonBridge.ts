import { MOCK_TRANSACTIONS } from "@/data/mock-transactions"
import type { Advice, Transaction } from "@/types/finance"
import type { PythonBridge } from "./pythonBridge"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const MOCK_ADVICE: Advice[] = [
  {
    title: "Большие расходы на транспорт",
    description:
      "Транспорт занимает значительную часть вашего бюджета за выбранный период. Рассмотрите проездные абонементы или каршеринг вместо разовых поездок.",
  },
  {
    title: "Рост расходов в конце месяца",
    description:
      "В последние дни месяца ваши расходы заметно увеличиваются. Попробуйте распределять крупные покупки более равномерно в течение месяца.",
  },
  {
    title: "Рестораны — заметная статья расходов",
    description:
      "Расходы на кафе и рестораны выросли по сравнению с покупками продуктов. Готовка дома 2–3 раза в неделю может ощутимо сократить эту статью.",
  },
  {
    title: "Стабильный доход",
    description: "Ваш основной доход поступает регулярно и покрывает текущие расходы с запасом.",
  },
  {
    title: "Подписки и повторяющиеся платежи",
    description:
      "Обнаружены регулярные небольшие списания. Проверьте, все ли подписки по-прежнему вам нужны.",
  },
]

/**
 * In-memory stand-in for the real Electron/Python bridge. Simulates
 * realistic latency so loading states can be verified without any
 * native process running.
 */
export const mockPythonBridge: PythonBridge = {
  async loadJson(_filePath: string): Promise<Transaction[]> {
    await delay(900)
    return MOCK_TRANSACTIONS
  },

  async parsePdf(_filePath: string): Promise<Transaction[]> {
    await delay(2200)
    return MOCK_TRANSACTIONS
  },

  async generateAdvice(transactions: Transaction[]): Promise<Advice[]> {
    await delay(1600)
    if (transactions.length === 0) {
      return []
    }
    // Mirrors ai-module/generateAdvice.py, which returns 0-3 recommendation
    // objects. Shuffle the pool and cap the result to simulate that range.
    const count = Math.min(3, Math.floor(Math.random() * 4))
    const shuffled = [...MOCK_ADVICE].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  },
}
