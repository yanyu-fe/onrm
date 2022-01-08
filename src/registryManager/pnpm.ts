import { RegistryManager } from './base'
import shelljs from 'shelljs'

class Pnpm extends RegistryManager {
  protected checkIsExist(): boolean {
    return !!shelljs.which('pnpm')
  }

  getConfig(key: string): string {
    if (!this.isExist()) {
      return ''
    }

    return this.exec(`pnpm config get ${key}`)
  }

  getVersion(): string {
    return this.isExist() ? this.exec('pnpm -v') : ''
  }

  setConfig(key: string, value: string): boolean {
    if (!this.isExist()) {
      return false
    } else {
      this.exec(`pnpm config set ${key} ${value}`)
      return true
    }
  }
}
export const pnpm = new Pnpm()
