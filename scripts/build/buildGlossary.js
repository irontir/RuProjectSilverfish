const fs = require('node:fs')
const paths = require('../lib/paths')

function buildMarkdown (glossary) {
  const lines = []
  lines.push('# Project Silverfish — промпт для перевода (RU)')
  lines.push('')
  lines.push('> Автогенерация: `npm run glossary`. Редактируй `translation/glossary.json`.')
  lines.push('')

  if (glossary.tone?.length) {
    lines.push('## Тон и сеттинг')
    for (const t of glossary.tone) lines.push(`- ${t}`)
    lines.push('')
  }

  if (glossary.rules?.length) {
    lines.push('## Правила')
    for (const r of glossary.rules) lines.push(`- ${r}`)
    lines.push('')
  }

  if (glossary.do_not_translate?.length) {
    lines.push('## Не переводить (как в оригинале)')
    lines.push(glossary.do_not_translate.map(x => `\`${x}\``).join(', '))
    lines.push('')
  }

  if (glossary.terms?.length) {
    lines.push('## Глоссарий EN → RU')
    lines.push('')
    lines.push('| EN | RU | Примечание |')
    lines.push('|----|-----|------------|')
    for (const term of glossary.terms) {
      const note = [term.long, term.note, term.aliases?.length ? `варианты: ${term.aliases.join(', ')}` : '']
        .filter(Boolean)
        .join('; ')
      lines.push(`| ${term.en} | ${term.ru} | ${note.replace(/\|/g, '\\|')} |`)
    }
    lines.push('')
  }

  lines.push('## Формат ответа для батча')
  lines.push('- JSON: `{ "entries": [ { "source": "<англ. ключ без изменений>", "target": "<русский перевод>" } ] }`')
  lines.push('- Пустой `target` — пропуск.')
  lines.push('')

  return lines.join('\n')
}

async function main () {
  if (!fs.existsSync(paths.glossaryJson)) {
    console.error(`Нет ${paths.REL.glossaryJson}`)
    process.exit(1)
  }
  const glossary = JSON.parse(await fs.promises.readFile(paths.glossaryJson, 'utf8'))
  const md = buildMarkdown(glossary)
  await fs.promises.writeFile(paths.glossaryLlm, md, 'utf8')
  console.log(`Записано: ${paths.REL.glossaryLlm}`)
  console.log(`Терминов: ${glossary.terms?.length ?? 0}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
