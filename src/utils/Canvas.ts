import type { CanvasRenderingContext2D } from 'canvas'

/**
 * Provides some more tools to Canvas
 * @class Canvas
 */
export class Canvas {
  /**
	 * @param {number} min The minimum value.
	 * @param {number} max The maximum value.
	 * @returns {number}
	 */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @param {number} [offset=15] The offset of the red channel.
	 * @returns {void}
	 */
  static offsetRed(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, offset: number = 15): void {
    const image = ctx.getImageData(x, y, width, height)

    for (let i = 0; i < image.data.length; i += 4) {
      image.data[i] = image.data[i + 4 * offset * offset] === undefined ? 0 : image.data[i + 4 * offset]
    }

    return ctx.putImageData(image, x, y)
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @param {number} [passes=1] The number of times the blur will be applied.
	 * @returns {CanvasRenderingContext2D}
	 */
  static blur(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, passes: number = 1): CanvasRenderingContext2D {
    const matrix = [
      1 / 9, 1 / 9, 1 / 9,
      1 / 9, 1 / 9, 1 / 9,
      1 / 9, 1 / 9, 1 / 9
    ]

    for (let i = 0; i < passes; ++i) {
      Canvas.convolute(ctx, width, height, matrix, false)
    }

    return ctx
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @param {number} omega The omega value.
	 * @returns {void}
	 */
  static blurple(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, omega: { 85: number[]; 170: number[]; 255: number[] }): void {
    const image = ctx.getImageData(x, y, width, height)

    for (let i = 0; i < image.data.length; i += 4) {
      let red = image.data[i]
      let green = image.data[i + 1]
      let blue = image.data[i + 2]
      const keys = Object.keys(omega)

      for (let j = 0; j < keys.length; j++) {
        if (blue < Number(keys[j])) {
          const c = omega[keys[j]]

          red = c[0]
          green = c[1]
          blue = c[2]

          break
        }
      }

      image.data[i] = red
      image.data[i + 1] = green
      image.data[i + 2] = blue
    }

    return ctx.putImageData(image, x, y)
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @param {number} [brightness=50] The brightness to apply to the image.
	 * @returns {void}
	 */
  static brightness(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, brightness: number = 50): void {
    const image = ctx.getImageData(x, y, width, height)

    for (let i = 0; i < image.data.length; i += 4) {
      image.data[i] += brightness
      image.data[i + 1] += brightness
      image.data[i + 2] += brightness
    }

    return ctx.putImageData(image, x, y)
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @returns {void}
	 */
  static contrast(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    const image = ctx.getImageData(x, y, width, height)
    const factor = (259 / 100) + 1
    const intercept = 128 * (1 - factor)

    for (let i = 0; i < image.data.length; i += 4) {
      image.data[i] = (image.data[i] * factor) + intercept
      image.data[i + 1] = (image.data[i + 1] * factor) + intercept
      image.data[i + 2] = (image.data[i + 2] * factor) + intercept
    }

    return ctx.putImageData(image, x, y)
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @param {Array<number>} weights The weights to apply to the convolution.
	 * @param {boolean} [opaque=true] Whether the image should be opaque.
	 * @returns {void}
	 */
  static convolute(ctx: CanvasRenderingContext2D, width: number, height: number, weights: number[], opaque: boolean = true): void {
    const side = Math.round(Math.sqrt(weights.length))
    const halfSide = Math.floor(side / 2)

    const pixels = ctx.getImageData(0, 0, width, height)
    const src = pixels.data
    const sw = pixels.width
    const sh = pixels.height

    const w = sw
    const h = sh
    const output = ctx.getImageData(0, 0, width, height)
    const dst = output.data

    const alphaFac = opaque ? 1 : 0

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const sy = y
        const sx = x
        const dstOff = ((y * w) + x) * 4

        let r = 0
        let g = 0
        let b = 0
        let a = 0

        for (let cy = 0; cy < side; cy++) {
          for (let cx = 0; cx < side; cx++) {
            const scy = sy + cy - halfSide
            const scx = sx + cx - halfSide

            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              const srcOff = ((scy * sw) + scx) * 4
              const wt = weights[(cy * side) + cx]

              r += src[srcOff] * wt
              g += src[srcOff + 1] * wt
              b += src[srcOff + 2] * wt
              a += src[srcOff + 3] * wt
            }
          }
        }

        dst[dstOff] = r
        dst[dstOff + 1] = g
        dst[dstOff + 2] = b
        dst[dstOff + 3] = a + (alphaFac * (255 - a))
      }
    }

    return ctx.putImageData(output, 0, 0)
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @param {number} amplitude The amplitude of the distortion.
	 * @param {number} [strideLevel=4] The level of distortion.
	 * @returns {void}
	 */
  static distort(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, amplitude: number, strideLevel: number = 4): void {
    const image = ctx.getImageData(x, y, width, height)
    const tempImage = ctx.getImageData(x, y, width, height)
    const stride = width * strideLevel

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const xStride = Math.round(amplitude * Math.sin(2 * Math.PI * 3 * (j / height)))
        const yStride = Math.round(amplitude * Math.cos(2 * Math.PI * 3 * (i / width)))
        const location = (j * stride) + (i * strideLevel)
        const src = ((j + yStride) * stride) + ((i + xStride) * strideLevel)

        image.data[location] = tempImage.data[src]
        image.data[location + 1] = tempImage.data[src + 1]
        image.data[location + 2] = tempImage.data[src + 2]
      }
    }

    return ctx.putImageData(image, x, y)
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @param {number} amplitude The amplitude of the distortion.
	 * @param {number} [strideLevel=4] The level of distortion.
	 * @returns {void}
	 */
  static glitch(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, amplitude: number, strideLevel: number = 4): void {
    const image = ctx.getImageData(x, y, width, height)
    const tempImage = ctx.getImageData(x, y, width, height)
    const stride = width * strideLevel

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const xStride = Math.round(amplitude * Math.sin(2 * Math.PI * 3 * (j / height)))
        const yStride = Math.round(amplitude * Math.cos(2 * Math.PI * 3 * (i / width)))
        const location = (j * stride) + (i * strideLevel)
        const src = ((j + yStride) * stride) + ((i + xStride) * strideLevel)

        image.data[location] = tempImage.data[src]
        image.data[location + 1] = tempImage.data[src + 1]
        image.data[location + 2] = tempImage.data[src + 2]
      }
    }

    return ctx.putImageData(image, x, y)
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @returns {void}
	 */
  static grayscale(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    const image = ctx.getImageData(x, y, width, height)

    for (let i = 0; i < image.data.length; i += 4) {
      const luminance = (0.34 * image.data[i]) + (0.5 * image.data[i + 1]) + (0.16 * image.data[i + 2])

      image.data[i] = luminance
      image.data[i + 1] = luminance
      image.data[i + 2] = luminance
    }

    return ctx.putImageData(image, x, y)
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @returns {void}
	 */
  static sepia(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    const image = ctx.getImageData(x, y, width, height)

    for (let i = 0; i < image.data.length; i += 4) {
      const r = image.data[i]
      const g = image.data[i + 1]
      const b = image.data[i + 2]

      image.data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189)
      image.data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168)
      image.data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131)
    }

    return ctx.putImageData(image, x, y)
  }

  /**
	 * @param ctx
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @returns {void}
	 */
  static invert(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    const image = ctx.getImageData(x, y, width, height)

    for (let i = 0; i < image.data.length; i += 4) {
      image.data[i] = 255 - image.data[i]
      image.data[i + 1] = 255 - image.data[i + 1]
      image.data[i + 2] = 255 - image.data[i + 2]
    }

    return ctx.putImageData(image, x, y)
  }

  /**
	 * @param ctx
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @returns {void}
	 */
  static invertGrayscale(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    const image = ctx.getImageData(x, y, width, height)

    for (let i = 0; i < image.data.length; i += 4) {
      const luminance = 255 - ((0.2126 * image.data[i]) + (0.7152 * image.data[i + 1]) + (0.0722 * image.data[i + 2]))

      image.data[i] = luminance
      image.data[i + 1] = luminance
      image.data[i + 2] = luminance
    }

    return ctx.putImageData(image, x, y)
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @param {number} [threshold=10]
	 * @returns {void}
	 */
  static threshold(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, threshold: number = 10): void {
    const image = ctx.getImageData(x, y, width, height)

    for (let i = 0; i < image.data.length; i += 4) {
      const luminance = (0.2126 * image.data[i]) + (0.7152 * image.data[i + 1]) + (0.0722 * image.data[i + 2]) >= threshold ? 255 : 0

      image.data[i] = luminance
      image.data[i + 1] = luminance
      image.data[i + 2] = luminance
    }

    return ctx.putImageData(image, x, y)
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @param {number} [darkness=10]
	 * @returns {void}
	 */
  static darken(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, darkness: number = 10): void {
    const image = ctx.getImageData(x, y, width, height)

    for (let i = 0; i < image.data.length; i += 4) {
      image.data[i] -= darkness
      image.data[i + 1] -= darkness
      image.data[i + 2] -= darkness
    }

    return ctx.putImageData(image, 0, 0)
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {string} color The color to overlay.
	 * @param {number} x The x-axis coordinate of the rectangle's starting point.
	 * @param {number} y The y-axis coordinate of the rectangle's starting point.
	 * @param {number} width The rectangle's width. Positive values are to the right, and negative to the left.
	 * @param {number} height The rectangle's height. Positive values are down, and negative are up.
   * @returns {void}
	 */
  static overlay(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, width: number, height: number): void {
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
    ctx.globalAlpha = 0.2
  }

  /**
	 * @param ctx
	 * @param {number} x The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} y The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
	 * @param {number} width The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
	 * @param {number} height The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
	 * @returns {void}
	 */
  static silhouette(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
    const image = ctx.getImageData(x, y, width, height)

    for (let i = 0; i < image.data.length; i += 4) {
      image.data[i] = 0
      image.data[i + 1] = 0
      image.data[i + 2] = 0
    }

    return ctx.putImageData(image, x, y)
  }

  /**
	 * @param ctx The CanvasRenderingContext2D this filter will be applied to.
	 * @param {string} text The text to shorten
	 * @param {number} maxWidth The maximum width of the text
	 * @returns {string}
	 */
  static shortenText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
    let shorten = false

    while (ctx.measureText(text).width > maxWidth) {
      if (!shorten) shorten = true
      text = text.substring(0, text.length - 1)
    }

    return shorten ? `${text}...` : text
  }

  /**
	 * @param ctx  The CanvasRenderingContext2D this filter will be applied to.
	 * @param {string} text The text to wrap
	 * @param {number} maxWidth The maximum width of the text
	 * @returns {Promise<unknown>} The wrapped text
	 */
  static wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): Promise<string[]> {
    return new Promise(resolve => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text])
      if (ctx.measureText('W').width > maxWidth) return resolve(null)

      const words = text.split(' ')
      const lines = []
      let line = ''

      while (words.length > 0) {
        let split = false

        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0]
          words[0] = temp.slice(0, -1)

          if (split) {
            words[1] = `${temp.slice(-1)}${words[1]}`
          } else {
            split = true
            words.splice(1, 0, temp.slice(-1))
          }
        }

        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
          line += `${words.shift()} `
        } else {
          lines.push(line.trim())
          line = ''
        }

        if (words.length === 0) lines.push(line.trim())
      }
      return resolve(lines)
    })
  }
}
