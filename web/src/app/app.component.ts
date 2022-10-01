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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MatSnackBar],
  animations: [
    trigger('topBar', [
      state(
        'hidden',
        style({
          transform: 'translate(0, -4rem)'
        })
      ),

      state('shown', style({
        transform: 'translate(0, 0rem)'
      })),

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
  json:  StickerJson | undefined;

  hidden: any = '';
  hiddenShown: boolean = false;
  tempHidden: Array<string> = [];
  unsavedBar: boolean = false
  nsfwToggle: boolean = false
  size: number = 0;

  resolution: any[] = [];

  async getJson() {
    const json = await fetch('stickers/stickers.json').then(resp => resp.json());
    this.json = json;
    this.resolution = json.sizes.map((x: any) => {
      return {
        value: x,
        text: x ? `${x}x${x}px` : 'Original'
      }
    });
  }

  handleSelectChange(e: MatSelectChange) {
    this.size = e.value
    localStorage.setItem('imageSize', JSON.stringify(this.size))
  }

  constructor(
    private _snackbar: MatSnackBar
  ) { }

  get StickerSets() : StickerSet[] {
    if (!this.json) {
      return [];
    }

    let sets: StickerSet[] = [...this.json.sets];

    // find all the favorites by id from all sets and prepend them as its own set
    if (this.Favorites.length) {
      const favoriteStickers: any[] = [];
      for (const set of sets) {
        const stickers = set.stickers.filter(x => this.Favorites.includes(x.id));
        if (stickers.length) {
          favoriteStickers.push.apply(favoriteStickers, stickers);
        }
      }

      if (favoriteStickers.length) {
        sets.unshift({
          name: 'Favorites',
          nsfw: false,
          stickers: favoriteStickers
        });
      }
    }

    return sets;
  }

  _favoritesCache: any;
  get Favorites() {
    if (!this._favoritesCache) {
      this._favoritesCache = JSON.parse(localStorage.getItem('favoriteStickers') || '[]');
    }

    return this._favoritesCache;
  }
  set Favorites(val) {
    localStorage.setItem('favoriteStickers', JSON.stringify(val));
    this._favoritesCache = val;
  }

  _hiddenCache: any;
  get Hidden() {
    if (!this._hiddenCache) {
      this._hiddenCache = JSON.parse(localStorage.getItem('hiddenStickers') || '[]');
    }
    return this._hiddenCache;
  }
  set Hidden(val) {
    localStorage.setItem('hiddenStickers', JSON.stringify(val));
    this._hiddenCache = val;
  }

  hide(id: string) {
    if(this.tempHidden.includes(id)) {
      this.tempHidden = this.tempHidden.filter((el: string) => el !== id)
      this.toggleBar()
      return
    }
    this.tempHidden.push(id);
    this.toggleBar()
  }

  saveHidden() {
    this.Hidden = [...this.Hidden, ...this.tempHidden];
    this.tempHidden = []
    this.toggleBar()
  }

  favorite(id: string) {
    this.Favorites = [...this.Favorites, id];
  }

  unFavorite(id: string) {
    this.Favorites = this.Favorites.filter((el: string) => el !== id);
  }

  unHide(id: string) {
    this.Hidden = this.Hidden.filter((el: string) => el !== id);
  }

  checkIfHidden(id: string) {
    return !this.Hidden.includes(id);
  }

  checkIfFavorite(id: string) {
    return !this.Favorites.includes(id);
  }

  toggleShowHidden(e: MatCheckboxChange) {
    this.hiddenShown = e.checked
  }

  toggleShowNsfw(e: MatCheckboxChange) {
    localStorage.setItem('nsfwToggle', JSON.stringify(e.checked))
    this.nsfwToggle = e.checked
  }

  toggleBar() {
    if(this.tempHidden.length === 0) {
      console.warn(this.tempHidden)
      this.unsavedBar = false
      return
    }
    this.unsavedBar = true
  }

  ngOnInit() {
    console.log('%c uwu', 'font-size: 4rem')
    this.nsfwToggle = JSON.parse(localStorage.getItem('nsfwToggle') || 'false')
    this.size = JSON.parse(localStorage.getItem('imageSize') || '0');
    this.getJson();
  }

  trackBySet(el: any): string {
    return el.name
  }


  openCopiedSnackbar() {
    this._snackbar.open('Sticker succesfully copied!', 'Dismiss', {
      duration: 2000,

    })
  }

  title = 'stickers';
}
