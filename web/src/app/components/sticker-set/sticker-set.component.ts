import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { StickerSetsService } from 'src/app/services/sticker-sets.service';

@Component({
  selector: 'app-sticker-set',
  templateUrl: './sticker-set.component.html',
  styleUrls: ['./sticker-set.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('rotateIcon', [
      state(
        'expanded',
        style({
          transform: 'rotate(-180deg)',
        })
      ),
      state(
        'collapsed',
        style({
          transform: 'rotate(0deg)',
        })
      ),

      transition('expanded => collapsed', [animate('0.1s ease')]),
      transition('collapsed => expanded', [animate('0.1s ease')]),
    ]),
    trigger('expandContent', [
      state(
        'expanded',
        style({
          opacity: 1,
        })
      ),
      state(
        'collapsed',
        style({
          opacity: 0,
          display: 'none',
        })
      ),
      state(
        'hide',
        style({
          display: 'none',
        })
      ),
      state(
        'show',
        style({
          display: 'block',
        })
      ),

      transition('expanded => collapsed', [animate('0.1s ease')]),
      transition('collapsed => expanded', [animate('0.1s ease')]),
    ]),
    trigger('hide', [
      state(
        'shown',
        style({

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
export class StickerSetComponent implements OnInit {
  @Input() stickerSetName: string = '';
  @Input() isNsfw: boolean = false;
  nsfwToggle: boolean = false;
  nsfwToggleSub: any

  get Collapsed(): Array<string> {
    return JSON.parse(localStorage.getItem('collapsed') || '[]');
  }

  constructor(
    private stickerSetsService: StickerSetsService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.Collapsed.includes(this.stickerSetName)) {
      this.stickerSetCollapsed = true;
    }
    this.nsfwToggleSub = this.stickerSetsService.nsfwToggle.subscribe((value) => {
      this.nsfwToggle = value;
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy() {
    this.nsfwToggleSub.unsubscribe()
  }

  stickerSetCollapsed = false;
  contentHidden = false;

  toggleCollapsed() {
    this.stickerSetCollapsed = !this.stickerSetCollapsed;
    if (this.stickerSetCollapsed) {
      localStorage.setItem(
        'collapsed',
        JSON.stringify([...this.Collapsed, this.stickerSetName])
      );
    } else {
      localStorage.setItem(
        'collapsed',
        JSON.stringify(
          this.Collapsed.filter((el: string) => el !== this.stickerSetName)
        )
      );
    }
    setTimeout(() => {
      this.contentHidden = !this.contentHidden;
    }, 300);
  }
}
