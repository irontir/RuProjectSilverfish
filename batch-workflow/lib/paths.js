const path = require('node:path')
const core = require('../../scripts/lib/paths')

const BATCH_ROOT = path.join(core.PROJECT_ROOT, 'batch-workflow')

const REL = {
  ...core.REL,
  batchesPending: 'batch-workflow/batches/pending',
  batchesDone: 'batch-workflow/batches/done',
}

module.exports = {
  ...core,
  REL,
  batchRoot: BATCH_ROOT,
  batchesPending: path.join(BATCH_ROOT, 'batches/pending'),
  batchesDone: path.join(BATCH_ROOT, 'batches/done'),
}
