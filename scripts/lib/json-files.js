const fs = require('node:fs')
const path = require('node:path')

async function getJsonFiles (dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.join(dir, dirent.name)
    return dirent.isDirectory() ? getJsonFiles(res) : res
  }))
  return files.flat().filter(f => f.endsWith('.json'))
}

function readConfigLines (configPath) {
  return fs.readFileSync(configPath, 'utf8')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'))
}

module.exports = { getJsonFiles, readConfigLines }
