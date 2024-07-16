import type { Icon } from '@/types/icon'

import { Endpoint } from '@/structures'
import { createCanvas, loadImage, registerFont } from 'canvas'

registerFont('./src/assets/fonts/MinecraftRegular.otf', { family: 'Minecraft' })
registerFont('./src/assets/fonts/MinecraftBold.otf', { family: 'Minecraft', weight: 'bold' })
registerFont('./src/assets/fonts/MinecraftItalic.otf', { family: 'Minecraft', style: 'italic' })
registerFont('./src/assets/fonts/MinecraftBoldItalic.otf', { family: 'Minecraft', weight: 'bold', style: 'italic' })

import icons from '@/assets/images/achievement/icons'

interface Query {
  title: string
  text: string
  icon: string
  textColor: string
  titleColor: string
  textFontStyle: fontWeights
  titleFontStyle: fontWeights
}

type fontWeights = 'bold' | 'italic' | 'normal'

export default class Achievement extends Endpoint {
  constructor() {
    super({
      name: 'achievement',
      parameters: [
        {
          name: 'title',
          type: 'string'
        },
        {
          name: 'text',
          type: 'string',
          required: true
        },
        {
          name: 'icon',
          type: 'string'
        },
        {
          name: 'textColor',
          type: 'string'
        },
        {
          name: 'titleColor',
          type: 'string'
        },
        {
          name: 'textFontStyle',
          type: 'string'
        },
        {
          name: 'titleFontStyle',
          type: 'string'
        }
      ]
    })
  }

  async make(query: Query) {
    const titleColor = query.titleColor ? query.titleColor.replace('#', '') : 'ffff00'
    const textColor = query.textColor ? query.textColor.replace('#', '') : 'ffffff'

    let titleFontStyle: fontWeights

    if (query.titleFontStyle) {
      if (query.titleFontStyle === 'bold') titleFontStyle = 'bold'
      else if (query.titleFontStyle === 'italic') titleFontStyle = 'italic'
      else if (query.titleFontStyle === 'normal') titleFontStyle = 'normal'
      else titleFontStyle = 'normal'
    } else {
      titleFontStyle = 'normal'
    }

    let textFontStyle: fontWeights

    if (query.textFontStyle) {
      if (query.textFontStyle === 'bold') textFontStyle = 'bold'
      else if (query.textFontStyle === 'italic') textFontStyle = 'italic'
      else if (query.textFontStyle === 'normal') textFontStyle = 'normal'
      else textFontStyle = 'normal'
    } else {
      textFontStyle = 'normal'
    }

    let selectedIcon: Icon
    if (query.icon && icons.find((icon) => icon.name === query.icon)) {
      selectedIcon = icons.find((icon) => icon.name === query.icon)
    } else {
      selectedIcon = icons.find((icon) => icon.name === 'grass')
    }

    const base = await loadImage('./src/assets/images/achievement/base.png')
    const icon = await loadImage(Buffer.from(selectedIcon.buffer, 'base64'))
    const canvas = createCanvas(320, 64)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(base, 0, 0, 320, 64)
    ctx.drawImage(icon, 15, 18, 30, 30)
    ctx.fillStyle = `#${titleColor}`
    ctx.font = `${titleFontStyle} 20px Minecraft`
    ctx.fillText(query.title ? `${query.title.substring(0, 25)}` : 'Achievement get!', 60, 30)
    ctx.fillStyle = `#${textColor}`
    ctx.font = `${textFontStyle} 17px Minecraft`
    ctx.fillText(query.text.length > 25 ? query.text.substring(0, 25) : query.text, 60, 50)

    return canvas.toBuffer()
  }
}
