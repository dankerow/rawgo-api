import type { FastifyRequest, FastifyReply } from 'fastify'

import type { JimpInstance } from 'jimp'
import { Jimp } from 'jimp'
import fetch from 'node-fetch'

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
  make(query: FastifyRequest['query'], reply: FastifyReply): Buffer | Promise<Buffer | ArrayBuffer> {
    throw new Error('Not implemented')
  }

  jimpBuffer(image: JimpInstance, mime: 'image/png' | 'image/jpeg' | 'image/bmp' | 'image/tiff' | 'image/gif' = 'image/png'): Promise<Buffer> {
    return image.getBuffer(mime)
  }

  async toBuffer(image: JimpInstance | string): Promise<ArrayBuffer | Buffer> {
    if (image instanceof Jimp) {
      return await this.jimpBuffer(image)
    } else if (typeof image === 'string') {
      const response = await fetch(image)
      return await response.arrayBuffer()
    } else {
      throw new Error('Unsupported class')
    }
  }
}
