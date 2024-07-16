import type { FastifyReply } from 'fastify'

import { Endpoint } from '@/structures'
import { Canvas } from '@/utils'
import { createCanvas, loadImage } from 'canvas'

export default class Brighten extends Endpoint {
  constructor() {
    super({
      name: 'brighten',
      parameters: [
        {
          name: 'image',
          type: 'url',
          required: true
        },
        {
          name: 'level',
          type: 'number'
        }
      ]
    })
  }

  async make(query: { image: string; level: number }, reply: FastifyReply) {
    if (query.level) {
      if (!isNaN(query.level) && query.level < 0) {
        return reply.code(400).send({
          success: false,
          status: 400,
          message: 'You can\'t set the blur level below 0.'
        })
      } else if (!isNaN(query.level) && query.level > 255) {
        return reply.code(400).send({
          success: false,
          status: 400,
          message: 'You can\'t set the blur level higher than 255.'
        })
      }
    }

    const level = (query && query.level && !isNaN(query.level)) ? query.level : 50

    const data = await loadImage(query.image)
    const canvas = createCanvas(data.width, data.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(data, 0, 0, data.width, data.height)
    Canvas.brightness(ctx, 0, 0, data.width, data.height, level)

    return canvas.toBuffer()
  }
}
