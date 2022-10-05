import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import type { MatCheckboxChange } from '@angular/material/checkbox';
import type { MatSelectChange } from '@angular/material/select';
import { StickersService } from './services/stickers.service';
import { StickerSetsService } from './services/sticker-sets.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('topBar', [
      state(
        'hidden',
        style({
          transform: 'translate(0, -4rem)',
        })
      ),

      state(
        'shown',
        style({
          transform: 'translate(0, 0rem)',
        })
      ),

      transition('hidden => shown', [animate('0.2s ease')]),
      transition('shown => hidden', [animate('0.2s ease')]),
    ]),

    trigger('hide', [
      state(
        'shown',
        style({
          display: 'block',
        })
      ),

      state(
        'hidden',
        style({
          display: 'none',
        })
      ),

      transition('shown => hidden', [animate('0.1s')]),
      transition('hidden => shown', [animate('0.1s')]),
    ]),
  ],
})
export class AppComponent {
  json: StickerJson | undefined;

  hidden: any = '';
  hiddenShown: boolean = false;
  tempHidden: Array<string> = this._stickerService.tempHidden;
  unsavedBar: boolean = false;
  nsfwToggle: boolean = false;
  size: number = 0;

  resolution: any[] = [];

  async getJson() {
    const json = await fetch('stickers/stickers.json').then((resp) =>
      resp.json()
    );
    this.json = json;
    this.resolution = json.sizes.map((x: any) => {
      return {
        value: x,
        text: x ? `${x}x${x}px` : 'Original',
      };
    });
  }

  handleSelectChange(e: MatSelectChange) {
    this.size = e.value;
    localStorage.setItem('imageSize', JSON.stringify(this.size));
  }

  constructor(
    public _stickerService: StickersService,
    private _stickerSetsService: StickerSetsService
    ) {}

  get StickerSets(): StickerSet[] {
    if (!this.json) {
      return [];
    }
    let sets: StickerSet[] = [...this.json.sets];

    // find all the favorites by id from all sets and prepend them as its own set
    const favoriteStickers: any[] = [];
    if (this._stickerService.Favorites.length) {
      for (const set of sets) {
        const stickers = set.stickers.filter((x) =>
          this._stickerService.Favorites.includes(x.id)
        );
        if (stickers.length) {
          favoriteStickers.push.apply(favoriteStickers, stickers);
        }
      }
    }

    sets.unshift({
      name: 'Favorites',
      nsfw: false,
      stickers: favoriteStickers,
    });

    return sets;
  }

  toggleShowHidden(checkbox: MatCheckboxChange) {
    this._stickerService.toggleShowHidden(checkbox)
  }

  toggleShowNsfw(checkbox: MatCheckboxChange) {
    this._stickerSetsService.toggleNsfw(checkbox)
  }

  ngOnInit() {
    console.log('%c uwu', 'font-size: 4rem');
    this.getJson();
  }

  trackBySet(el: any): string {
    return el.name;
  }

  title = 'stickers';
}
