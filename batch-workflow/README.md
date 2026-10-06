# Батчи для LLM (пайплайн 2)

В корне: **`npm run scan`** → перевод через JSON-куски → **`npm run build`**.

| Команда | Действие |
|---------|----------|
| **`npm run split`** | Пустые ключи map → `batches/pending/all-NNN.json` |
| **`npm run merge`** | `batches/done/*.json` → `translation_map.json` |
| **`npm run status`** | Сколько переведено / пусто |

Промпт: **`../translation/glossary_for_llm.md`**.

Расширенное (один файл):  
`node scripts/export-batch.js Quests_DT.json` → после перевода  
`node scripts/import-batch.js batches/done/Quests_DT.json`
