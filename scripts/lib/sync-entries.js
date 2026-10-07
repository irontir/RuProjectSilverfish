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

  const files = await getJsonFiles(extractedDir)
  const localizedById = new Map()
  let removed = 0

  if (fs.existsSync(entriesDir)) {
    const existingFiles = await getJsonFiles(entriesDir)
    removed = existingFiles.length
    for (const file of existingFiles) {
      const existing = JSON.parse(await fs.promises.readFile(file, 'utf8'))
      if (!Array.isArray(existing)) continue
      for (const row of existing) {
        if (row.LocalizedString) localizedById.set(entryId(row), row.LocalizedString)
      }
    }
    await fs.promises.rm(entriesDir, { recursive: true, force: true })
  }

  await fs.promises.mkdir(entriesDir, { recursive: true })
  let written = 0

  for (const file of files) {
    const relativePath = path.relative(extractedDir, file)
    const outPath = path.join(entriesDir, relativePath)
    const extractedRows = JSON.parse(await fs.promises.readFile(file, 'utf8'))
    if (!Array.isArray(extractedRows)) continue

    for (const row of extractedRows) {
      const saved = localizedById.get(entryId(row))
      row.LocalizedString = saved ?? row.LocalizedString ?? ''
    }

    await fs.promises.mkdir(path.dirname(outPath), { recursive: true })
    await fs.promises.writeFile(outPath, JSON.stringify(extractedRows, null, 2), 'utf8')
    written++
  }

  return { files: written, removed }
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
