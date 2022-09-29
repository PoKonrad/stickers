import fs from 'node:fs';
import path from 'node:path';
import Puppeteer from 'puppeteer';

const lottieScriptPath = new URL('./node_modules/lottie-web/build/player/lottie.min.js', import.meta.url);
const lottieScript = fs.readFileSync(lottieScriptPath, { encoding: 'utf8', flag: 'r' });

export default async function(lottieData, size, tempDir) {
  size ??= 256;

  const browser = await Puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  page.on('console', console.log.bind(console));
  page.on('error', console.error.bind(console));

  await page.setViewport({
    width: size,
    height: size
  });
  const html = createHtml(lottieData, size);
  await page.setContent(html);
  await page.waitForSelector('.ready');

  const duration = await page.evaluate(() => duration);
  const numFrames = await page.evaluate(() => numFrames);

  const pageFrame = page.mainFrame();
  const rootHandle = await pageFrame.$('#sticker');

  for (let frame = 0; frame < numFrames; frame++) {
    const tempFile = path.join(tempDir, `frame-${(frame+'').padStart(6, '0')}.png`);

    await page.evaluate((frame) => animation.goToAndStop(frame, true), frame)
    await rootHandle.screenshot({
      path: tempFile,
      omitBackground: true,
      type: 'png'
    });
  }
}


function createHtml(lottieJson, size) {
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <script>
      ${lottieScript}
    </script>

    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html, body {
        background: transparent;
        width: ${size}px;
        height: ${size}px;
        overflow: hidden;
      }

      .ready {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="sticker"></div>

    <script>
      const animation = lottie.loadAnimation({
        container: document.querySelector('#sticker'),
        loop: false,
        autoplay: false,
        animationData: ${JSON.stringify(lottieJson)}
      });

      const duration = animation.getDuration();
      const numFrames = animation.getDuration(true);

      const div = document.createElement('div');
      div.className = 'ready';
      document.body.appendChild(div);
    </script>

  </body>
</html>
`;

  return html;
}
