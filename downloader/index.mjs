import zlib from 'node:zlib';
import fs from 'node:fs';
import util from 'node:util';
import path from 'node:path';
import os from 'node:os';
import renderLottie from './renderer.mjs';
import renderGif from './ffmpeg.mjs';
import downloadSet from './downloader.mjs';

const readFile = util.promisify(fs.readFile);

const SIZES = [256, 160, 128, 64, 32];

async function main(args) {

  await convert('testfile.tgs');

}

async function convert(sticker) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'telegram-sticker-temp',));

  const data = await unpack(sticker);
  await renderLottie(data, 256, tempDir);

  fs.rmSync(tempDir, { recursive: true });
}

async function unpack(file) {
  const buffer =  await readFile(file);
  const json = zlib.gunzipSync(buffer , { finishFlush: zlib.constants.Z_SYNC_FLUSH }).toString()

  return JSON.parse(json);
}

main(process.argv);
