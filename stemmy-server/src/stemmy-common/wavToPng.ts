import nodewav, { WavData } from 'node-wav';

import { createCanvas, Canvas, CanvasRenderingContext2D } from 'canvas';

interface roundShapeOptions {
  diameter: number;
}

export function wavToPng(
  { diameter }: roundShapeOptions,
  channelData: Float32Array[],
  sampleRate: number
): Canvas {
  let center = diameter / 2;
  let outerDiameter = diameter;
  let centerDiameter = outerDiameter * 1.5;
  let centerRadius = centerDiameter / 2;
  let centerCircumference = 2 * Math.PI * centerRadius;

  const canvas = createCanvas(outerDiameter, outerDiameter);
  const ctx = canvas.getContext('2d');
  ctx.patternQuality = 'bilinear';
  ctx.quality = 'bilinear';
  ctx.antialias = 'subpixel';

  let stepPixels: number;

  channelData.forEach((channel: number[] | Float32Array) => {
    stepPixels = Math.ceil(channel.length / centerCircumference);
    draw(channel, stepPixels, ctx, center, centerRadius, centerCircumference);
  });

  function draw(
    channelData: number[] | Float32Array,
    stepPixels: number,
    ctx: CanvasRenderingContext2D,
    center: number,
    radius: number,
    circumference: number
  ) {
    for (var i = 0; i < circumference; i += 1) {
      var min = 1.0;
      var max = -1.0;

      for (var j = 0; j < stepPixels; j += 1) {
        var datum = channelData[i * stepPixels + j];

        if (datum < min) {
          min = datum;
        } else if (datum > max) {
          max = datum;
        }
      }

      // we have to rotate the canvas before each rectangle is drawn.

      ctx.save(); // save current location
      ctx.translate(center, center);
      ctx.rotate((Math.PI / (circumference / 2)) * i);

      var x = 0;
      var height = Math.max(1, max - min * (radius / 3));
      var y = -1 * (radius / 2 + height / 2);

      ctx.fillRect(x, y, 1, height);
      ctx.restore();
    }
  }

  return canvas;
}
