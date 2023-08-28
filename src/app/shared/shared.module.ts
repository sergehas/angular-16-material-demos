import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableExpandableRowsComponent } from './components/table-expandable-rows/table-expandable-rows.component';
import { InstanceofPipe } from './pipes/instanceof.pipe';
import { ColumnEditorComponent } from './components/column-editor/column-editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    TableExpandableRowsComponent,
    InstanceofPipe,
    ColumnEditorComponent
  ],
  imports: [
    CommonModule,
    DragDropModule
  ]
})
export class SharedModule { }
