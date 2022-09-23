import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sticker',
  templateUrl: './sticker.component.html',
  styleUrls: ['./sticker.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'closed',
        style({
          opacity: 0.1,
        })
      ),

      state('open', style({})),

      transition('open => closed', [animate('0.1s')]),
      transition('closed => open', [animate('0.1s')]),
    ]),

    trigger('hideText', [
      state(
        'shown',
        style({
          visibility: 'visible',
        })
      ),

      state(
        'hidden',
        style({
          visibility: 'hidden',
        })
      ),

      transition('shown => hidden', [animate('0.1s')]),
      transition('hidden => shown', [animate('0.1s')]),
    ]),
  ],
})
export class StickerComponent implements OnInit {
  @Input() url: string = '';
  @Input() isFavorite: boolean = false;
  @Input() isHidden: boolean = false;
  @Input() size: string = '0';

  @Output() Favorite = new EventEmitter<string>();
  @Output() UnFavorite = new EventEmitter<string>();
  @Output() Hide = new EventEmitter<string>();
  @Output() UnHide = new EventEmitter<string>();

  isShown = true;

  hideImage() {
    this.isShown = !this.isShown;
  }

  ngOnInit(): void {
    this.isShown = this.isHidden;
  }

  ngOnDestroy(): void {}

  favoriteClick(url: string) {
    if (!this.isFavorite) {
      this.UnFavorite.emit(url);
    } else {
      this.Favorite.emit(url);
    }
  }

  hideClick(url: string) {
    if (!this.isHidden) {
      this.hideImage();
      setTimeout(() => {
        this.UnHide.emit(url);
      }, 500);
    } else {
      this.hideImage();
      setTimeout(() => {
        this.Hide.emit(url);
      }, 500);
    }
  }

  async copyToClipboard(text: string) {
    if (this.size === '0') {
      navigator.clipboard.writeText(text);
      return
    }
    navigator.clipboard.writeText(`${text.slice(0, -4)}_${this.size}.png`);
  }
}
