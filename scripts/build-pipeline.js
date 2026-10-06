/** Пайплайн 1 — сборка: map → entries → Game.locres.txt */
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const node = process.execPath
const root = path.join(__dirname, '..')

function run (script) {
  const r = spawnSync(node, [script], { cwd: root, stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

run(path.join('scripts', 'translate', 'translateFromMap.js'))
run(path.join('scripts', 'build', 'createLocresTxt.js'))
console.log('\nГотово: build/Game.locres.txt → UE4TextExtractor → Game.locres')
