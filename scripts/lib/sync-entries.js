const fs = require('node:fs')
const path = require('node:path')
const paths = require('./paths')
const { getJsonFiles } = require('./json-files')

function entryId (row) {
  return `${row.Namespace ?? ''}|${row.Key}|${row.Hash}`
}

/**
 * Копирует work/extracted → work/localization/entries, сохраняя LocalizedString где совпали Key/Hash.
 */
async function syncEntriesFromExtracted () {
  const extractedDir = paths.extracted
  const entriesDir = paths.locresWork

  if (!fs.existsSync(extractedDir)) {
    throw new Error(`Нет ${paths.REL.extracted}/ — сначала npm run extract`)
  }

  await fs.promises.mkdir(entriesDir, { recursive: true })
  const files = await getJsonFiles(extractedDir)
  let written = 0

  for (const file of files) {
    const base = path.basename(file)
    const outPath = path.join(entriesDir, base)
    const extractedRows = JSON.parse(await fs.promises.readFile(file, 'utf8'))
    if (!Array.isArray(extractedRows)) continue

    const localizedById = new Map()
    if (fs.existsSync(outPath)) {
      const existing = JSON.parse(await fs.promises.readFile(outPath, 'utf8'))
      if (Array.isArray(existing)) {
        for (const row of existing) {
          if (row.LocalizedString) localizedById.set(entryId(row), row.LocalizedString)
        }
      }
    }

    for (const row of extractedRows) {
      const saved = localizedById.get(entryId(row))
      row.LocalizedString = saved ?? row.LocalizedString ?? ''
    }

    await fs.promises.writeFile(outPath, JSON.stringify(extractedRows, null, 2), 'utf8')
    written++
  }

  return { files: written }
}

module.exports = { syncEntriesFromExtracted }

if (require.main === module) {
  syncEntriesFromExtracted()
    .then(({ files }) => {
      console.log(`Синхронизировано файлов entries: ${files}`)
      console.log(`Папка: ${paths.REL.entries}/`)
    })
    .catch(err => {
      console.error(err.message || err)
      process.exit(1)
    })
}
