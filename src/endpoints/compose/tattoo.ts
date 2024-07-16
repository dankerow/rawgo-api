import { Endpoint } from '@/structures'
import { createCanvas, loadImage } from 'canvas'

export default class Tattoo extends Endpoint {
  constructor() {
    super({
      name: 'tattoo',
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
    const base = await loadImage('./src/assets/images/tattoo.png')
    const avatar = await loadImage(query.image)
    const canvas = createCanvas(750, 1089)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(base, 0, 0, 750, 1089)
    ctx.save()
    ctx.rotate(-10 * (Math.PI / 180))
    ctx.drawImage(avatar, 0, 0)
    ctx.rotate(10 * (Math.PI / 180))
    ctx.restore()

    return canvas.toBuffer()
  }
}
