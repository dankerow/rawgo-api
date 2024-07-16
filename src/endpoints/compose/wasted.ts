import { Endpoint } from '@/structures'
import { Canvas } from '@/utils'
import { createCanvas, loadImage } from 'canvas'

export default class Wasted extends Endpoint {
  constructor() {
    super({
      name: 'wasted',
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
    const base = await loadImage('./src/assets/images/wasted.png')
    const data = await loadImage(query.image)
    const canvas = createCanvas(data.width, data.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(data, 0, 0, data.width, data.width)
    Canvas.grayscale(ctx, 0, 0, data.width, data.width)
    ctx.drawImage(base, 0, 0, data.width, data.height)

    return canvas.toBuffer()
  }
}
