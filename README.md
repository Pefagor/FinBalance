# FinAI - финансовый помощник с AI-советами

Сервис загружает банковскую выписку PDF, автоматически парсит транзакции,
строит дашборд с аналитикой и дает персональные AI-советы по расходам.

## Стек

| Слой | Технология |
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| UI | Tailwind CSS, shadcn/ui, Recharts, next-themes |
| Backend | Next.js API Routes (Node.js) |
| Python | Python, `parser.py`, `ai-module/generateAdvice.py` |
| AI | routerai.ru|
| Пакетный менеджер | pnpm |

## Требования

- **Node.js** v18 и выше
- **pnpm**
- **Python**

## Установка

### 1. Клонировать проект

```bash
git clone https://github.com/Pefagor/FinBalance.git
```

### 2. Установить зависимости пакета

```bash
pnpm install
```

### 3. Создать файл переменных окружения

В корне проекта создай файл `.env.local`:

```env
API_KEY_ROUTERAI=твой_ключ_с_routerai.ru
```

### 4. Установить python-зависимости

Наличие Python нужно для реального парсинга и AI. Создай и активируй virtualenv:

**Windows (Git Bash):**
```bash
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
```

**Windows (PowerShell):**
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**macOS / Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

> По умолчанию `lib/pythonBridge.ts` ищет `python` в PATH. Если у тебя другой путь, укажи его в `.env.local`:
> ```env
> PYTHON_PATH=C:/Users/your_user/AppData/Local/Programs/Python/Python311/python.exe
> ```

## Запуск

### Запустить в режиме разработки

```bash
pnpm dev
```

Открой [http://localhost:3000](http://localhost:3000)

### Mock-режим (не нужен Python)

Если Python не установлен или ключ AI отсутствует, проект заработает
на фейковых данных из `data/mock-transactions.ts` - так проще смотреть UI.

### Продакшн-сборка

```bash
pnpm build
pnpm start
```

## Структура проекта

```text
fbmaybefinal/
├── app/
│   ├── api/
│   │   ├── parse-pdf/route.ts      # API для parser.py
│   │   └── get-advice/route.ts     # API для generateAdvice.py
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── finance/                    # доменные компоненты
│   ├── layout/                     # header, sidebar
│   └── ui/                         # shadcn/ui примитивы
├── lib/
│   ├── pythonBridge.ts             # мост Node -> Python
│   ├── mockPythonBridge.ts         # заглушка для деплоя
│   └── analytics.ts
├── ai-module/
│   ├── generateAdvice.py
│   ├── prompt_system.txt
│   ├── structured_output.json
│   └── user.json
├── types/finance.ts
├── data/mock-transactions.ts
├── parser.py
├── pnpm-lock.yaml
├── next.config.mjs
└── tsconfig.json
```

## Как это работает

```
Загрузка PDF -> /api/parse-pdf -> parser.py -> JSON транзакций -> дашборд
AI-советы  -> /api/get-advice -> ai-module/generateAdvice.py -> routerai.ru -> советы
```

Frontend никогда не вызывает Python напрямую - всегда через Next.js API Routes.
Это защищает ключ `API_KEY_ROUTERAI` и позволяет деплоить на платформы без Python (используется mock-режим).

## Полезные команды

```bash
pnpm lint          # проверка кода
pnpm build         # сборка
git status         # проверить изменения перед коммитом
```
