const fs = require('node:fs')
const path = require('node:path')
const paths = require('../lib/paths')

const map = JSON.parse(fs.readFileSync(paths.defaultTranslationMap, 'utf8'))
const keys = Object.keys(map)
const empty = keys.filter(k => map[k] === '')
const filled = keys.length - empty.length

console.log(`translation_map: ${keys.length} ключей, переведено ${filled}, пусто ${empty.length}`)

const dir = paths.locresWork
if (!fs.existsSync(dir)) {
  console.error(`Нет ${paths.REL.entries}/ — в корне: npm run scan`)
  process.exit(1)
}
const stats = []
for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) {
  const rows = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
  let e = 0
  let t = 0
  for (const r of rows) {
    if (typeof r.SourceString !== 'string') continue
    t++
    if (map[r.SourceString] === '') e++
  }
  if (e > 0) stats.push({ f, e, t })
}
stats.sort((a, b) => b.e - a.e)
console.log('\nТоп файлов с непереведённым текстом:')
stats.slice(0, 15).forEach(s => console.log(`  ${s.e}/${s.t}  ${s.f}`))
