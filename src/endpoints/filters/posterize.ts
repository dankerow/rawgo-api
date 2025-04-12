import { Endpoint } from '@/structures'
import { Jimp } from 'jimp'

export default class Posterize extends Endpoint {
  constructor() {
    super({
      name: 'posterize',
      parameters: [
        {
          name: 'image',
          type: 'url',
          required: true
        },
        {
          name: 'radius',
          type: 'number'
        }
      ]
    })
  }

  async make(query: { image: string }) {
    const image = await Jimp.read(query.image)

    image
      .posterize(5)

    return this.toBuffer(image)
  }
}
