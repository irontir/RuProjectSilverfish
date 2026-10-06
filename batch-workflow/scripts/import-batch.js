const fs = require('node:fs')
const path = require('node:path')
const paths = require('../lib/paths')

function parseArgs () {
  const argv = process.argv.slice(2).filter(a => !a.startsWith('--'))
  if (!argv[0]) {
    console.error('Usage: node scripts/import-batch.js batches/done/TextFiles_DT.json')
    process.exit(1)
  }
  const rel = argv[0].replace(/^batch-workflow[/\\]/, '')
  return paths.resolveFromRoot(path.join('batch-workflow', rel))
}

async function main () {
  const batchPath = parseArgs()
  if (!fs.existsSync(batchPath)) {
    console.error(`Нет файла: ${batchPath}`)
    process.exit(1)
  }

  const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'))
  const entries = batch.entries || batch
  if (!Array.isArray(entries)) {
    console.error('Ожидается { entries: [{ source, target }] }')
    process.exit(1)
  }

  const map = JSON.parse(fs.readFileSync(paths.defaultTranslationMap, 'utf8'))
  let applied = 0
  let skipped = 0

  for (const { source, target } of entries) {
    if (!source || target === undefined || target === '') {
      skipped++
      continue
    }
    if (!Object.prototype.hasOwnProperty.call(map, source)) {
      console.warn('Ключ не в map (сначала npm run scan в корне):', source.slice(0, 60) + '…')
      map[source] = target
      applied++
      continue
    }
    map[source] = target
    applied++
  }

  await fs.promises.writeFile(paths.defaultTranslationMap, JSON.stringify(map, null, 2), 'utf8')
  console.log(`В translation_map записано: ${applied}, пропуск (пустой target): ${skipped}`)
  console.log('Дальше в корне: npm run build')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
