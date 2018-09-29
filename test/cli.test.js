const {
  getCurrentRegistry,
  setCurrentRegistry,
  addRegistry,
  delRegistry,
  getRegistries,
  clearLocalConfig
} = require('../bin/onrm');

const {
  expect
} = require('chai');

const config = require('../bin/config');

const newReg = {
  name: 'test',
  registry: 'https://test.org'
}

beforeEach(() => {
  clearLocalConfig();
})

describe('test ls command', () => {
  it('check default config registry', () => {
    expect(getRegistries().default).to.deep.eq(config.registries)
  })
})

describe('test add command', () => {
  it('should save the registry', () => {
    addRegistry(newReg);
    expect(getRegistries().local).to.deep.eq([newReg])
  })
})

describe('test delete command', () => {
  it('should delete the registry', () => {
    addRegistry(newReg);
    delRegistry(newReg.name);
    expect(getRegistries().local).to.deep.eq([])
  })
})

describe('test use, current command', function () {
  const regName = 'taobao';

  this.timeout('4s');

  beforeEach(async () => {
    await setCurrentRegistry('npm');
  })

  it('should return taobao registry', async () => {
    await setCurrentRegistry(regName);
    const info = await getCurrentRegistry();

    const reg = config.registries.find(r => r.name === regName);
    const expectReg = {
      npm: reg.registry,
      yarn: reg.registry
    }

    expect(info).to.be.deep.eq(expectReg);
  })
})
