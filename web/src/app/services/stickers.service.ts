import { Injectable } from '@angular/core';
import type { MatCheckboxChange } from '@angular/material/checkbox';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StickersService {

  constructor() { }


  private _hiddenCache: any
  hidden: any = '';
  hiddenShown = new BehaviorSubject(false)
  tempHidden: Array<string> = [];
  unsavedBar: boolean = false;
  nsfwToggle: boolean = false;
  size: number = 0;
  resolution: any[] = [];
  _favoritesCache: any;
  hiddenChanged = new BehaviorSubject(false)
  previewSize: string = '160'

  get Hidden() {
    if (!this._hiddenCache) {
      this._hiddenCache = JSON.parse(
        localStorage.getItem('hiddenStickers') || '[]'
      );
    }
    return this._hiddenCache;
  }

  set Hidden(val) {
    localStorage.setItem('hiddenStickers', JSON.stringify(val));
    this._hiddenCache = val;
    this.hiddenChanged.next(!this.hiddenChanged)
  }

  get Favorites() {
    if (!this._favoritesCache) {
      this._favoritesCache = JSON.parse(
        localStorage.getItem('favoriteStickers') || '[]'
      );
    }

    return this._favoritesCache;
  }
  set Favorites(val) {
    localStorage.setItem('favoriteStickers', JSON.stringify(val));
    this._favoritesCache = val;
  }

  favorite(id: string) {
    this.Favorites = [...this.Favorites, id];
  }

  unFavorite(id: string) {
    this.Favorites = this.Favorites.filter((el: string) => el !== id);
  }

  unHide(id: string) {
    this.Hidden = this.Hidden.filter((el: string) => el !== id);
    this.toggleBar();
  }

  unHideTemp(id: string) {
    this.tempHidden = this.tempHidden.filter((el: string) => el !== id);
    this.toggleBar();
  }

  hideTemp(id: string) {
    console.log(id)
    this.tempHidden = [...this.tempHidden, id];
    this.toggleBar();
  }

  checkIfHidden(id: string) {
    return !this.Hidden.includes(id);
  }

  checkIfTempHidden(id: string) {
    return !this.tempHidden.includes(id);
  }

  checkIfFavorite(id: string) {
    return !this.Favorites.includes(id);
  }

  toggleShowHidden(e: MatCheckboxChange) {
    this.hiddenShown.next(e.checked)
  }

  toggleShowNsfw(e: MatCheckboxChange) {
    localStorage.setItem('nsfwToggle', JSON.stringify(e.checked));
    this.nsfwToggle = e.checked;
    this.unsavedBar = true
  }

  hide(id: string) {
    if (this.tempHidden.includes(id)) {
      this.tempHidden = this.tempHidden.filter((el: string) => el !== id);
      this.tempHidden = []
      this.toggleBar();
      return;
    }
    this.tempHidden.push(id);
    this.toggleBar();
  }

  saveHidden() {
    this.Hidden = [...this.Hidden, ...this.tempHidden];
    this.tempHidden = [];
    this.toggleBar();
  }

  private toggleBar() {
    console.warn(this.tempHidden);
    if (this.tempHidden.length === 0) {
      this.unsavedBar = false;
      return;
    }
    this.unsavedBar = true;
  }

}
