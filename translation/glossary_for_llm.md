# Project Silverfish — промпт для перевода (RU)

> Автогенерация: `npm run glossary`. Редактируй `translation/glossary.json`.

## Тон и сеттинг
- Северная зона исключения: наёмники, аномалии, эфир, фракции, чёрный рынок.
- UI — коротко, как в шутере/RPG; терминалы — сухой или пугающий тон.
- Диалоги разговорные; не смягчать мат и жёсткость без нужды.
- Согласованность с ProjectSilverfishRus (costilman): эфир, ССТА, Брокер.

## Правила
- Ключ translation_map — английский SourceString; не менять.
- Сохранять \r\n как в оригинале.
- Не переводить плейсхолдеры :WepToggle:, :HelmLight:, :Reload: и аналоги.
- Коды KR-332, 8344, метки LT-06, MC0078, имена культа Mak'iale — латиница как в оригинале где уместно.
- Чистые цифры и короткие номера (784, 101) — обычно без перевода.
- [DATA ERASED] → [ДАННЫЕ УДАЛЕНЫ]; [REDACTED FOR YOUR SAFETY] → [ЗАКРЫТО В ВАШИХ ИНТЕРЕСАХ].

## Не переводить (как в оригинале)
`:WepToggle:`, `:HelmLight:`, `:Reload:`, `Standard Eather Co.`, `Savlo Industries`, `LT-06`, `MC0078`, `Mak'iale`

## Глоссарий EN → RU

| EN | RU | Примечание |
|----|-----|------------|
| NFTA | ССТА | Northern Free Trade Alliance → Северный свободный торговый альянс |
| Northern Free Trade Alliance | ССТА |  |
| EDP | ВОП | Eastern Defence Pact |
| Eather | эфир | не «эфирная сеть» |
| Eatherite | эфирит |  |
| Broker | Брокер |  |
| Black Lake | Чёрное озеро |  |
| Port Rale | Порт Рейл |  |
| West Carcosa | Западная Каркоса |  |
| Exclusion Zone | зона исключения |  |
| Northern Exclusion Zone | Северная зона исключения |  |
| Insurrectionist | мятежник |  |
| Insurrectionists | мятежники |  |
| merc | наёмник |  |
| mercs | наёмники |  |
| Gear | снаряжение |  |
| Craft | СОЗДАТЬ | кнопка UI |
| Data tape | картридж данных | варианты: data tape |
| Artifact | артефакт |  |
| Freelancer | вольный сталкер | варианты: Freelancers |
| Yellow Stag | Жёлтый олень | нашивка |
| cultist | культист |  |
| anomaly | аномалия | варианты: anomalies |
| squad | отряд | варианты: Squads |
| quest | задание | варианты: Quest |

## Формат ответа для батча
- JSON: `{ "entries": [ { "source": "<англ. ключ без изменений>", "target": "<русский перевод>" } ] }`
- Пустой `target` — пропуск.
