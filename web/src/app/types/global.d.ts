export {};

declare global {
  type StickerJson = {
    sizes: number[];
    sets: StickerSet[];
  }
  type StickerSet = {
    name: string;
    nsfw: boolean;
    stickers: Sticker[];
  }
  type Sticker = {
    id: string;
    type: string;
    name: string;
    set: string;
    preview: string;
  }
}
