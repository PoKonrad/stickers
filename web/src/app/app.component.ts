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
  json: { name: string; data: string[]; nsfw: boolean }[] | undefined;

  hidden: any = '';
  hiddenShown: boolean = false;
  tempHidden: Array<string> = [];
  unsavedBar: boolean = false
  nsfwToggle: boolean = false
  size: string = '0'

  resolution = [
    {value: '0', text: 'Original'},
    {value: '256', text: '256x256px'},
    {value: '160', text: '160x160px'},
    {value: '64', text: '64x64px'},
    {value: '32', text: '32x32px'}
  ]

  async getJson() {
    this.json = await fetch('stickers.json').then(resp => resp.json())
  }

  handleSelectChange(e: MatSelectChange) {
    this.size = e.value
    localStorage.setItem('imageSize', JSON.parse(this.size))
  }

  constructor(
    private _snackbar: MatSnackBar
  ) { }

  get Hidden(): Array<any> {
    const a = JSON.parse(localStorage.getItem('hiddenStickers') || '[]');
    return a;
  }

  get Favorite() {
    const a = JSON.parse(localStorage.getItem('favoriteStickers') || '[]');
    return a;
  }

  hide(url: string) {
    if(this.tempHidden.includes(url)) {
      this.tempHidden = this.tempHidden.filter((el: string) => el !== url)
      this.toggleBar()
      return
    }
    this.tempHidden.push(url);
    this.toggleBar()
  }

  saveHidden() {
    const currentHidden = this.Hidden;
    localStorage.setItem(
      'hiddenStickers',
      JSON.stringify([...currentHidden, ...this.tempHidden])
    );
    this.tempHidden = []
    this.toggleBar()
  }

  favorite(url: string) {
    const currentFav = this.Favorite;
    localStorage.setItem(
      'favoriteStickers',
      JSON.stringify([...currentFav, url])
    );
  }

  unFavorite(url: string) {
    const currentFav = this.Favorite;
    localStorage.setItem(
      'favoriteStickers',
      JSON.stringify(currentFav.filter((el: string) => el !== url))
    );
  }

  unHide(url: string) {
    const currentHidden = this.Hidden;
    localStorage.setItem(
      'hiddenStickers',
      JSON.stringify(currentHidden.filter((el: string) => el !== url))
    );
  }

  checkIfHidden(name?: string, image?: string, url?: string) {
    if (name) {
      return !this.Hidden.includes(
        `/${name}/${image}.png`
      );
    }
    return !this.Hidden.includes(url || '');
  }

  checkIfFavorite(name?: string, image?: string, url?: string) {
    if (name) {
      return !this.Favorite.includes(
        `/${name}/${image}.png`
      );
    }
    return !this.Favorite.includes(url || '');
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
    this.size = localStorage.getItem('imageSize') || ''
    localStorage.setItem('imageSize', JSON.parse('0'))
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
