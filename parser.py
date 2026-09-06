from pathlib import Path
import re
import json
import sys
from pypdf import PdfReader

# Принимаем аргументы: python parser.py <input.pdf> <output.json>
if len(sys.argv) < 3:
    print("Использование: python parser.py <input.pdf> <output.json>")
    sys.exit(1)

PDFfile = Path(sys.argv[1])
output_path = Path(sys.argv[2])

user_id = "user123"


categoryword = {
    "Рестораны и кафе": "еда",
    "Супермаркеты": "еда",
    "Фастфуд": "еда",
    "Отдых и развлечения": "развлечения",
    "Кино": "развлечения",
    "Транспорт": "транспорт",
    "Здоровье и красота": "здоровье",
    "Аптеки": "здоровье",
    "Все для дома": "дом",
    "Спорт": "спорт",
}


def amount(amounttext):

    amounttext = (
        amounttext
        .replace("\xa0", "")
        .replace(" ", "")
        .replace("+", "")
        .replace(",", ".")
    )

    return float(amounttext)


def operation_type(amounttext):
    if amounttext.strip().startswith("+"):
        return "доход"
    return "расход"


def transaction_category(bank_category):
    if bank_category in categoryword:
        return categoryword[bank_category]
    if "перевод" in bank_category.lower():
        return "переводы"
    return "прочее"


def clean(description):
    description = re.sub(
        r"\.?\s*Операция по (карте|счету).*", "", description,
        flags=re.IGNORECASE
    )
    return description.strip(" .")


def recipient_type(bank_category, operation):
    category_lower = bank_category.lower()
    if "перевод" in category_lower:
        if operation == "расход":
            return "person"
        return "person"

    if operation == "расход":
        return "organization"
    return "organization"


def get_recipient(description):
    return description


format_re = re.compile(
    r"^\d{2}\.\d{2}\.\d{4}\s+\d{6}\s+(.*)$"
)


transaction_re = re.compile(
    r"^"
    r"(\d{2}\.\d{2}\.\d{4})\s+"
    r"(\d{2}:\d{2})\s+"
    r"(.+?)\s+"
    r"([+]?\d[\d\xa0 ]*,\d{2})\s+"
    r"([\d\xa0 ]+,\d{2})$"
)


def transaction(PDFfile, user_id):
    reader = PdfReader(str(PDFfile))
    lines = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            for line in page_text.splitlines():
                line = line.strip()
                if line:
                    lines.append(line)


    transactions = []

    transaction_counter = 1

    i = 0


    while i < len(lines):
        match = transaction_re.match(lines[i])
        if not match:
            i += 1
            continue

        date, time, bank_category, amount_text, balance = match.groups()

        description_parts = []

        i += 1


        if i < len(lines):
            auth_match = format_re.match(lines[i])
            if auth_match:
                description_parts.append(
                    auth_match.group(1)
                )
                i += 1
                while i < len(lines):
                    next_line = lines[i]
                    if transaction_re.match(next_line):
                        break
                    if next_line.startswith((
                        "Продолжение",
                        "Выписка по",
                        "ДАТА ОПЕРАЦИИ",
                        "Дата формирования"
                    )):
                        break

                    description_parts.append(next_line)
                    i += 1


        full_description = " ".join(description_parts)
        clean_text = clean(full_description)


        current_operation_type = operation_type(
            amount_text
        )

        category = transaction_category(
            bank_category
        )


        type_of_recipient = recipient_type(
            bank_category,
            current_operation_type
        )


        recipient = get_recipient(
            clean_text
        )

        current_transaction = {
            "transaction_id": transaction_counter,
            "user_id": user_id,
            "date": date,
            "time": time,
            "amount": amount(amount_text),
            "currency": "RUB",
            "operation_type": current_operation_type,
            "category": category,
            "recipient_type": type_of_recipient,
            "recipient": recipient,
            "description": clean_text
        }


        transactions.append(
            current_transaction
        )
        transaction_counter += 1


    return transactions


transactions = transaction(
    PDFfile,
    user_id
)


with open(
    output_path, "w", encoding="utf-8"
    ) as file:

    json.dump(
        transactions, file, ensure_ascii=False, indent=4
    )


print("Парсинг завершён!")

print(
    f"Найдено операций: {len(transactions)}"
)







