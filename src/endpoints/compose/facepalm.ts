import { Endpoint } from '@/structures'
import { createCanvas, loadImage } from 'canvas'

export default class FacePalm extends Endpoint {
  constructor() {
    super({
      name: 'facepalm',
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
    const base = await loadImage('./src/assets/images/facepalm.png')
    const data = await loadImage(query.image)
    const canvas = createCanvas(data.width, data.height)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, 632, 357)
    ctx.drawImage(data, 199, 112, 235, 235)
    ctx.drawImage(base, 0, 0, 632, 357)

    return canvas.toBuffer()
  }
}
