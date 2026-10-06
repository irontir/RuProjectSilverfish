# Контекст перевода

- **Папка:** `translation/` — map + glossary
- **Пайплайн 1:** `npm run scan` → `translation/translation_map.json` → `npm run build`
- **Пайплайн 2:** `batch-workflow/` — `split` / `merge`, затем `npm run build`
- **Промпт:** `npm run glossary` → `translation/glossary_for_llm.md`

Ключ map = **SourceString** (не менять). Плейсхолдеры `:WepToggle:` и `\r\n` сохранять.
