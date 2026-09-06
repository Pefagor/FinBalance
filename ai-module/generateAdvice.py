import sys
import io
import re

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
import json
import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
tokenAi = os.getenv("API_KEY_ROUTERAI")

if not tokenAi:
    sys.stderr.write("API_KEY_ROUTERAI is empty!\n")

if len(sys.argv) < 2:
    print("[]")
    sys.exit(0)

script_dir = Path(__file__).parent


def read_text(path):
    with open(path, "r", encoding="utf-8") as file:
        return file.read()


def read_json(path):
    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


client = OpenAI(
    api_key=tokenAi,
    base_url="https://routerai.ru/api/v1"
)

system_prompt = read_text(script_dir / "prompt_system.txt")
user_data = read_json(sys.argv[1])

try:
    response = client.chat.completions.create(
        model="openai/gpt-5.6-luna-pro",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": json.dumps(
                    user_data,
                    ensure_ascii=False,
                    indent=2
                )
            }
        ],
        response_format={"type": "json_object"}
    )

    content = response.choices[0].message.content

    # DEBUG: смотри в ADVICE STDERR в терминале Next.js
    sys.stderr.write(f"RAW LLM CONTENT: {content}\n")

    # На случай если роутер игнорирует response_format и оборачивает в ```json ... ```
    content_stripped = content.strip()
    if content_stripped.startswith("```"):
        content_stripped = re.sub(r"^```(?:json)?\s*", "", content_stripped)
        content_stripped = re.sub(r"\s*```\$", "", content_stripped)

    parsed = json.loads(content_stripped)

    # Модель может вернуть [...], {"advice": [...]}, {"advices": [...]}
    # или сразу один объект {"title": ..., "description": ...}
    if isinstance(parsed, list):
        result = parsed
    elif isinstance(parsed, dict):
        result = next(
            (v for v in parsed.values() if isinstance(v, list)),
            []
        )
        if not result and "title" in parsed and "description" in parsed:
            result = [parsed]
    else:
        result = []

    # Валидация с поддержкой разных названий ключей
    clean = []
    for item in result:
        if not isinstance(item, dict):
            continue

        title = item.get("title") or item.get("name") or item.get("heading")
        desc = (
            item.get("description")
            or item.get("text")
            or item.get("content")
            or item.get("advice")
        )

        if title and desc:
            clean.append({
                "title": str(title).strip(),
                "description": str(desc).strip()
            })

    sys.stderr.write(f"CLEAN COUNT: {len(clean)} from raw result count: {len(result)}\n")

    print(json.dumps(clean, ensure_ascii=False))

except Exception as e:
    sys.stderr.write(f"{type(e).__name__}: {str(e)}\n")
    print("[]")