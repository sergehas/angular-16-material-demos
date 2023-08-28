import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableExpandableRowsComponent } from './components/table-expandable-rows/table-expandable-rows.component';
import { InstanceofPipe } from './pipes/instanceof.pipe';
import { ColumnEditorComponent } from './components/column-editor/column-editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TabsNavComponent } from './components/tabs-nav/tabs-nav.component';



@NgModule({
  declarations: [
    TableExpandableRowsComponent,
    InstanceofPipe,
    ColumnEditorComponent,
    TabsNavComponent
  ],
  imports: [
    CommonModule,
    DragDropModule
  ]
})
export class SharedModule { }
