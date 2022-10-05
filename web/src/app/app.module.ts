import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select'; 
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppComponent } from './app.component';
import { StickerComponent } from './components/sticker/sticker.component';
import { StickerSetComponent } from './components/sticker-set/sticker-set.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SetSetNamePipe } from './pipes/set-set-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    StickerComponent,
    StickerSetComponent,
    SetSetNamePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    ScrollingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
