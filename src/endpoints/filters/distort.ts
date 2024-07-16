import type { FastifyReply } from 'fastify'

import { Endpoint } from '@/structures'
import { Canvas } from '@/utils'
import { createCanvas, loadImage } from 'canvas'

export default class Distort extends Endpoint {
  constructor() {
    super({
      name: 'distort',
      parameters: [
        {
          name: 'image',
          type: 'url',
          required: true
        },
        {
          name: 'amplitude',
          type: 'number'
        }
      ]
    })
  }

  async make(query: { image: string; amplitude: number }, reply: FastifyReply) {
    if (query.amplitude) {
      if (!isNaN(query.amplitude) && query.amplitude < 1) {
        return reply.code(400).send({
          success: false,
          status: 400,
          message: 'You can\'t set the effect amplitude to 0 or below.'
        })
      } else if (!isNaN(query.amplitude) && query.amplitude > 100) {
        return reply.code(400).send({
          success: false,
          status: 400,
          message: 'You can\'t set the effect amplitude higher than 100.'
        })
      }
    }

    const amplitude = (query.amplitude && !isNaN(query.amplitude)) ? query.amplitude : 10

    const data = await loadImage(query.image)
    const canvas = createCanvas(data.width, data.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(data, 0, 0)
    Canvas.distort(ctx, 0, 0, data.width, data.height, amplitude)

    return canvas.toBuffer()
  }
}
