const test = require('ava')

const confugu = require('../index')

test.before('Set environment variables', (t) => {
  process.env = {
    NUM_VAR: 123456,
    STRING_VAR: 'some environment variable',
  }
})

test('should be able to load a simple config synchronously', (t) => {
  const configPath = require.resolve('./fixtures/simple-config.yml')
  const config = confugu.loadSync(configPath)

  t.deepEqual(config, {
    test: 'test value',
    testNum: 123456
  })
})

test('should throw an error if invalid path is given', (t) => {
  const configPath = 'some invalid path'

  try {
    confugu.loadSync(configPath)
    t.fail()
  } catch (err) {
    t.true(err.message.includes('ENOENT'))
    t.pass()
  }
})

test('should throw an error if an invalid config is given', (t) => {
  const configPath = require.resolve('./fixtures/invalid-config.yml')

  try {
    confugu.loadSync(configPath)
    t.fail()
  } catch (err) {
    t.true(err.message.includes('YAMLException'))
    t.pass()
  }
})

test('should be able to parse environment variables', (t) => {
  const configPath = require.resolve('./fixtures/environment-variables-config.yml')
  const config = confugu.loadSync(configPath)

  t.deepEqual(config, {
    numVar: process.env.NUM_VAR,
    stringVar: process.env.STRING_VAR,
    test: 'test'
  })
})
