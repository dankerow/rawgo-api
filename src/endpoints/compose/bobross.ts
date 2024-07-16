import { Endpoint } from '@/structures'
import { createCanvas, loadImage } from 'canvas'

export default class Bobross extends Endpoint {
  constructor() {
    super({
      name: 'bobross',
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
    const base = await loadImage('./src/assets/images/bobross.png')
    const avatar = await loadImage(query.image)
    const canvas = createCanvas(base.width, base.height)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, base.width, base.height)
    ctx.rotate(3 * (Math.PI / 180))
    ctx.drawImage(avatar, 30, 19, 430, 430)
    ctx.rotate(-3 * (Math.PI / 180))
    ctx.drawImage(base, 0, 0)

    return canvas.toBuffer()
  }
}
