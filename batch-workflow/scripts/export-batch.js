const fs = require('node:fs')
const path = require('node:path')
const paths = require('../lib/paths')

function parseArgs () {
  const argv = process.argv.slice(2)
  const fileArg = argv.find(a => !a.startsWith('--'))
  if (!fileArg) {
    console.error('Usage: node scripts/export-batch.js Quests_DT.json')
    process.exit(1)
  }
  const base = fileArg.replace(/^.*[\\/]/, '').replace(/\.json$/i, '')
  const locresPath = path.join(paths.locresWork, `${base}.json`)
  return { base, locresPath }
}

async function main () {
  const map = JSON.parse(fs.readFileSync(paths.defaultTranslationMap, 'utf8'))
  const { base, locresPath } = parseArgs()

  if (!fs.existsSync(locresPath)) {
    console.error(`Нет файла: ${locresPath}`)
    process.exit(1)
  }

  const rows = JSON.parse(fs.readFileSync(locresPath, 'utf8'))
  const seen = new Set()
  const entries = []

  for (const row of rows) {
    const src = row.SourceString
    if (typeof src !== 'string' || seen.has(src)) continue
    seen.add(src)
    if (map[src] !== '') continue
    entries.push({ source: src, target: '' })
  }

  await fs.promises.mkdir(paths.batchesPending, { recursive: true })
  const outPath = path.join(paths.batchesPending, `${base}.json`)
  const payload = {
    meta: {
      locresFile: `${paths.REL.entries}/${base}.json`,
      created: new Date().toISOString(),
      count: entries.length,
    },
    entries,
  }
  await fs.promises.writeFile(outPath, JSON.stringify(payload, null, 2), 'utf8')

  console.log(`Батч: ${paths.REL.batchesPending}/${base}.json`)
  console.log(`Строк к переводу: ${entries.length}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
