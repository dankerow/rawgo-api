import type { FastifyReply } from 'fastify'

import { Endpoint } from '@/structures'
import { createCanvas, loadImage } from 'canvas'

export default class Fade extends Endpoint {
  constructor() {
    super({
      name: 'fade',
      parameters: [
        {
          name: 'image',
          type: 'url',
          required: true
        },
        {
          name: 'intensity',
          type: 'number'
        }
      ]
    })
  }

  async make(query: { image: string; intensity: number }, reply: FastifyReply) {
    if (query.intensity) {
      if (!isNaN(query.intensity) && query.intensity < 1) {
        return reply.code(400).send({
          success: false,
          status: 400,
          message: 'You can\'t set the effect intensity to 0 or below.'
        })
      } else if (!isNaN(query.intensity) && query.intensity > 100) {
        return reply.code(400).send({
          success: false,
          status: 400,
          message: 'You can\'t set the effect intensity higher than 100.'
        })
      }
    }

    const intensity = (query && query.intensity && !isNaN(query.intensity)) ? query.intensity : 50

    const data = await loadImage(query.image)
    const canvas = createCanvas(data.width, data.height)
    const ctx = canvas.getContext('2d')

    ctx.globalAlpha = (100 - intensity) / 100
    ctx.drawImage(data, 0, 0)

    return canvas.toBuffer('image/png')
  }
}
