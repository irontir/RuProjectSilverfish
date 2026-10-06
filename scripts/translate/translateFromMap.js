const fs = require('node:fs')
const path = require('node:path')
const paths = require('../lib/paths')
const { getJsonFiles } = require('../lib/json-files')

function parseArgs () {
  const argv = process.argv.slice(2)
  let mapPath = paths.defaultTranslationMap
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--map' && argv[i + 1]) {
      mapPath = paths.resolveFromRoot(argv[i + 1].replace(/\.json$/i, '') + '.json')
      i++
    }
  }
  return { mapPath }
}

const translateFromMap = async function (mapPath) {
  if (!fs.existsSync(mapPath)) {
    console.error(`Нет ${path.relative(paths.PROJECT_ROOT, mapPath)} — сначала npm run scan`)
    process.exit(1)
  }
  if (!fs.existsSync(paths.locresWork)) {
    console.error(`Нет ${paths.REL.entries}/ — сначала npm run extract`)
    process.exit(1)
  }

  const translationMap = JSON.parse(await fs.promises.readFile(mapPath, 'utf8'))
  const files = await getJsonFiles(paths.locresWork)

  let filesTouched = 0
  let stringsApplied = 0
  let stringsSkippedEmpty = 0
  let stringsMissingInMap = 0

  for (const file of files) {
    const json = JSON.parse(await fs.promises.readFile(file, 'utf8'))
    if (!Array.isArray(json)) continue

    let changed = false
    for (const obj of json) {
      if (!obj || typeof obj.SourceString !== 'string') continue
      const translated = translationMap[obj.SourceString]
      if (translated === undefined) {
        stringsMissingInMap++
        continue
      }
      if (translated === '') {
        stringsSkippedEmpty++
        continue
      }
      if (obj.LocalizedString !== translated) {
        obj.LocalizedString = translated
        changed = true
        stringsApplied++
      }
    }

    if (changed) {
      await fs.promises.writeFile(file, JSON.stringify(json, null, 2), 'utf8')
      filesTouched++
    }
  }

  console.log(`Файлов обновлено: ${filesTouched}`)
  console.log(`LocalizedString проставлено: ${stringsApplied}`)
  console.log(`Пропуск (в map пусто ""): ${stringsSkippedEmpty}`)
  console.log(`Нет в map (обнови build-map): ${stringsMissingInMap}`)
}

const main = async function () {
  const { mapPath } = parseArgs()
  console.log(`Карта: ${path.relative(paths.PROJECT_ROOT, mapPath)} → ${paths.REL.entries}/`)
  await translateFromMap(mapPath)
  console.log(`Обновлено: ${paths.REL.entries}/`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
