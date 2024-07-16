import { Endpoint } from '@/structures'
import { Canvas } from '@/utils'
import { createCanvas, loadImage } from 'canvas'

export default class Rip extends Endpoint {
  constructor() {
    super({
      name: 'rip',
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
    const base = await loadImage('./src/assets/images/rip.png')
    const avatar = await loadImage(query.image)
    const canvas = createCanvas(base.width, base.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(base, 0, 0)
    ctx.drawImage(avatar, 59, 68, 200, 200)
    Canvas.grayscale(ctx, 59, 68, 200, 200)

    return canvas.toBuffer()
  }
}
