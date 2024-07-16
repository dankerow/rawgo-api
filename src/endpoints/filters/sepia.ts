import { Endpoint } from '@/structures'
import { Canvas } from '@/utils'
import { createCanvas, loadImage } from 'canvas'

export default class Sepia extends Endpoint {
  constructor() {
    super({
      name: 'sepia',
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
    const data = await loadImage(query.image)
    const canvas = createCanvas(data.width, data.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(data, 0, 0)
    Canvas.sepia(ctx, 0, 0, data.width, data.height)

    return canvas.toBuffer()
  }
}
