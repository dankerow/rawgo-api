import { Endpoint } from '@/structures'
import { Canvas } from '@/utils'
import { createCanvas, loadImage } from 'canvas'

export default class Prison extends Endpoint {
  constructor() {
    super({
      name: 'prison',
      parameters: [
        {
          name: 'image',
          type: 'url',
          required: true
        }
      ]
    })
  }

  async make(query: { image: string }) {
    const base = await loadImage('./src/assets/images/jail-bars.png')
    const data = await loadImage(query.image)
    const canvas = createCanvas(data.width, data.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(data, 0, 0, data.width, data.height)
    ctx.drawImage(base, 0, 0, data.width + 6, data.height + 6)
    Canvas.grayscale(ctx, 0, 0, data.width, data.height)

    return canvas.toBuffer()
  }
}
