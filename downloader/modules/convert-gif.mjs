import { readFile, unlink } from 'node:fs/promises';
import { gunzipSync, constants as zlibConstants } from 'node:zlib';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import Puppeteer from 'puppeteer';

export default async function(file, size) {
  console.log(`GIF: Converting ${file} to size ${(size ? `${size}x${size}` : 'original')}...`);
  const data = await unpack(file);

  // render it into its own gif
  const frames = await renderLottie(data, size);

  const fps = ~~data.fr;
  const gif = await convertToGif(frames, fps);

  return gif;
}


// unpack tgs into json
async function unpack(file) {
  const buffer =  await readFile(file);
  const json = gunzipSync(buffer , { finishFlush: zlibConstants.Z_SYNC_FLUSH }).toString()

  return JSON.parse(json);
}

// js for playing lottie json in a browser
const lottieScriptPath = new URL('../node_modules/lottie-web/build/player/lottie.min.js', import.meta.url);
let lottieScript = null;

// uses headless chrome to screenshot each frame
// of the lottie json animation and feeds it to ffmpeg
async function renderLottie(lottieData, size) {
  size ||= lottieData.w;

  if (!lottieScript) {
    lottieScript = await readFile(lottieScriptPath, { encoding: 'utf8', flag: 'r' });
  }


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

  const frames = [];
  for (let frame = 0; frame < numFrames; frame++) {
    process.stdout.write(`\r    rendering frame ${frame+1}/${numFrames}`);
    await page.evaluate((frame) => animation.goToAndStop(frame, true), frame)
    const screenshot = await rootHandle.screenshot({
      omitBackground: true,
      type: 'png'
    });
    frames.push(screenshot);
  }
  process.stdout.write(`\r\n`);

  await rootHandle.dispose();
  await browser.close();

  return frames;
}

// create gif with each frame as input with palette
// returns the file
async function convertToGif(frames, fps) {
  const tempPalette = path.join(os.tmpdir(), 'palette.png');
  const outputFile = path.join(os.tmpdir(), 'sticker.gif');

  process.stdout.write(`    creating gif palette\n`);
  await runFfmpeg(frames, [
    '-v', 'error',
    '-stats',
    '-hide_banner',
    '-y',
    '-f', 'image2pipe',
    '-r', `${fps}`,
    '-i', '-',
    '-vf', 'palettegen',
    '-an',
    '-sn',
    tempPalette
  ]);

  process.stdout.write(`    rendering gif\n`);
  await runFfmpeg(frames, [
    '-v', 'error',
    '-stats',
    '-hide_banner',
    '-y',
    '-f', 'image2pipe',
    '-r', `${fps}`,
    '-i', '-',
    '-i', tempPalette,
    '-lavfi', `fps=${fps}[x]; [x][1:v] paletteuse`,
    '-an',
    '-sn',
    outputFile
  ]);

  const file = await readFile(outputFile);
  await unlink(tempPalette);
  await unlink(outputFile);

  return file;
}

async function runFfmpeg(frames, args) {

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args);
    const { stdin, stdout, stderr } = ffmpeg;

    //stdout.pipe(process.stdout);
    //stderr.pipe(process.stderr);

    stdin.on('error', (err) => {
      if (err.code !== 'EPIPE') {
        return reject(err);
      }
    });

    ffmpeg.on('exit', async (status) => {
      if (status) {
        return reject(new Error(`FFmpeg exited with status ${status}`));
      } else {
        return resolve();
      }
    });

    for (const frame of frames) {
      stdin.write(frame)
    }
    stdin.end();
  });
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
