const fs = require('node:fs')
const { createReadStream } = require('node:fs')
const path = require('path')
const cliProgress = require('cli-progress')
const paths = require('../lib/paths')

function to_uint32(n){
    return n >>> 0;
}

var CRCTablesSB8 = [
    0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f, 0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91,
    0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7, 0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9, 0xfa0f3d63, 0x8d080df5,
    0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b, 0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
    0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599, 0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924, 0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d,
    0x76dc4190, 0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433, 0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
    0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950, 0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
    0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9,
    0x5005713c, 0x270241aa, 0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f, 0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad,
    0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683, 0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
    0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb, 0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
    0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b, 0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef, 0x4669be79,
    0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236, 0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe, 0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
    0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713, 0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21,
    0x86d3d2d4, 0xf1d4e242, 0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777, 0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45,
    0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc, 0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
    0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693, 0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d
];

function StrCrc32(string, newline)
{
    var bNeedUnicode = false;
    for (var i = 0; i < string.length; i++)
    {
        if (!(0x0000 <= string.charCodeAt(i) && string.charCodeAt(i) <= 0x00FF))
        {
            bNeedUnicode = true;
            break;
        }
    }
    if (bNeedUnicode)
        return StrCrc32_Unicode(string, newline);
    else
        return StrCrc32_ASCII(string, newline);
}

function StrCrc32_Unicode(string, newline)
{
    var buf = [];
    for (var i = 0; i < string.length; i++)
    {
        if (newline == 'crlf' && string.charCodeAt(i) == 10)
        {
            buf.push(to_uint32(13));
            buf.push(to_uint32(0));
        }
        buf.push(to_uint32(string.charCodeAt(i) & to_uint32(0xFF)));
        buf.push(to_uint32((string.charCodeAt(i) & to_uint32(0xFF00)) >>> 8));
    }
    var CRC = to_uint32(0xFFFFFFFF);
    for (var i = 0; i < buf.length / 2; i++)
    {
        CRC = to_uint32((CRC >>> 8) ^ to_uint32(CRCTablesSB8[(CRC ^ buf[i * 2 + 0]) & to_uint32(0xFF)]));
        CRC = to_uint32((CRC >>> 8) ^ to_uint32(CRCTablesSB8[(CRC ^ buf[i * 2 + 1]) & to_uint32(0xFF)]));
        CRC = to_uint32((CRC >>> 8) ^ to_uint32(CRCTablesSB8[(CRC                 ) & to_uint32(0xFF)]));
        CRC = to_uint32((CRC >>> 8) ^ to_uint32(CRCTablesSB8[(CRC                 ) & to_uint32(0xFF)]));
    }
    return to_uint32(CRC ^ to_uint32(0xFFFFFFFF));
}

function StrCrc32_ASCII(string, newline)
{
    var buf = [];
    for (var i = 0; i < string.length; i++)
    {
        if (newline == 'crlf' && string.charCodeAt(i) == 10)
            buf.push(to_uint32(13));
        buf.push(to_uint32(string.charCodeAt(i)));
    }
    var CRC = to_uint32(0xFFFFFFFF);
    for (var i = 0; i < buf.length; i++)
    {
        CRC = to_uint32((CRC >>> 8) ^ to_uint32(CRCTablesSB8[(CRC ^ buf[i]) & to_uint32(0xFF)]));
        CRC = to_uint32((CRC >>> 8) ^ to_uint32(CRCTablesSB8[(CRC         ) & to_uint32(0xFF)]));
        CRC = to_uint32((CRC >>> 8) ^ to_uint32(CRCTablesSB8[(CRC         ) & to_uint32(0xFF)]));
        CRC = to_uint32((CRC >>> 8) ^ to_uint32(CRCTablesSB8[(CRC         ) & to_uint32(0xFF)]));
    }
    return to_uint32(CRC ^ to_uint32(0xFFFFFFFF));
}

const INPUT_ROOT = path.join(paths.exportRoot, 'SilverFish/Content/Classes')
const { syncEntriesFromExtracted } = require('../lib/sync-entries')
const CACHE_VERSION = 1

/** В экспорте FModel FText всегда содержит SourceString — сначала ищем это в тексте, без JSON.parse */
const FTEXT_TEXT_MARKER = '"SourceString"'
const STREAM_SCAN_CHUNK = 256 * 1024
const FTEXT_PAIR_RE = /"Key"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"SourceString"\s*:\s*"((?:[^"\\]|\\.)*)"/g

async function textFileContainsMarker (filePath, needle = FTEXT_TEXT_MARKER) {
  const { size } = await fs.promises.stat(filePath)
  if (size === 0) return false
  if (size <= STREAM_SCAN_CHUNK) {
    const text = await fs.promises.readFile(filePath, 'utf8')
    return text.includes(needle)
  }
  return new Promise((resolve, reject) => {
    let found = false
    let tail = ''
    const overlap = Math.max(needle.length - 1, 0)
    const stream = createReadStream(filePath, { encoding: 'utf8', highWaterMark: STREAM_SCAN_CHUNK })
    stream.on('data', (chunk) => {
      if (found) return
      const haystack = tail + chunk
      if (haystack.includes(needle)) {
        found = true
        stream.destroy()
        resolve(true)
        return
      }
      tail = overlap ? haystack.slice(-overlap) : ''
    })
    stream.on('close', () => {
      if (!found) resolve(false)
    })
    stream.on('error', reject)
  })
}

function jsonUnquote (s) {
  return JSON.parse(`"${s}"`)
}

/** Без JSON.parse — для огромных карт (сотни МБ акторов) */
function extractFTextFromExportText (text) {
  const results = []
  FTEXT_PAIR_RE.lastIndex = 0
  let match
  while ((match = FTEXT_PAIR_RE.exec(text)) !== null) {
    let key
    let sourceString
    try {
      key = jsonUnquote(match[1])
      sourceString = jsonUnquote(match[2])
    } catch {
      continue
    }
    const before = text.slice(Math.max(0, match.index - 500), match.index)
    let namespace = ''
    const nsRe = /"Namespace"\s*:\s*"((?:[^"\\]|\\.)*)"/g
    let nsm
    while ((nsm = nsRe.exec(before)) !== null) {
      try {
        namespace = jsonUnquote(nsm[1])
      } catch {
        namespace = nsm[1]
      }
    }
    results.push({ Namespace: namespace, Key: key, SourceString: sourceString })
  }
  return results
}

function isTranslatableSource (sourceString) {
  if (typeof sourceString !== 'string' || !sourceString.trim()) return false
  // Числа, пунктуация и одни плейсхолдеры перевода не требуют.
  if (!/\p{L}/u.test(sourceString)) return false
  // Ссылки Unreal и абсолютные пути не являются пользовательским текстом.
  if (/^(?:[A-Za-z]+')?\/(?:Game|Script|Engine)\//i.test(sourceString)) return false
  if (/^[A-Za-z]:[\\/]/.test(sourceString)) return false
  return true
}

function toLocEntries (fTexts, endOfLine, sourceFile) {
  return fTexts.filter(obj => isTranslatableSource(obj.SourceString)).map(obj => ({
    Namespace: obj.Namespace ?? '',
    Key: obj.Key,
    Hash: StrCrc32(obj.SourceString, endOfLine),
    SourceString: obj.SourceString,
    LocalizedString: '',
    SourceFiles: [sourceFile],
  }))
}

async function getJsonFiles (dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getJsonFiles(res) : res
  }));
  return files.flat().filter(file => file.toLowerCase().endsWith('.json'))
}

const formatCurrentFile = (filePath, rootDir) => {
  const rel = path.relative(rootDir, filePath).replace(/\\/g, '/')
  const max = 72
  return rel.length > max ? '…' + rel.slice(-(max - 1)) : rel
}

async function readJsonIfExists (filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback
  try {
    return JSON.parse(await fs.promises.readFile(filePath, 'utf8'))
  } catch (err) {
    console.warn(`Не удалось прочитать кэш ${paths.relFromRoot(filePath)}: ${err.message}. Пересканируем всё.`)
    return fallback
  }
}

function entryId (row) {
  return JSON.stringify([row.Namespace ?? '', row.Key, row.Hash])
}

function stableEntryId (row) {
  return JSON.stringify([row.Namespace ?? '', row.Key])
}

function mergeEntries (fileEntries) {
  const unique = new Map()
  for (const rows of fileEntries) {
    for (const row of rows) {
      const id = entryId(row)
      const existing = unique.get(id)
      if (existing) {
        for (const sourceFile of row.SourceFiles || []) {
          if (!existing.SourceFiles.includes(sourceFile)) existing.SourceFiles.push(sourceFile)
        }
      } else {
        unique.set(id, { ...row, SourceFiles: [...(row.SourceFiles || [])] })
      }
    }
  }
  return [...unique.values()].sort((a, b) =>
    a.SourceString.localeCompare(b.SourceString, 'en') || a.Key.localeCompare(b.Key, 'en')
  )
}

function buildSnapshot (entries) {
  const byStableId = {}
  for (const row of entries) {
    const id = stableEntryId(row)
    if (!byStableId[id]) byStableId[id] = []
    if (!byStableId[id].includes(row.SourceString)) byStableId[id].push(row.SourceString)
  }
  for (const values of Object.values(byStableId)) values.sort((a, b) => a.localeCompare(b, 'en'))
  return { version: 1, entries: byStableId }
}

function compareSnapshots (previous, current) {
  const oldEntries = previous?.entries || {}
  const newEntries = current.entries
  let added = 0
  let changed = 0
  let unchanged = 0
  let removed = 0

  for (const [id, sources] of Object.entries(newEntries)) {
    if (!Object.prototype.hasOwnProperty.call(oldEntries, id)) added++
    else if (JSON.stringify(oldEntries[id]) === JSON.stringify(sources)) unchanged++
    else changed++
  }
  for (const id of Object.keys(oldEntries)) {
    if (!Object.prototype.hasOwnProperty.call(newEntries, id)) removed++
  }
  return { added, changed, unchanged, removed }
}

async function replaceExtractedSnapshot (entries) {
  const outputFile = path.join(paths.extracted, 'entries.json')
  await fs.promises.rm(paths.extracted, { recursive: true, force: true })
  await fs.promises.mkdir(paths.extracted, { recursive: true })
  await fs.promises.writeFile(outputFile, JSON.stringify(entries, null, 2), 'utf8')
}

const processJsonFiles = async function (files, { rescan = false } = {}) {
  const oldCache = rescan
    ? { version: CACHE_VERSION, files: {} }
    : await readJsonIfExists(paths.scanCache, { version: CACHE_VERSION, files: {} })
  const cacheFiles = oldCache.version === CACHE_VERSION && oldCache.files ? oldCache.files : {}
  const newCache = { version: CACHE_VERSION, root: paths.relFromRoot(INPUT_ROOT), files: {} }
  const stats = { cached: 0, scanned: 0, withoutFText: 0, withFText: 0, filtered: 0 }

  const progressBar = new cliProgress.SingleBar({
    format: ' [{bar}] {percentage}% | {value}/{total} | {file}',
    hideCursor: true,
    clearOnComplete: true,
  }, cliProgress.Presets.shades_classic);

  console.log(`Найдено JSON: ${files.length}. Рекурсивный обход всего Classes, включая Maps.`)
  console.log(rescan ? 'Принудительное полное сканирование…' : 'Сканирование новых и изменённых файлов…')
  progressBar.start(files.length, 0, { file: '—' });

  const fileEntries = []
  for (let idx = 0; idx < files.length; idx++) {
    const file = files[idx]
    const fileLabel = formatCurrentFile(file, INPUT_ROOT)
    progressBar.update(idx, { file: fileLabel })
    try {
      const stat = await fs.promises.stat(file)
      const relativePath = path.relative(INPUT_ROOT, file).replace(/\\/g, '/')
      const cached = cacheFiles[relativePath]
      let rows
      let filtered = 0

      if (!rescan && cached && cached.size === stat.size && cached.mtimeMs === stat.mtimeMs && Array.isArray(cached.rows)) {
        rows = cached.rows
        filtered = cached.filtered || 0
        stats.cached++
      } else {
        stats.scanned++
        if (!(await textFileContainsMarker(file))) {
          rows = []
        } else {
          const fileData = await fs.promises.readFile(file, 'utf8')
          const found = extractFTextFromExportText(fileData)
          rows = toLocEntries(found, 'lf', relativePath)
          filtered = found.length - rows.length
        }
      }

      stats.filtered += filtered
      if (rows.length) stats.withFText++
      else stats.withoutFText++
      newCache.files[relativePath] = {
        size: stat.size,
        mtimeMs: stat.mtimeMs,
        rows,
        filtered,
      }
      fileEntries.push(rows)
    } catch (err) {
      progressBar.stop()
      console.error(`Ошибка в файле: ${fileLabel}`)
      throw err
    }
    progressBar.update(idx + 1, { file: fileLabel });
  }

  progressBar.stop();
  const entries = mergeEntries(fileEntries)
  const previousSnapshot = await readJsonIfExists(paths.scanSnapshot, { version: 1, entries: {} })
  const snapshot = buildSnapshot(entries)
  const changes = compareSnapshots(previousSnapshot, snapshot)

  await replaceExtractedSnapshot(entries)
  await fs.promises.mkdir(path.dirname(paths.scanCache), { recursive: true })
  await fs.promises.writeFile(paths.scanCache, JSON.stringify(newCache), 'utf8')
  await fs.promises.writeFile(paths.scanSnapshot, JSON.stringify(snapshot, null, 2), 'utf8')

  console.log(`Файлов: ${files.length} | из кэша: ${stats.cached} | прочитано: ${stats.scanned}`)
  console.log(`С FText: ${stats.withFText} | без переводимого текста: ${stats.withoutFText} | отфильтровано: ${stats.filtered}`)
  console.log(`Записей: ${entries.length} | новые: ${changes.added} | изменённые: ${changes.changed} | без изменений: ${changes.unchanged} | удалённые: ${changes.removed}`)
  return { entries: entries.length, changes }
}

const main = async function () {
  const rescan = process.argv.slice(2).includes('--rescan')
  if (!fs.existsSync(INPUT_ROOT)) {
    throw new Error(`Нет папки экспорта: ${paths.relFromRoot(INPUT_ROOT)}`)
  }

  const files = await getJsonFiles(INPUT_ROOT)
  await processJsonFiles(files, { rescan })
  const { files: synced, removed } = await syncEntriesFromExtracted()
  console.log(`Extract: ./${paths.REL.extracted}/ | entries: ./${paths.REL.entries}/ (${synced} файлов, удалено старых: ${removed})`)
  console.log(`Mod: ${paths.REL.modLocres}`)
}

if (require.main === module) {
  main().catch(err => {
    console.error(err.message || err)
    process.exit(1)
  })
}
