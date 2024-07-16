import type { FastifyInstance, RegisterOptions, DoneFuncWithErrOrRes } from 'fastify'

export interface RouteOptions {
  position: number
  path: string
  middlewares?: string[]
}

/**
 * @class Route
 */
export class Route {
  position: number
  path: string
  middlewares: string[]

  constructor(options: RouteOptions) {
    this.position = options.position
    this.path = options.path
    this.middlewares = options.middlewares || []
  }

  routes(app: FastifyInstance, options: RegisterOptions, done: DoneFuncWithErrOrRes): void {
    done()
  }
}
