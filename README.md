# RuProjectSilverfish — русификация Project Silverfish (locres)

Локализация и пайплайн **на основе** [ProjectSilverfishRus](https://github.com/costilman/ProjectSilverfishRus) (costilman): формат locres, font-pak, эталон перевода.

FModel JSON → **[`translation/translation_map.json`](translation/translation_map.json)** → **`build/Game.locres.txt`**.  
Всё про перевод и глоссарий: **[translation/README.md](translation/README.md)**.

---

## Три команды (пайплайн 1)

| Шаг | Команда | Результат |
|-----|---------|-----------|
| 1 | **`npm run scan`** | После экспорта FModel в `fmodel_export/Exports/…` |
| 2 | *перевод* | **`translation/translation_map.json`** |
| 3 | **`npm run build`** | `build/Game.locres.txt` → UE4TextExtractor → **`npm run pack`** (zip) |

Дальше: **UE4TextExtractor** → `build/Game.locres` → `SilverFish/Content/Localization/Game/en/` + font-pak, язык в игре **English** (см. [Подготовка](#подготовка)).

**`npm run glossary`** — обновить `translation/glossary_for_llm.md`.

`npm run scan` рекурсивно обходит весь `Classes`, включая `Maps`. Неизменившиеся JSON берутся из кэша. Для принудительного полного пересканирования: `npm run scan:rescan`.

---

## Подготовка

```powershell
git clone <url-репозитория> RuProjectSilverfish
cd RuProjectSilverfish
npm install
```

### Инструменты (скачать отдельно)

| Инструмент | Зачем | Ссылка |
|------------|--------|--------|
| **FModel** | Экспорт `.uasset` → JSON | [GitHub — 4sval/FModel](https://github.com/4sval/FModel/releases) · [сайт](https://fmodel.app/) |
| **`.usmap`** | Мappings в FModel под версию игры | [usmap/README.md](usmap/README.md) — скачать или сгенерировать (UE4SS) |
| **UE4TextExtractor** | `Game.locres.txt` → бинарный `Game.locres` | [GitHub — VD42/UE4TextExtractor](https://github.com/VD42/UE4TextExtractor/releases) |

Настройка FModel:

- **Settings → Game** — **Enable Local Mapping File** → `.usmap` из `usmap/` (см. [как получить usmap](usmap/README.md))
- **Settings → Directory → Output** — **`fmodel_export`** (в итоге `fmodel_export/Exports/SilverFish/Content/Classes/…`)

Русский mod в игре: [ProjectSilverfishRus](https://github.com/costilman/ProjectSilverfishRus) (font-pak и пример `Game.locres`).

### Бинарный locres (после `npm run build`)

```powershell
UE4TextExtractor.exe build/Game.locres.txt build/Game.locres
```

Полную последовательность — создание текстового и бинарного locres, затем zip — можно выполнить одной командой:

```powershell
npm run release
```

Если игра mod не видит — добавь `-old`.

### Установка одним архивом

```powershell
npm run pack
```

Создаёт **`build/ProjectSilverfish-loc.zip`**: внутри **`SilverFish/`** — как в [ProjectSilverfishRus](https://github.com/costilman/ProjectSilverfishRus). Распаковать в **корень игры** с заменой.

Font-pak лежит в **`fonts/`** (см. [fonts/README.md](fonts/README.md)); **`npm run pack`** подхватит его в zip.

---

## Пайплайн 2 — батчи (LLM)

`npm run scan` в корне, затем **`batch-workflow/`**: `split` → перевод → `merge` → **`npm run build`**.

Промпт: **`translation/glossary_for_llm.md`**. См. **`batch-workflow/README.md`**.

---

## Структура (кратко)

```
fmodel_export/Exports/…     # экспорт FModel
translation/                # map + glossary
fonts/                      # SilverFishRU_FONTS_P.pak
work/                       # служебные JSON после scan
build/                      # Game.locres, zip
batch-workflow/             # батчи для LLM (опционально)
```

---

## После патча игры

```powershell
npm run scan
# новые ключи в translation/translation_map.json
npm run build
```

Scan сохраняет готовые переводы для неизменившихся `SourceString`, добавляет новые строки пустыми и удаляет устаревшие. Кэш находится в `work/` и не участвует в Git.

---

## Типичные ошибки

- **Пустой UI** — нет font-pak, язык не English.
- **Не меняется текст** — не трогать ключи map.
- **Scan пустой** — JSON не в `fmodel_export/Exports/SilverFish/…`.
