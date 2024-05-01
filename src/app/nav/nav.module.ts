import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsNavComponent } from '../shared/components/tabs-nav/tabs-nav.component';
import { NavRoutingModule } from './nav-routing.module';
import { NavComponent } from './pages/nav.component';
import { VoidNavComponent } from './pages/void-nav/void-nav.component';


@NgModule({
  declarations: [
    NavComponent,
    VoidNavComponent
  ],
  imports: [
    CommonModule,

    TabsNavComponent,
    NavRoutingModule,
  ]
})
export class NavModule { }
