import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { parse as parsePath } from 'node:path';

export default async function(name) {

  const me = await getApi('getMe');

  if (!me?.is_bot) {
    return null;
  }

  const stickerSet = await getApi('getStickerSet', {
    name
  });

  if (!stickerSet) {
    process.stderr.write(`Set "${name}" not found`);
    return;
  }

  const stickerPath = `stickers/_download/${stickerSet.name}`;
  await mkdir(stickerPath, { recursive: true });

  // prefix stickers by index so they're sorted based on their order
  let i = 0;
  for (const stickerInfo of stickerSet.stickers) {
    i++;

    const stickerFileInfo = await getApi('getFile', {
      file_id: stickerInfo.file_id
    });

    const stickerFilePathInfo = parsePath(stickerFileInfo.file_path);
    const stickerName = `${String(i).padStart(3, '0')}-${stickerFileInfo.file_unique_id}${stickerFilePathInfo.ext}`;

    await downloadSticker(stickerFileInfo, stickerName, stickerPath, stickerInfo.set_name);
  }
}


async function getApi(name, params) {
  const endpoint = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`
  if (params) {
    params = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
  }
  const result = await fetch(`${endpoint}/${name}${params ?? ''}`)
                 .then(x => x.json());
  if (!result.ok) {
    return null;
  }

  return result.result;
}

async function downloadSticker(sticker, stickerName, path, setName) {

  const outFile = `${path}/${stickerName}`;

  if (existsSync(outFile)) {
    process.stdout.write(`Skipping ${setName}: ${stickerName}\n`);
    return;
  }

  const endpoint = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}`

  process.stdout.write(`Downloading ${setName}: ${stickerName}...\n`);
  const blob = await fetch(`${endpoint}/${sticker.file_path}`)
               .then(x => x.blob());
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await writeFile(outFile, buffer);
}
