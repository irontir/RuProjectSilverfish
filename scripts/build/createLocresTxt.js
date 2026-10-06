const fs = require('node:fs')
const paths = require('../lib/paths')
const { getJsonFiles } = require('../lib/json-files')

const createLocresTxt = async function () {
  const files = await getJsonFiles(paths.locresWork)
  const chunks = ['=>{}\r\n\r\n']
  let entryCount = 0

  for (const file of files) {
    try {
      const json = JSON.parse(await fs.promises.readFile(file, 'utf8'))
      if (!Array.isArray(json)) continue
      for (const obj of json) {
        if (obj.LocalizedString !== '') {
          chunks.push(`=>[${obj.Key}][${obj.Hash}]\r\n`)
          chunks.push(`${obj.LocalizedString}\r\n\r\n`)
          entryCount++
        }
      }
    } catch (err) {
      console.error(file, err.message)
    }
  }

  chunks.push('=>{[END]}\r\n')
  await fs.promises.mkdir(paths.buildDir, { recursive: true })
  await fs.promises.writeFile(paths.gameLocresTxt, chunks.join(''), 'utf8')
  console.log(`Записано строк: ${entryCount}`)
  console.log(`Файл: ${paths.gameLocresTxt}`)
}

createLocresTxt().catch(err => {
  console.error(err)
  process.exit(1)
})
