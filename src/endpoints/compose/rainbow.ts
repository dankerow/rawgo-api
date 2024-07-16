import { Endpoint } from '@/structures'
import sharp from 'sharp'
import GIFEncoder from 'gif-encoder-2'

export default class Rainbow extends Endpoint {
  constructor() {
    super({
      name: 'rainbow',
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
    const frameCount = 35
    const encoder = new GIFEncoder(286, 286)

    encoder.setRepeat(0)
    encoder.setDelay(20)

    const image = sharp(await this.toBuffer(query.image))
      .resize(286, 286)

    encoder.start()

    for (let i = 0; i < frameCount; i++) {
      const imageFrame = await image.clone()
        .modulate({
          saturation: 5,
          hue: i * 10
        })
        .toColourspace('rgba')
        .raw()
        .toBuffer()

      encoder.addFrame(imageFrame)
    }

    encoder.finish()

    return encoder.out.getData()
  }
}
