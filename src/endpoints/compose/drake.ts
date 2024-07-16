import { Endpoint } from '@/structures'
import { createCanvas, loadImage } from 'canvas'

export default class Drake extends Endpoint {
  constructor() {
    super({
      name: 'drake',
      parameters: [
        {
          name: 'firstImage',
          type: 'url',
          required: true
        },
        {
          name: 'secondImage',
          type: 'url',
          required: true
        }
      ]
    })
  }

  async make(query: { firstImage: string; secondImage: string }) {
    const base = await loadImage('./src/assets/images/drake.png')
    const nahAvatar = await loadImage(query.firstImage)
    const yeahAvatar = await loadImage(query.secondImage)
    const canvas = createCanvas(base.width / 2, base.height / 2)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(base, 0, 0, base.width / 2, base.height / 2)
    ctx.drawImage(nahAvatar, 512 / 2, 0, 512 / 2, 512 / 2)
    ctx.drawImage(yeahAvatar, 512 / 2, 512 / 2, 512 / 2, 512 / 2)

    return canvas.toBuffer()
  }
}
