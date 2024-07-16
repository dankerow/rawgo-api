import type { FastifyRequest, FastifyReply } from 'fastify'

import Jimp from 'jimp'
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

  jimpBuffer(image: Jimp, mime = Jimp.MIME_PNG): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      image.getBuffer(mime, (error, buffer) => {
        if (error) return reject(error)
        resolve(buffer)
      })
    })
  }

  async toBuffer(image: Jimp | string): Promise<ArrayBuffer | Buffer> {
    if (image instanceof Jimp) {
      return await this.jimpBuffer(image)
    } else if (typeof image === 'string') {
      return await fetch(image).then((response) => response.arrayBuffer())
    } else {
      throw new Error('Unsupported class')
    }
  }
}
