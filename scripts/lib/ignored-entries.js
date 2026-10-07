const fs = require('node:fs')
const paths = require('./paths')

function loadIgnoredEntries () {
  if (!fs.existsSync(paths.ignoredKeys)) return []

  const entries = JSON.parse(fs.readFileSync(paths.ignoredKeys, 'utf8'))
  if (!Array.isArray(entries)) {
    throw new Error(`${paths.REL.ignoredKeys} должен содержать JSON-массив`)
  }

  return entries.map((entry, index) => {
    if (!entry || typeof entry.Key !== 'string' || !entry.Key) {
      throw new Error(`${paths.REL.ignoredKeys}: у записи ${index + 1} отсутствует Key`)
    }
    return {
      Namespace: entry.Namespace ?? '',
      Key: entry.Key,
      Reason: entry.Reason ?? '',
    }
  })
}

function createIgnoredEntryMatcher () {
  const ignored = loadIgnoredEntries()
  const ids = new Set(ignored.map(entry => JSON.stringify([entry.Namespace, entry.Key])))

  return {
    ignored,
    isIgnored: row => ids.has(JSON.stringify([row.Namespace ?? '', row.Key])),
  }
}

module.exports = { createIgnoredEntryMatcher, loadIgnoredEntries }
