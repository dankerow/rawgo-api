import type { FastifyReply } from 'fastify'

import { Endpoint } from '@/structures'
import { Canvas } from '@/utils'
import { createCanvas, loadImage } from 'canvas'

export default class Offset extends Endpoint {
  constructor() {
    super({
      name: '3d',
      parameters: [
        {
          name: 'image',
          type: 'url',
          required: true
        },
        {
          name: 'offset',
          type: 'number'
        }
      ]
    })
  }

  async make(query: { image: string; offset: number }, reply: FastifyReply) {
    if (query.offset) {
      if (!isNaN(query.offset) && query.offset < 0) {
        return reply.code(400).send({
          success: false,
          status: 400,
          message: 'You can\'t set the blur offset below 0.'
        })
      } else if (!isNaN(query.offset) && query.offset > 255) {
        return reply.code(400).send({
          success: false,
          status: 400,
          message: 'You can\'t set the blur offset higher than 255.'
        })
      }
    }

    const offset = (query && query.offset && !isNaN(query.offset)) ? query.offset : 50

    const data = await loadImage(query.image)
    const canvas = createCanvas(data.width, data.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(data, 0, 0, data.width, data.height)
    Canvas.offsetRed(ctx, 0, 0, data.width, data.height, offset)

    return canvas.toBuffer()
  }
}
