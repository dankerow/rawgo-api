import type { FastifyRequest, FastifyReply } from 'fastify'

interface EndpointOptions {
  name: string
  parameters: EndpointParameter[]
  icons?: object
}

interface EndpointParameter {
  name: string
  type: 'string' | 'number' | 'url' | 'boolean'
  required?: boolean
}

/**
 * @class Endpoint
 */
export class Endpoint {
  public name: string
  public parameters: EndpointParameter[]
  public icons?: object

  constructor(options: EndpointOptions) {
    this.name = options.name
    this.parameters = options.parameters
    if (options.icons) this.icons = options.icons
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  make(_query: FastifyRequest['query'], _reply: FastifyReply): Buffer | Promise<Buffer | ArrayBuffer> {
    throw new Error('Not implemented')
  }

  async toBuffer(image: string): Promise<ArrayBuffer | Buffer> {
    if (typeof image === 'string') {
      const response = await fetch(image)
      return await response.arrayBuffer()
    } else {
      throw new Error('Unsupported class')
    }
  }
}
