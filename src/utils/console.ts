import { consola } from 'consola'

export function setupGlobalConsole(opts: { dev?: boolean } = {}) {
  if (opts.dev) {
    consola.wrapAll()
  } else {
    consola.wrapConsole()
  }
}
