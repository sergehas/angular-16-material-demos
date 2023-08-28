import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DragDropModule } from "@angular/cdk/drag-drop";
// import { InstanceofPipe } from "./pipes/instanceof.pipe";
// import { TableExpandableRowsComponent } from "./components/table-expandable-rows/table-expandable-rows.component";
// import { TableConfigEditorComponent } from "./components/table-config-editor/table-config-editor.component";
// import { TabsNavComponent } from "./components/tabs-nav/tabs-nav.component";

@NgModule({
	declarations: [
		// TableExpandableRowsComponent,
		// InstanceofPipe,
		// TableConfigEditorComponent,
		// TabsNavComponent,
	],
	imports: [CommonModule, DragDropModule],
})
export class SharedModule {}
