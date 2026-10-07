const path = require('node:path')

/** Корень репозитория (не папка scripts/) */
const PROJECT_ROOT = path.resolve(__dirname, '../..')

/** Относительные пути от корня — для meta и документации */
const REL = {
  usmap: 'usmap',
  fmodelExport: 'fmodel_export',
  fmodelExports: 'fmodel_export/Exports',
  extracted: 'work/extracted',
  localization: 'work/localization',
  entries: 'work/localization/entries',
  scanCache: 'work/scan-cache.json',
  scanSnapshot: 'work/scan-snapshot.json',
  translationDir: 'translation',
  translationMap: 'translation/translation_map.json',
  ignoredKeys: 'translation/ignored_keys.json',
  build: 'build',
  gameLocresTxt: 'build/Game.locres.txt',
  gameLocresBin: 'build/Game.locres',
  glossaryJson: 'translation/glossary.json',
  glossaryLlm: 'translation/glossary_for_llm.md',
  modLocres: 'SilverFish/Content/Localization/Game/en/Game.locres',
  modPackZip: 'build/ProjectSilverfish-loc.zip',
  modPaksDir: 'SilverFish/Content/Paks',
  fontsDir: 'fonts',
  batchWorkflow: 'batch-workflow',
}

function fromRoot (...segments) {
  return path.join(PROJECT_ROOT, ...segments)
}

function resolveFromRoot (filePath) {
  return path.isAbsolute(filePath) ? filePath : fromRoot(filePath)
}

function relFromRoot (absPath) {
  return path.relative(PROJECT_ROOT, absPath).replace(/\\/g, '/')
}

module.exports = {
  PROJECT_ROOT,
  REL,
  fromRoot,
  resolveFromRoot,
  relFromRoot,
  usmapDir: fromRoot(REL.usmap),
  fmodelExportRoot: fromRoot(REL.fmodelExport),
  exportRoot: fromRoot(REL.fmodelExports),
  extracted: fromRoot(REL.extracted),
  localizationRoot: fromRoot(REL.localization),
  translationDir: fromRoot(REL.translationDir),
  locresWork: fromRoot(REL.entries),
  scanCache: fromRoot(REL.scanCache),
  scanSnapshot: fromRoot(REL.scanSnapshot),
  EXTRACT_DIR: REL.extracted,
  buildDir: fromRoot(REL.build),
  defaultTranslationMap: fromRoot(REL.translationMap),
  ignoredKeys: fromRoot(REL.ignoredKeys),
  gameLocresTxt: fromRoot(REL.gameLocresTxt),
  gameLocresBin: fromRoot(REL.gameLocresBin),
  glossaryJson: fromRoot(REL.glossaryJson),
  glossaryLlm: fromRoot(REL.glossaryLlm),
  modLocres: fromRoot(REL.modLocres),
  modPackZip: fromRoot(REL.modPackZip),
  modPaksDir: fromRoot(REL.modPaksDir),
  fontsDir: fromRoot(REL.fontsDir),
}
