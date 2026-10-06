const fs = require('node:fs')
const paths = require('../lib/paths')

const map = JSON.parse(fs.readFileSync(paths.defaultTranslationMap, 'utf8'))
const empty = Object.keys(map).filter(k => map[k] === '')
if (empty.length !== 1) {
  console.log('empty count', empty.length)
  process.exit(empty.length === 0 ? 0 : 1)
}
const key = empty[0]
map[key] =
  'Этот сукин сын Ленни на время примкнул к Восстанию — только чтобы стащить их ручной пулемёт и тяжёлый комплект брони. Теперь он сидит в какой-то разбомблённой дыре, вооружён до зубов. \r\n\r\nНалети на его логово и забери добро, пока его «старые друзья» не нашли его. Заодно прикончи ублюдка. \r\n\r\nСкорее всего он в своём убежище — в одном из старых рабочих общежитий на западной оконечности Депо...\r\n\r\nПоверь, Ленни — хладнокровный убийца, которому удалось нажить ОЧЕНЬ много врагов по ОЧЕНЬ разным причинам. Всем нам будет лучше без него.'
fs.writeFileSync(paths.defaultTranslationMap, JSON.stringify(map, null, 2), 'utf8')
console.log('OK: последняя строка (Lenny) переведена')
