import { readFile, unlink } from 'node:fs/promises';
import { gunzipSync, constants as zlibConstants } from 'node:zlib';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';

export default async function(file, size) {
  console.log(`WEBP: Converting ${file} to size ${(size ? `${size}x${size}` : 'original')}...`);

  const outputFile = path.join(os.tmpdir(), 'sticker.webp');

  await new Promise((resolve, reject) => {

    const convert = spawn('convert',
    [
      file,
      '-resize', `${(size ? `${size}x${size}` : '100%')}`,
      '-define', 'webp:lossless=true',
      outputFile
    ]);

    const { stdin, stdout, stderr } = convert;

    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);

    convert.on('exit', async (status) => {
      if (status) {
        return reject(new Error(`convert exited with status ${status}`));
      } else {
        return resolve();
      }
    });
  });

  const webpFile = await readFile(outputFile);
  await unlink(outputFile);

  return webpFile;
}
