"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wavToPng = void 0;
var canvas_1 = require("canvas");
function wavToPng(_a, wavData) {
    var diameter = _a.diameter;
    var center = diameter / 2;
    var outerDiameter = diameter;
    var centerDiameter = outerDiameter * 1.5;
    var centerRadius = centerDiameter / 2;
    var centerCircumference = 2 * Math.PI * centerRadius;
    var canvas = canvas_1.createCanvas(outerDiameter, outerDiameter);
    var ctx = canvas.getContext('2d');
    ctx.patternQuality = 'bilinear';
    ctx.quality = 'bilinear';
    ctx.antialias = 'subpixel';
    var channelData = wavData.channelData;
    var stepPixels;
    channelData.forEach(function (channel) {
        stepPixels = Math.ceil(channel.length / centerCircumference);
        draw(channel, stepPixels, ctx, center, centerRadius, centerCircumference);
    });
    function draw(channelData, samplesPerPixel, ctx, center, radius, circumference) {
        for (var i = 0; i < circumference; i += 1) {
            var min = 1.0;
            var max = -1.0;
            for (var j = 0; j < stepPixels; j += 1) {
                var datum = channelData[i * stepPixels + j];
                if (datum < min) {
                    min = datum;
                }
                else if (datum > max) {
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
exports.wavToPng = wavToPng;
