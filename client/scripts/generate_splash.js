const Jimp = require('jimp');
const path = require('path');

const outPath = path.join(__dirname, '..', 'resources', 'splash.png');

new Jimp(1920, 1920, 0xffffffff, (err, image) => {
  if (err) {
    console.error('Error creating image:', err);
    process.exit(1);
  }

  // Optionally add a simple centered label (requires Jimp.FONT_SANS_32_BLACK)
  Jimp.loadFont(Jimp.FONT_SANS_64_BLACK)
    .then(font => {
      const text = 'Chatify';
      const textWidth = Jimp.measureText(font, text);
      const textHeight = Jimp.measureTextHeight(font, text, 1920);
      image.print(
        font,
        (1920 - textWidth) / 2,
        (1920 - textHeight) / 2,
        text
      );
      image.write(outPath, err => {
        if (err) {
          console.error('Error writing image:', err);
          process.exit(1);
        }
        console.log('Generated', outPath);
      });
    })
    .catch(() => {
      // If font load fails, just write the image
      image.write(outPath, err => {
        if (err) {
          console.error('Error writing image:', err);
          process.exit(1);
        }
        console.log('Generated', outPath);
      });
    });
});
