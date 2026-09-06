import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"

const execAsync = promisify(exec)

const SCRIPT_PATH = path.join(process.cwd(), "ai-module", "generateAdvice.py")
const OPERATIONS_JSON = path.join(process.cwd(), "data", "operations.json")

export async function POST() {
  if (!fs.existsSync(OPERATIONS_JSON)) {
    return NextResponse.json(
      { error: "Нет данных для анализа. Сначала загрузите выписку." },
      { status: 400 }
    )
  }

  try {
    const { stdout, stderr } = await execAsync(
      `python "${SCRIPT_PATH}" "${OPERATIONS_JSON}"`,
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          PYTHONIOENCODING: "utf-8",
          PYTHONUTF8: "1",
        },
        maxBuffer: 1024 * 1024 * 10, // на случай длинного ответа модели
      }
    )

    if (stderr) {
      console.error("ADVICE STDERR:", stderr)
    }
    console.log("ADVICE STDOUT:", stdout)

    let advice
    try {
      advice = JSON.parse(stdout.trim() || "[]")
    } catch (parseErr) {
      console.error("ADVICE PARSE ERROR:", parseErr, "RAW STDOUT:", stdout)
      return NextResponse.json(
        { error: "Не удалось разобрать ответ от модели" },
        { status: 500 }
      )
    }

    console.log("ADVICE PARSED COUNT:", Array.isArray(advice) ? advice.length : "not array")

    return NextResponse.json(advice)
  } catch (err) {
    console.error("ADVICE ERROR:", err)
    return NextResponse.json(
      { error: "Ошибка при генерации советов" },
      { status: 500 }
    )
  }
}