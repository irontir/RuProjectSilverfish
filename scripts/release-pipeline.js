/** Полная сборка: translation_map.json → Game.locres.txt → Game.locres → zip. */
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const root = path.join(__dirname, '..')
const node = process.execPath
const extractor = path.join(root, 'UE4TextExtractor.exe')
const locresText = path.join(root, 'build', 'Game.locres.txt')
const locresBinary = path.join(root, 'build', 'Game.locres')

function run (command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

if (!fs.existsSync(extractor)) {
  console.error(`Не найден ${path.basename(extractor)} в корне проекта.`)
  process.exit(1)
}

run(node, [path.join('scripts', 'build-pipeline.js')])
run(extractor, [locresText, locresBinary])

if (!fs.existsSync(locresBinary)) {
  console.error('UE4TextExtractor завершился без создания build/Game.locres.')
  process.exit(1)
}

run(node, [path.join('scripts', 'build', 'pack.js')])
console.log('\nПолная сборка завершена: build/ProjectSilverfish-loc.zip')
