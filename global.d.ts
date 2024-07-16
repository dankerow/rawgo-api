import type { Endpoint } from '@/structures'
import type { Logger } from '@/utils'

declare namespace NodeJS {
  interface Process {
    send: (message: any) => void
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    logger: Logger
    versions: string[]
    endpoints: { [key: string]: Endpoint[] }
  }

  interface FastifyRequest {
    endpoint?: Endpoint
  }
}
