import { Endpoint } from '@/structures'
import { createCanvas, loadImage } from 'canvas'

export default class Frame extends Endpoint {
  constructor() {
    super({
      name: 'frame',
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
    const base = await loadImage('./src/assets/images/frame.png')
    const data = await loadImage(query.image)
    const canvas = createCanvas(data.width, data.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(data, 0, 0)
    ctx.drawImage(base, 0, 0, data.width, data.height)

    return canvas.toBuffer()
  }
}
