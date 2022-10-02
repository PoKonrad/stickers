import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { StickersService } from 'src/app/services/stickers.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sticker',
  templateUrl: './sticker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MatSnackBar],
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
  @Input() sticker!: Sticker;
  @Input() size: number = 0;

  isFavorite: boolean = false;
  isHidden: boolean = false;
  isShown = true;
  hiddenShown = false
  hiddenShownSub: any
  hiddenChangedSub: any
  
  constructor(
    public stickersService: StickersService,
    private readonly cdRef: ChangeDetectorRef,
    private _snackbar: MatSnackBar,
    ) {}

  hideImage(isHidden: boolean) {
    this.isShown = !isHidden;
  }

  ngOnInit(): void {
    this.isHidden = this.stickersService.checkIfHidden(this.sticker.id);
    this.isShown = !!this.isHidden
    this.isFavorite = this.stickersService.checkIfFavorite(this.sticker.id);
    this.hiddenShownSub = this.stickersService.hiddenShown.subscribe((e) => {
      this.hiddenShown = e
      this.cdRef.detectChanges()
    })
    this.hiddenChangedSub = this.stickersService.hiddenChanged.subscribe((e) => {
      this.isHidden = this.stickersService.checkIfHidden(this.sticker.id);
      this.isShown = !!this.isHidden
      this.cdRef.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.hiddenChangedSub.unsubscribe()
    this.hiddenChangedSub.unsubscribe()
  }

  favoriteClick() {
    if (!this.isFavorite) {
      this.stickersService.unFavorite(this.sticker.id);
    } else {
      this.stickersService.favorite(this.sticker.id);
    }
    this.isFavorite = !!this.stickersService.checkIfFavorite(this.sticker.id);
    this.cdRef.detectChanges()
  }

  hideClick() {
    if(!this.isHidden) {
      this.stickersService.unHide(this.sticker.id)
      this.isHidden = true
      this.hideImage(false)
      return
    }

    if (!this.stickersService.checkIfTempHidden(this.sticker.id)) {
      this.hideImage(false);
        this.stickersService.unHideTemp(this.sticker.id);
    } else {
      this.hideImage(true);
        this.stickersService.hideTemp(this.sticker.id);
    }
  }

  preventDefaults(e: any) {
    e.preventDefaults();
  }

  async copyToClipboard() {
    const url = new URL(
      `stickers/${this.sticker.set}/${this.sticker.name}${
        this.size ? `.s${this.size}` : ''
      }.${this.sticker.type}`,
      window.location.href
    ).href;
    navigator.clipboard.writeText(url);
    this.openCopiedSnackbar()
  }

  openCopiedSnackbar() {
    this._snackbar.open('Sticker succesfully copied!', 'Dismiss', {
      duration: 2000,
    });
  }
}
