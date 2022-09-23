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

const stickers = [
  {
    name: 'ashserigala',
    data: [
      '001-f421f768d77746f8a7d50eb51af80fb8',
      '002-edeb1431e9ba41239718b30fd9ec5a74',
      '003-f5b04d9aed9d44e4b0df19c2612fa308',
      '004-f425e16764414ac3ac41e81482d1543b',
      '005-d7e925cfa31742bf85dba4ac9b11ddbb',
      '006-836281122c2e4596a7d79899367af973',
      '007-1c2082765a0842f8adcb475842c44005',
      '008-bf7accbaf1254129a16418b54c2d4f70',
      '009-d900c1f904de4dffbe40bd1ab759e83e',
      '010-be886672b85e448da18e60b1129d00b2',
      '011-de7d17f609a747eebe75365e53b21c51',
      '012-7a236c2673bc4f949c40b807a4d4fe91',
      '013-22683bfa8f044712924920de03ecd2d3',
      '014-884e15344f8e409b94024ce60da5f5b1',
      '015-605976f6f93f46ceaf5052820b2a2a41',
      '016-9d9ac368df204550b175e005fd8fb108',
      '017-85922600125b4fe68ee1e6836f197154',
      '018-c4d37c2aa9d842ca9a0e72c5d5b474ca',
      '019-28f80e10ec594958baf77a60334863d7',
      '020-0994f15f34d54b5181c682430f5f6b7e',
      '021-ccb079cc71cc4ddc861d877e9d0a8834',
      '022-8c257e21bfeb42a4905d0c2230e7a9f7',
      '023-766c3423de874befa9c8da73c47459c7',
      '024-017634262d9b4775a958dc79a17321ba',
      '025-0e710d87868f4ec7b55ad8a98d303a67',
      '026-e2db4ff2407b4756aaf0d3fef0472410',
      '027-e581c0947c4e4aa1a02651b2b92d2e45',
      '028-a9dd6b2275964bc59f3bb45133865d29',
      '029-42856b952fd746699dd5ec4a52c4e294',
      '030-2e49e5e998884d77b737e01ae1c1fb82',
      '031-5d00a048bb6d4e099c846d93684e6270',
      '032-6d9a16899d92477181b61e3bcee36c5e',
      '033-6006804f52db4c94b0094e118c5a6fcd',
      '034-c389f5383bd94875b013ed5ee57dca56',
      '035-4e2e1a53ea2447a8a1232d97cd83018e',
      '036-7e58fb9913704b84bd40234757e214dd',
      '037-1e2254098cf54858820bf40c90f89ffd',
      '038-09724601b6134ac09d13f6004f84caec',
      '039-ce175c4f6b9b44adb32ee3942aa08dbe',
      '040-7c2e7b1046874dad8e40cd52dc3782dc',
      '041-1705cb3db7244d65a07cfde7c27681e6',
      '042-a360de78f80641dcbe2d551155c929d5',
      '043-ac0540c1685c4579ada8e49aaba9fe40',
      '044-7b8941d585774d729cf13b8e0d3e5f6a',
      '045-be3c30d891004f43b0ee2767f71b1c7e',
      '046-236a5514badf4624afe2a3b79b55d589',
      '047-bee43d11e7d44e418122135a1cd278cf',
      '048-479cd6bc06654449a6908ad06ddf37bb',
      '049-4b48d93f63324d5786ce2808f8251a9f',
      '050-9879837ef54f486fb246d13f83fa26d9',
      '051-42ec4b3bda144c0ba8c78f2cb8016a36',
      '052-d0ff1e1d9d124183b2b3c3ab40c3472b',
      '053-5d6fa02f471c4c5c9a31364b0898f917',
      '054-63fa48fa2d86402f8323305838bef4bf',
      '055-47757c12805a482eaf55264065b9f0a2',
      '056-d1043cd8891245dfa67ced519e4debbd',
      '057-50645bb3222943a5a93dc68d1fbe687f',
    ],
    nsfw: false,
  },
  {
    name: 'asrieltheavali',
    data: [
      '01-d3dee422f86c454f8b2b10835aafaf82',
      '02-4e05886b02d645a4bd7573d6269d1301',
      '03-13fa40d171f2408d91389b62dfb7b2ce',
      '04-a5fb18164b454a24b242e4dd4317efac',
      '05-eca48e41408b4559a4815fe2e767cd1f',
      '06-6f2e61a9f9f14da5a7b1949bc07ef461',
      '07-6c9328de3bad4efe8977a914eb3bf2d9',
      '08-aea79bb8af9f4d3c8e445130c5369278',
      '09-57dace59f4e04c2ebbabad0b3aaee9c2',
      '10-d9c2a4fe9a1c4bebab8d25af5f75d090',
      '11-30edc77d1c4741dfbd50b3a016a0033a',
      '12-90bb2172e6e14624b658cb73a7a6e3a0',
      '13-73c0bcdcfc3a4669a93835f4f7c4eac4',
      '14-cf08b9493b9b4d82927de567b8a8f45d',
      '15-ff15223f5cc9422786879f251f17fb11',
      '16-950bb85aa01745e8aacb5e36c342bd84',
      '17-df0d6163a17d484fb3dd3a8d3d6e4852',
      '18-5145b1f471984cb2bede6e486191dca1',
      '19-a6783c6b69e14a6bb0faca79927cd875',
      '20-5b1f3e6090414669b04d0ea2de292e7f',
      '21-8c47ea283b8640029628f789e1a9e5c6',
      '22-f074c356db254d20a337e13d9292cd1c',
      '23-a20cb94d48464852a4259b9c48aedfb5',
      '24-677b4efac3cc4b3d8a7cbbb322340a8f',
    ],
    nsfw: true,
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
    this.json = await fetch('/assets/stickers.json').then(resp => resp.json())
  }

  handleSelectChange(e: MatSelectChange) {
    this.size = e.value
    localStorage.setItem('imageSize', JSON.parse(this.size))
  }

  constructor() {
    this.getJson();
  }

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
        `https://stickers.farfelu.eu/${name}/${image}.png`
      );
    }
    return !this.Hidden.includes(url || '');
  }

  checkIfFavorite(name?: string, image?: string, url?: string) {
    if (name) {
      return !this.Favorite.includes(
        `https://stickers.farfelu.eu/${name}/${image}.png`
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
    this.nsfwToggle = JSON.parse(localStorage.getItem('nsfwToggle') || '')
    this.size = localStorage.getItem('imageSize') || ''
    
  }

  trackBySet(el: any): string {
    return el.name
  }

  trackBySticker(el: string): string {
    return el
  }

  title = 'stickers';
}
