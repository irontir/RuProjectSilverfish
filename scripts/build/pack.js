const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const paths = require('../lib/paths')

const STAGING_ROOT = path.join(paths.buildDir, 'pack-staging')
const MOD_ROOT_NAME = 'SilverFish'
const DEFAULT_ZIP = path.join(paths.buildDir, 'ProjectSilverfish-loc.zip')
const FONT_PAK = 'SilverFishRU_FONTS_P.pak'

function parseArgs () {
  const argv = process.argv.slice(2)
  let outZip = DEFAULT_ZIP
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out' && argv[i + 1]) {
      outZip = paths.resolveFromRoot(argv[i + 1])
      i++
    }
  }
  return { outZip }
}

function rmDir (dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true })
}

function copyFile (src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
}

/** Копирует файлы из dir в Content/Paks; не перезаписывает уже скопированные имена */
function copyIntoPaks (srcDir, destPaks, copiedSet) {
  if (!fs.existsSync(srcDir)) return
  for (const name of fs.readdirSync(srcDir)) {
    if (name.startsWith('.') || name === 'README.md') continue
    const src = path.join(srcDir, name)
    if (!fs.statSync(src).isFile()) continue
    if (copiedSet.has(name)) continue
    copyFile(src, path.join(destPaks, name))
    copiedSet.add(name)
  }
}

function collectPaks (stagingModRoot) {
  const destPaks = path.join(stagingModRoot, 'Content', 'Paks')
  const copied = new Set()
  copyIntoPaks(paths.fontsDir, destPaks, copied)
  copyIntoPaks(paths.modPaksDir, destPaks, copied)
  return [...copied]
}

function createZip (sourceDir, outZip) {
  fs.mkdirSync(path.dirname(outZip), { recursive: true })
  if (fs.existsSync(outZip)) fs.unlinkSync(outZip)

  if (process.platform === 'win32') {
    const src = sourceDir.replace(/'/g, "''")
    const dest = outZip.replace(/'/g, "''")
    const ps = `Compress-Archive -LiteralPath '${src}' -DestinationPath '${dest}' -Force`
    const r = spawnSync('powershell', ['-NoProfile', '-Command', ps], { stdio: 'inherit' })
    if (r.status !== 0) process.exit(r.status ?? 1)
    return
  }

  const parent = path.dirname(sourceDir)
  const base = path.basename(sourceDir)
  const r = spawnSync('zip', ['-r', outZip, base], { cwd: parent, stdio: 'inherit' })
  if (r.status !== 0) {
    console.error('Нужен zip в PATH или запуск на Windows (Compress-Archive).')
    process.exit(r.status ?? 1)
  }
}

function main () {
  const { outZip } = parseArgs()

  if (!fs.existsSync(paths.gameLocresBin)) {
    console.error(`Нет ${paths.REL.gameLocresBin}`)
    console.error('Сначала: npm run build → UE4TextExtractor build/Game.locres.txt build/Game.locres')
    process.exit(1)
  }

  const stagingMod = path.join(STAGING_ROOT, MOD_ROOT_NAME)
  rmDir(STAGING_ROOT)
  fs.mkdirSync(stagingMod, { recursive: true })

  const locresDest = path.join(stagingMod, ...paths.REL.modLocres.split('/').slice(1))
  copyFile(paths.gameLocresBin, locresDest)

  const paks = collectPaks(stagingMod)

  createZip(stagingMod, outZip)
  rmDir(STAGING_ROOT)

  console.log(`Архив: ${paths.relFromRoot(outZip)}`)
  console.log('Установка: распаковать в корень игры (рядом с SilverFish.exe), в архиве папка SilverFish/')
  if (!paks.includes(FONT_PAK)) {
    console.warn(`\nВ архиве нет ${FONT_PAK} — кириллица в UI может не отображаться.`)
    console.warn(`Скачай из ProjectSilverfishRus → положи в ${paths.REL.fontsDir}/ → npm run pack`)
  } else {
    console.log(`Paks: ${paks.join(', ')}`)
  }
}

main()
