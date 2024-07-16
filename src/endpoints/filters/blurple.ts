import type { FastifyReply } from 'fastify'

import { Endpoint } from '@/structures'
import { Canvas } from '@/utils'
import { createCanvas, loadImage } from 'canvas'

export default class Blurple extends Endpoint {
  constructor() {
    super({
      name: 'blurple',
      parameters: [
        {
          name: 'image',
          type: 'url',
          required: true
        },
        {
          name: 'type',
          type: 'string'
        }
      ]
    })
  }

  async make(query: { image: string; type: string }, reply: FastifyReply) {
    let omega: { '85': number[]; '170': number[]; '255': number[] }

    if (query.type) {
      if (query.type === 'light') {
        omega = { '85': [78, 93, 148], '170': [114, 137, 218], '255': [255, 255, 255] }
      } else if (query.type === 'dark') {
        omega = { '85': [35, 39, 42], '170': [78, 93, 148], '255': [114, 137, 218] }
      } else if (query.type === 'orange') {
        omega = { '85': [182, 82, 45], '170': [255, 69, 0], '255': [255, 255, 255] }
      } else {
        return reply.code(400).send({ message: 'An invalid type was provided.' })
      }
    } else if (!query.type) {
      omega = { '85': [78, 93, 148], '170': [114, 137, 218], '255': [255, 255, 255] }
    }

    const data = await loadImage(query.image)
    const canvas = createCanvas(data.width, data.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(data, 0, 0)
    Canvas.grayscale(ctx, 0, 0, data.width, data.height)
    Canvas.blurple(ctx, 0, 0, data.width, data.height, omega)

    return canvas.toBuffer()
  }
}
