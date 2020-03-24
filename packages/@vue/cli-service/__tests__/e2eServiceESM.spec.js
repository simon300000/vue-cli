// Native support for ES Modules is not complete with jest
// https://github.com/facebook/jest/issues/9430

const { writeFile, unlink } = require('fs').promises
const { join } = require('path')
const { fork } = require('child_process')

const mockDir = join(__dirname, 'mockESM')
const configPath = join(mockDir, 'vue.config.js')
const e2ePath = join(mockDir, 'readConfig.cjs')

const configData = 'export default { lintOnSave: true }'
const functionConfigData = 'export default () => ({ lintOnSave: true })'

const e2e = () => new Promise(resolve => {
  const subprocess = fork(e2ePath, { stdio: 'pipe' })
  let output = ''
  subprocess.stdout.on('data', data => {
    output += data
  })
  subprocess.stdout.on('end', () => resolve(JSON.parse(output)))
})

// vue.config.cjs has higher priority

test('load project options from package.json', async () => {
  const output = await e2e()
  expect(output).toBe('default')
})

test('load project options with import(vue.config.js)', async () => {
  await writeFile(configPath, configData)
  const output = await e2e()
  await unlink(configPath)
  expect(output).toBe(true)
})

test('load project options with import(vue.config.js) as a function', async () => {
  await writeFile(configPath, functionConfigData)
  const output = await e2e()
  await unlink(configPath)
  expect(output).toBe(true)
})
