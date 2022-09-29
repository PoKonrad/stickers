import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sticker-set',
  templateUrl: './sticker-set.component.html',
  styleUrls: ['./sticker-set.component.scss'],
  animations: [
    trigger('rotateIcon', [
      state('expanded', style({
        transform: 'rotate(-180deg)'
      })),
      state('collapsed', style({
        transform: 'rotate(0deg)'
      })),
      
      transition('expanded => collapsed', [animate('0.1s ease')]),
      transition('collapsed => expanded', [animate('0.1s ease')])
  ]),
    trigger('expandContent', [
      state('expanded', style({
        opacity: 1
      })),
      state('collapsed', style({
        opacity: 0,
        height: 0,
        visibility: 'hidden'
      })),
      state('hide', style({
        display: 'none'
      })),
      state('show', style({
        display: 'block'
      })),
      
      transition('expanded => collapsed', [animate('0.1s ease')]),
      transition('collapsed => expanded', [animate('0.1s ease')])
  ])
  ]
})
export class StickerSetComponent implements OnInit {

  @Input() stickerSetName: string = ''
  @Input() nsfwToggle: boolean = false
  @Input() isNsfw: boolean = false

  get Collapsed(): Array<string> {
    return JSON.parse(localStorage.getItem('collapsed') || "[]")
  }

  constructor() { }

  ngOnInit(): void {
    if(this.Collapsed.includes(this.stickerSetName)) {
      this.stickerSetCollapsed = true
    }
  }

  stickerSetCollapsed = false
  contentHidden = false

  toggleCollapsed() {
    this.stickerSetCollapsed = !this.stickerSetCollapsed
    if(this.stickerSetCollapsed) {
      localStorage.setItem('collapsed', JSON.stringify([...this.Collapsed, this.stickerSetName]))
    } else {
      localStorage.setItem('collapsed', JSON.stringify(this.Collapsed.filter((el: string) => el !== this.stickerSetName)))
    }
    setTimeout(() => {
      this.contentHidden = !this.contentHidden
    }, 300);
  }

}
