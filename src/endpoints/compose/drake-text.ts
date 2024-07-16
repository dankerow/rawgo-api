import { Endpoint } from '@/structures'
import { Canvas } from '@/utils'
import { createCanvas, loadImage } from 'canvas'

export default class DrakeText extends Endpoint {
  constructor() {
    super({
      name: 'drake-text',
      parameters: [
        {
          name: 'firstText',
          type: 'string',
          required: true
        },
        {
          name: 'secondText',
          type: 'string',
          required: true
        }
      ]
    })
  }

  async make(query: { firstText: string; secondText: string }) {
    const base = await loadImage('./src/assets/images/drake.png')
    const canvas = createCanvas(base.width / 2, base.height / 2)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(base, 0, 0, base.width / 2, base.height / 2)
    ctx.font = '20px Impact'

    const firstText = await Canvas.wrapText(ctx, query.firstText, (512 / 2) - 5)
    ctx.fillText(firstText.join('\n'), (512 / 2) + 5, 40 / 2, (512 / 2) - 5)

    const secondText = await Canvas.wrapText(ctx, query.secondText, (512 / 2) - 5)
    ctx.fillText(secondText.join('\n'), (512 / 2) + 5, 552 / 2, (512 / 2) - 5)

    return canvas.toBuffer()
  }
}
