const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')
const chars = ['⚪', '⚫']
//const chars = ['@', ' ']
const cursor = require("cli-cursor")
const termSize = require('term-size')
const process = require('child_process')
async function Convert(location, Width, height){
    const image = await Jimp.read(location)

    const imageW = image.bitmap.width
    const imageH = image.bitmap.height

    const ratio = imageW / imageH
    const EmulatorWidth = Width
    const EmulatorHeight = Math.floor(Width / ratio)
    image.resize(Width, EmulatorHeight, Jimp.RESIZE_NEAREST_NEIGHBOR)
    let asciiArt = '';
    const min = 0;
    const max = 255;
    image.scan(0,0,image.bitmap.width, image.bitmap.height, (x,y,idx) => {
        
        const GREY_SCALE_VAL = Jimp.intToRGBA(image.getPixelColor(x,y)).r
        const ascii = GREY_SCALE_VAL >= 128 ? chars[0] : chars[1]
        asciiArt += ascii
        if(x === image.bitmap.width -1){
            asciiArt += "\n"
        }
        /*
        const asciichar = GREY_SCALE_VAL >= 128 ? chars[0] : chars[1]
        asciiArt += asciichar
        if(x === image.bitmap.width - 1){
            asciiArt += '\n'
        }
        */
    })
    return asciiArt
}

(async() => {
    console.clear()
    const raws = termSize().rows
    const rows = raws >= 40 ? raws+20 : raws;
    const columes = termSize().columns;
    const frames = fs.readdirSync('./frames')
    const framedelay = Math.floor(1000/67)
    cursor.hide()
        for(let frame = 0; frame <= frames.length - 1; frame++){
            const p = path.join('./frames',`frames${frame + 1}.png`)
            console.clear()
            console.log(await Convert(p, rows, columes))
            await new Promise((resolve) => setTimeout(resolve, framedelay))
        }
        console.clear()
})()
