export {};

declare global {
  type StickerJson = {
    sizes: number[];
    sets: StickerSet[];
    previewSize: number;
  }
  type StickerSet = {
    name: string;
    nsfw: boolean;
    stickers: Sticker[];
  }
  type Sticker = {
    type: string;
    num: string;
    id: string
  }
}
