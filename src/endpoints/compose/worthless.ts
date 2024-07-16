import { Endpoint } from '@/structures'
import { createCanvas, loadImage } from 'canvas'

export default class Worthless extends Endpoint {
  constructor() {
    super({
      name: 'worthless',
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
    const base = await loadImage('./src/assets/images/worthless.png')
    const avatar = await loadImage(query.image)
    const canvas = createCanvas(base.width, base.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(base, 0, 0)
    ctx.rotate(6 * (Math.PI / 180))
    ctx.drawImage(avatar, 496, 183, 400, 400)
    ctx.rotate(-6 * (Math.PI / 180))

    return canvas.toBuffer()
  }
}
