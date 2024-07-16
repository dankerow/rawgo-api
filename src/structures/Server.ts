import type { Route, Endpoint } from './'
import type { ResolvedConfig } from '@/utils/configLoader'
import type { FastifyInstance, preHandlerHookHandler } from 'fastify'

import _config from '@/config'
import { loadConfig } from '@/utils/configLoader'
import { readdir, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'
import Fastify from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import compress from '@fastify/compress'
import rateLimit from '@fastify/rate-limit'

const config = await loadConfig('.', _config)

/**
 * Represents a http server instance
 * @class Server
 */
export class Server {
  public app: FastifyInstance
  public port: number
  public config: ResolvedConfig
  public readonly versions: string[]
  private readonly routers: Array<Route>
  private readonly endpoints: { [key: string]: Endpoint[] }

  constructor() {
    this.app = Fastify({
      ignoreTrailingSlash: true,
      trustProxy: true,
      logger: true
    })

    this.port =  process.env.PORT ? parseInt(process.env.PORT) : 3000

    this.config = config

    this.versions = ['v1']
    this.endpoints = {}
    this.routers = []
  }

  /**
	 * @description
	 */
  public async setup(): Promise<void> {
    await this.app.register(helmet, {
      crossOriginResourcePolicy: false
    })

    await this.app.register(cors, { origin: true })

    await this.app.register(compress)

    await this.app.register(rateLimit,
      {
        global : true,
        ban: 2,
        max: 1000,
        keyGenerator: (req) => req.headers.authorization || req.ip,
        errorResponseBuilder: (req, context) => ({
          status: 429,
          message: 'Too many requests, please slow down and try again later.',
          expiresIn: context.ttl
        })
      })

    this.app.decorate('versions', this.versions)

    this.app.setErrorHandler((error, req, reply) => {
      process.send({
        type: 'error',
        content: `Something went wrong.\nError: ${error instanceof Error ? error.stack : error}`
      })

      const statusCode = error.statusCode || 500

      return reply.code(statusCode).send({
        error: {
          status: statusCode,
          message: error.message ?? 'Oops! Something went wrong. Try again later.'
        }
      })
    })

    await this.loadEndpoints()
    this.app.decorate('endpoints', this.endpoints)

    await this.loadRoutes(this.config.dirs.routes)
    await this.registerRoutes()
    this.listen()
  }

  /**
   * @description Loads the endpoints on the HTTP Server instance
   * @private
   * @returns Promise<void>
   */
  private async loadEndpoints() {
    const endpoints = await readdir(this.config.dirs.endpoints)

    for (const category of endpoints) {
      const galleryPath = join(this.config.dirs.endpoints, category)
      const stats = await stat(galleryPath)

      if (stats.isDirectory()) {
        this.endpoints[category] = []
        const files = await readdir(galleryPath)

        for (const file of files) {
          const endpointFile = relative(import.meta.dirname, join(galleryPath, file)).replaceAll('\\', '/')
          const endpointImport = await import(endpointFile) as { default: new () => Endpoint }
          const EndpointClass = endpointImport.default
          const endpoint = new EndpointClass()

          this.endpoints[category].push(endpoint)
        }
      }
    }
  }

  /**
	 * @description Loads the routes on the HTTP Server instance
   * @private
	 * @param directory The path to the routes directory
	 * @param prefix Prefix used load the routes following the file structure
	 * @returns Promise<void>
	 */
  private async loadRoutes(directory: string, prefix: string | boolean = false): Promise<void> {
    const routes = await readdir(directory)

    for (const route of routes) {
      const stats = await stat(join(directory, route))

      if (stats.isDirectory()) {
        await this.loadRoutes(join(directory, route), route.replace('/', ''))
      } else {
        const routeFile = relative(import.meta.dirname, join(directory, route)).replaceAll('\\', '/')
        const routeImport = await import(routeFile) as { default: new () => Route }
        const RouteClass = routeImport.default
        const routeInstance = new RouteClass()

        if (prefix) {
          routeInstance.path = `/${prefix}${routeInstance.path}`
        }

        this.routers.push(routeInstance)
      }
    }
  }

  /**
   * @description Registers the routes on the Fastify instance
   * @private
   * @returns Promise<void>
   */
  private async registerRoutes(): Promise<void> {
    const start = process.hrtime()

    this.routers.sort((a, b) => a.position - b.position)

    for (const router of this.routers) {
      const middlewares = router.middlewares?.length ? await this.loadMiddlewares(router.middlewares) : []

      await this.app.register((app, options, done) => {
        app.addHook('onRoute', (routeOptions) => {
          if (middlewares.length > 0) {
            routeOptions.preHandler = Array.isArray(routeOptions.preHandler) ? [...routeOptions.preHandler, ...middlewares] : [...middlewares]
          }

          return
        })

        router.routes(app, options, done)
      }, { prefix: router.path })
    }

    const end = process.hrtime(start)
    process.send({ type: 'log', content: `Loaded ${this.routers.length} routes (took ${end[1] / 1000000}ms)` })
  }

  /**
   * @description Loads the specified middlewares dynamically.
   * @param {string[]} middlewares - The names of the middlewares to load.
   * @return {Promise<preHandlerHookHandler[]>} - A promise that resolves with an array of imported middlewares.
   */
  private async loadMiddlewares(middlewares: string[]): Promise<preHandlerHookHandler[]> {
    const importedMiddlewares: preHandlerHookHandler[] = []

    for (const middleware of middlewares) {
      const importedMiddlewarePath = relative(import.meta.dirname, join(this.config.dirs.middlewares, middleware)).replaceAll('\\', '/')
      const importedMiddleware = await import(importedMiddlewarePath) as { default: preHandlerHookHandler }
      importedMiddlewares.push(importedMiddleware.default)
    }

    return importedMiddlewares
  }

  /**
   * @description A method to listen the app on a port
   * @private
	 * @returns {void}
	 */
  private listen(): void {
    this.app.listen({ port: this.port }, (error, address) => {
      if (error) return process.send({ type: 'error', content: error.stack || error })
      process.send({ type: 'ready', content: `Running on ${address}` })
    })
  }
}
