import { getConfig, ONRMRC, RegistryConfig, saveConfig } from './config'
import inquirer from 'inquirer'
import { npm, RegistryManager, yarn } from './registryManager'
import chalk from 'chalk'
import { printTable } from './print'
import highlight from 'cli-highlight'

export const actions = {
  add,
  use,
  del,
  ls,
  config
}

const managers: Record<string, RegistryManager> = {
  npm,
  yarn
}

async function add(name: string, registry: string, homeUrl: string = '') {
  const currentConf: RegistryConfig = {
    registry,
    home: homeUrl
  }

  const conf = getConfig()
  const existConf = conf.registries[name]

  if (existConf) {
    const answer = await inquirer.prompt({
      message: `Found exist registry [${name}], override it ?`,
      name: 'isOverride',
      type: 'confirm',
      default: true
    })

    if (answer.isOverride) {
      Object.assign(existConf, currentConf)
    }
  } else {
    conf.registries[name] = currentConf
  }

  saveConfig(conf)
}

function del(name: string) {
  const conf = getConfig()

  const exist = conf.registries[name]
  if (!exist) {
    console.log(`Not found registry for [${name}].`)
    return
  }

  delete conf.registries[name]
  saveConfig(conf)
  console.log(`Delete registry [${name}] successful.`)
}

function use(name: string, type?: 'npm' | 'yarn') {
  const conf = getConfig()
  const registryConf = conf.registries[name]

  if (!registryConf) {
    console.log(`Not found registry named ${name}`)
    ls()
    return
  }

  if (type) {
    managers[type].setConfig('registry', registryConf.registry)
    console.log(`Set registry(${name}) for [${type}] successful!`)
    return
  }

  for (const key in managers) {
    const manager = managers[key]
    manager.setConfig('registry', registryConf.registry)
  }

  console.log(`Set registry(${name}) for [${Object.keys(managers).join(',')}] successful!`)
}

function ls() {
  const conf = getConfig()

  const table: string[][] = []

  table.push(['Name', 'Registry', 'Home url'])

  for (const key in conf.registries) {
    const registry = conf.registries[key]
    table.push([key, registry.registry, registry.home || ''])
  }

  printTable(table)
}

function config() {
  const conf = getConfig()

  console.log('Config path:', chalk.green(ONRMRC), '\n')

  console.log(highlight(JSON.stringify(conf, null, 2), { language: 'json', ignoreIllegals: true }))
}
