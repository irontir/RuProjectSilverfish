# `.usmap` для FModel

Файл **mappings** — схема свойств UE5. Без него FModel не сможет нормально читать/экспортировать `.uasset` (ошибки про *unversioned properties*).

Положи сюда файл **под версию игры**, например `0.4.5.usmap`, и укажи его в FModel → **Settings** → **Enable Local Mapping File**.

---

## Вариант 1 — готовый файл

- [Releases ProjectSilverfishRus](https://github.com/costilman/ProjectSilverfishRus/releases) — `0.x.x.usmap` под разные версии
- Сообщества modding (Discord FModel / Project Silverfish) — часто выкладывают актуальный `.usmap` после патча

Имя файла лучше сделать понятным: **`версия_игры.usmap`**.

---

## Вариант 2 — сгенерировать самому

После **каждого патча игры** mappings нужно **пересобирать** — схема классов меняется.

### UE4SS (удобно для UE 5.x)

1. Установи **[RE-UE4SS](https://github.com/UE4SS-RE/RE-UE4SS/releases)** в папку игры  
   `…\Project Silverfish\SilverFish\Binaries\Win64\` (рядом с exe, по инструкции UE4SS).
2. В **`UE4SS-settings.ini`** включи GUI-консоль, например:
   - `GuiConsoleEnabled = 1`
   - `GuiConsoleVisible = 1`
3. Запусти игру, дождись меню, открой окно **UE4SS**.
4. Вкладка **Dumpers** → **Generate .usmap file** (или аналог *UnrealMappingsDumper*).
5. Файл появится рядом с exe или в папке UE4SS (часто `Mappings.usmap`) — **скопируй** в `usmap/` и переименуй, например в `0.4.5.usmap`.

Документация: [DumpUSMAP (UE4SS)](https://docs.ue4ss.com/dev/lua-api/global-functions/dumpusmap.html) · [Modding.wiki — FModel mappings](https://modding.wiki/en/UnrealEngineModdingGuides/InstallingFModel).

### Другие дамперы

Список от автора FModel: [Discussion #418](https://github.com/4sval/FModel/discussions/418) — **Dumper-7**, **jmap**, **UnrealMappingsDumper** и др. Читай README выбранного инструмента; на выходе нужен **`.usmap`**.

---

## Проверка

В FModel открой любой `.uasset` из игры — экспорт в JSON должен содержать нормальные свойства, а не массовые ошибки сериализации.
