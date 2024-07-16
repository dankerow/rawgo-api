import { Endpoint } from '@/structures'
import { createCanvas, loadImage } from 'canvas'

export default class Pixelate extends Endpoint {
  constructor() {
    super({
      name: 'pixelate',
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

    ctx.imageSmoothingEnabled = false
    const width = canvas.width * 0.15
    const height = canvas.height * 0.15

    ctx.drawImage(data, 0, 0, width, height)
    ctx.drawImage(canvas, 0, 0, width, height, 0, 0, canvas.width, canvas.height)

    return canvas.toBuffer()
  }
}
