import { Injectable } from '@angular/core';
import type { MatCheckboxChange } from '@angular/material/checkbox';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StickerSetsService {

  constructor() { }

  nsfwToggle = new BehaviorSubject(false)

  toggleNsfw(checkbox: MatCheckboxChange) {
    this.nsfwToggle.next(checkbox.checked)
  }

}
