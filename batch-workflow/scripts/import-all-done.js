const fs = require('node:fs')
const path = require('node:path')
const paths = require('../lib/paths')

async function main () {
  if (!fs.existsSync(paths.batchesDone)) {
    console.log('Нет папки batches/done/')
    return
  }
  const files = fs.readdirSync(paths.batchesDone).filter(f => f.endsWith('.json'))
  const map = JSON.parse(fs.readFileSync(paths.defaultTranslationMap, 'utf8'))
  let applied = 0
  let skipped = 0
  let filesOk = 0

  for (const f of files.sort()) {
    const batch = JSON.parse(fs.readFileSync(path.join(paths.batchesDone, f), 'utf8'))
    const entries = batch.entries || []
    let local = 0
    for (const { source, target } of entries) {
      if (!source || !target) {
        skipped++
        continue
      }
      map[source] = target
      applied++
      local++
    }
    if (local) filesOk++
  }

  await fs.promises.writeFile(paths.defaultTranslationMap, JSON.stringify(map, null, 2), 'utf8')
  console.log(`Файлов батчей: ${filesOk}/${files.length}, записей в map: ${applied}, пропуск: ${skipped}`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
