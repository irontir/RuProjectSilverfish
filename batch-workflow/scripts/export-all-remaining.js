const fs = require('node:fs')
const path = require('path')
const paths = require('../lib/paths')

const CHUNK_SIZE = 40

async function main () {
  const map = JSON.parse(fs.readFileSync(paths.defaultTranslationMap, 'utf8'))
  const empty = Object.keys(map).filter(k => map[k] === '')
  empty.sort((a, b) => a.length - b.length)

  await fs.promises.mkdir(paths.batchesPending, { recursive: true })
  await fs.promises.mkdir(paths.batchesDone, { recursive: true })

  for (const f of fs.readdirSync(paths.batchesPending)) {
    if (f.endsWith('.json')) await fs.promises.unlink(path.join(paths.batchesPending, f))
  }

  const manifest = []
  let batchIndex = 0
  for (let i = 0; i < empty.length; i += CHUNK_SIZE) {
    batchIndex++
    const chunk = empty.slice(i, i + CHUNK_SIZE)
    const name = `all-${String(batchIndex).padStart(3, '0')}`
    const entries = chunk.map(source => ({ source, target: '' }))
    const outPath = path.join(paths.batchesPending, `${name}.json`)
    fs.writeFileSync(outPath, JSON.stringify({
      meta: { batch: name, index: batchIndex, count: entries.length, totalEmpty: empty.length },
      entries,
    }, null, 2), 'utf8')
    manifest.push({ name, count: entries.length })
  }

  const doneNames = new Set(
    fs.readdirSync(paths.batchesDone).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''))
  )
  const pending = manifest.filter(m => !doneNames.has(m.name))

  fs.writeFileSync(path.join(paths.batchesPending, '_manifest.json'), JSON.stringify({
    chunkSize: CHUNK_SIZE,
    totalEmpty: empty.length,
    totalBatches: manifest.length,
    pendingBatches: pending.length,
    batches: manifest,
  }, null, 2))

  console.log(`Пустых ключей: ${empty.length}`)
  console.log(`Батчей по ${CHUNK_SIZE}: ${manifest.length}`)
  console.log(`Уже в done/: ${doneNames.size}, осталось перевести: ${pending.length}`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
