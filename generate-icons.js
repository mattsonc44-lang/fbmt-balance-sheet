// Run once after placing your logo at: public/icons/source.png
// Usage: npm install sharp --save-dev && node generate-icons.js

import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = join(__dirname, 'public/icons/source.png')
const OUT = join(__dirname, 'public/icons')
mkdirSync(OUT, { recursive: true })

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

async function run() {
  console.log('Generating icons from', SRC)
  for (const size of SIZES) {
    await sharp(SRC)
      .resize(size, size, { fit: 'contain', background: { r: 107, g: 14, b: 30, alpha: 1 } })
      .png()
      .toFile(join(OUT, `icon-${size}x${size}.png`))
    console.log(`  icon-${size}x${size}.png`)
  }
  console.log('Done! All icons generated.')
}
run().catch(console.error)
