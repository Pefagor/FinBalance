import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"
import os from "os"

const execAsync = promisify(exec)

const SCRIPT_PATH = path.join(process.cwd(), "parser.py")
const OPERATIONS_JSON = path.join(process.cwd(), "data", "operations.json")

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const tempPath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`)
  fs.writeFileSync(tempPath, buffer)

  // Убедимся, что папка data/ существует
  fs.mkdirSync(path.dirname(OPERATIONS_JSON), { recursive: true })

  try {
    const { stdout, stderr } = await execAsync(
      `python "${SCRIPT_PATH}" "${tempPath}" "${OPERATIONS_JSON}"`,
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          PYTHONIOENCODING: "utf-8",
          PYTHONUTF8: "1",
        },
      }
    )

    console.log("PARSER STDOUT:", stdout)
    if (stderr) {
      console.error("PARSER STDERR:", stderr)
    }

    if (!fs.existsSync(OPERATIONS_JSON)) {
      return NextResponse.json(
        { error: "Парсер не создал файл с транзакциями" },
        { status: 500 }
      )
    }

    const transactions = JSON.parse(
      fs.readFileSync(OPERATIONS_JSON, "utf-8")
    )

    return NextResponse.json(transactions)
  } catch (err) {
    console.error("PARSER ERROR:", err)
    return NextResponse.json(
      { error: "Не удалось обработать файл" },
      { status: 500 }
    )
  } finally {
    fs.unlinkSync(tempPath)
  }
}