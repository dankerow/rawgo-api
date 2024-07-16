import { Endpoint } from '@/structures'
import { createCanvas, loadImage } from 'canvas'

export default class Challenger extends Endpoint {
  constructor() {
    super({
      name: 'challenger',
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
    const base = await loadImage('./src/assets/images/challenger.png')
    const avatar = await loadImage(query.image)
    const canvas =  createCanvas(base.width, base.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(base, 0, 0)
    ctx.drawImage(avatar, 484, 98, 256, 256)

    return canvas.toBuffer()
  }
}
