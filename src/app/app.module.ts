import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
// particular imports for hammer 
import * as Hammer from 'hammerjs';
import {
  HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG
}
  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ImageDrawingModule } from 'ngx-image-drawing';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImagemapComponent } from './imagemap/imagemap.component';
import { InputsModule } from '@progress/kendo-angular-inputs';




// @Injectable()
// export class MyHammerConfig extends HammerGestureConfig {
//   overrides = <any>{
//     swipe: { direction: Hammer.DIRECTION_ALL },
//   };
// }
@NgModule({
  declarations: [
    AppComponent,
    ImagemapComponent
  ],
  imports: [
    BrowserModule,
    // HammerModule,
    AppRoutingModule,
    // ImageDrawingModule,
    DialogsModule,
    BrowserAnimationsModule,
    InputsModule
  ],
  providers: [
    // {
    //   // provide: HAMMER_GESTURE_CONFIG,
    //   // useClass: MyHammerConfig,
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
