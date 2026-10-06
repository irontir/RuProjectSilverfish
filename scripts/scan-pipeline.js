/** Пайплайн 1 — подготовка: FModel JSON → translation_map.json */
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const node = process.execPath
const root = path.join(__dirname, '..')
const extractArgs = process.argv.slice(2)

function run (script, args = []) {
  const r = spawnSync(node, [script, ...args], { cwd: root, stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

run(path.join('scripts', 'extract', 'deepSearch.js'), extractArgs)
run(path.join('scripts', 'translate', 'buildTranslationMap.js'))
console.log('\nДальше: переведи translation/translation_map.json → npm run build')
