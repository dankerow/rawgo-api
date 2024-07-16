import { Endpoint } from '@/structures'
import { Canvas } from '@/utils'
import { createCanvas, loadImage } from 'canvas'
import GIFEncoder from 'gif-encoder-2'

export default class Triggered extends Endpoint {
  constructor() {
    super({
      name: 'triggered',
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
    const text = await loadImage('./src/assets/images/triggered.jpg')
    const data = await loadImage(query.image)

    const canvas = createCanvas(286, 286)
    const ctx = canvas.getContext('2d')

    const encoder = new GIFEncoder(286, 286)
    encoder.setRepeat(0)
    encoder.setDelay(15)
    encoder.start()

    for (let i = 0; i < 8; i++) {
      ctx.clearRect(0, 0, 286, 286)
      ctx.drawImage(data, -52 + Canvas.randomInt(-16, 16), -52 + Canvas.randomInt(-16, 16), 350, 350)
      ctx.fillStyle = '#FF000033'
      ctx.fillRect(0, 0, 286, 286)
      ctx.drawImage(text, -8 + Canvas.randomInt(-8, 8), 210 + Canvas.randomInt(0, 12), 300, 80)

      encoder.addFrame(ctx.getImageData(0, 0, 286, 286).data)
    }

    encoder.finish()

    return encoder.out.getData()
  }
}
