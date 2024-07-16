import { Endpoint } from '@/structures'
import { createCanvas, loadImage } from 'canvas'

export default class Beautiful extends Endpoint {
  constructor() {
    super({
      name: 'beautiful',
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
    const base = await loadImage('./src/assets/images/beautiful.png')
    const avatar = await loadImage(query.image)
    const canvas = createCanvas(base.width, base.height)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, base.width, base.height)
    ctx.drawImage(avatar, 333, 35, 135, 135)
    ctx.drawImage(avatar, 335, 301, 135, 135)
    ctx.drawImage(base, 0, 0)

    return canvas.toBuffer()
  }
}
