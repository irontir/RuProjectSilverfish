# Сборка locres

| Файл | Как получить |
|------|----------------|
| `Game.locres.txt` | `npm run build` (из корня репо) |
| `Game.locres` | [UE4TextExtractor](https://github.com/VD42/UE4TextExtractor/releases) |

```powershell
UE4TextExtractor.exe build/Game.locres.txt build/Game.locres
```

Установка: `SilverFish/Content/Localization/Game/en/Game.locres` + **`SilverFishRU_FONTS_P.pak`** ([ProjectSilverfishRus](https://github.com/costilman/ProjectSilverfishRus)). Язык в игре: **English**.

### Zip для игры

```powershell
npm run pack
```

→ **`build/ProjectSilverfish-loc.zip`** — внутри папка `SilverFish/` (как в ProjectSilverfishRus).  
Распаковать в корень установки игры.  
Font-pak: **`fonts/SilverFishRU_FONTS_P.pak`** (см. `fonts/README.md`).
