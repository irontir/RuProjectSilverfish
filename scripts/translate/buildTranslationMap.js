const fs = require('node:fs')
const path = require('node:path')
const paths = require('../lib/paths')
const { getJsonFiles } = require('../lib/json-files')

const DEFAULT_OUT = paths.REL.translationMap

function parseArgs () {
  const argv = process.argv.slice(2)
  let out = DEFAULT_OUT
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out' && argv[i + 1]) {
      out = argv[i + 1]
      i++
    }
  }
  return { outPath: paths.resolveFromRoot(out) }
}

const main = async function () {
  const { outPath } = parseArgs()

  if (!fs.existsSync(paths.extracted)) {
    console.error(`Нет ${paths.REL.extracted}/ — сначала npm run extract`)
    process.exit(1)
  }

  await fs.promises.mkdir(path.dirname(outPath), { recursive: true })

  let existing = {}
  if (fs.existsSync(outPath)) {
    existing = JSON.parse(fs.readFileSync(outPath, 'utf8'))
  }

  const sourceStrings = new Set()
  const files = await getJsonFiles(paths.extracted)
  for (const file of files) {
    const rows = JSON.parse(await fs.promises.readFile(file, 'utf8'))
    if (!Array.isArray(rows)) continue
    for (const obj of rows) {
      if (obj && typeof obj.SourceString === 'string') {
        sourceStrings.add(obj.SourceString)
      }
    }
  }

  const map = {}
  let kept = 0
  let added = 0
  const sorted = [...sourceStrings].sort((a, b) => a.localeCompare(b, 'en'))

  for (const src of sorted) {
    if (Object.prototype.hasOwnProperty.call(existing, src)) {
      map[src] = existing[src]
      kept++
    } else {
      map[src] = ''
      added++
    }
  }

  await fs.promises.writeFile(outPath, JSON.stringify(map, null, 2), 'utf8')
  const removed = Object.keys(existing).filter(src => !sourceStrings.has(src)).length

  console.log(`Уникальных SourceString: ${sorted.length}`)
  console.log(`Сохранено существующих ключей: ${kept}`)
  console.log(`Новых ключей (пустой перевод ""): ${added}`)
  console.log(`Удалено устаревших ключей: ${removed}`)
  console.log(`Записано: ${path.relative(paths.PROJECT_ROOT, outPath)}`)
  console.log('Дальше: переведи map → npm run build')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
