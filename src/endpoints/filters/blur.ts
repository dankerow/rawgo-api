import type { FastifyReply } from 'fastify'

import { Endpoint } from '@/structures'
import { Canvas } from '@/utils'
import { createCanvas, loadImage } from 'canvas'

export default class Blur extends Endpoint {
  constructor() {
    super({
      name: 'blur',
      parameters: [
        {
          name: 'image',
          type: 'url',
          required: true
        },
        {
          name: 'radius',
          type: 'number'
        }
      ]
    })
  }

  async make(query: { image: string; radius: number }, reply: FastifyReply) {
    if (query.radius) {
      if (!isNaN(query.radius) && query.radius < 1) {
        return reply.code(400).send({
          success: false,
          status: 400,
          message: 'You can\'t set the blur radius to 0 or below.'
        })
      } else if (!isNaN(query.radius) && query.radius > 100) {
        return reply.code(400).send({
          success: false,
          status: 400,
          message: 'You can\'t set the blur radius higher than 100.'
        })
      }
    }

    const radius = (query && query.radius && !isNaN(query.radius)) ? query.radius : 5

    const data = await loadImage(query.image)
    const canvas = createCanvas(data.width, data.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(data, 0, 0)
    Canvas.blur(ctx, 0, 0, data.width, data.height, radius)

    return canvas.toBuffer()
  }
}
