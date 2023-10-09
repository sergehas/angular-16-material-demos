import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DragDropModule } from "@angular/cdk/drag-drop";
// import { IconTreeComponent } from "./components/icon-tree/icon-tree.component";
//import { IconSelectComponent } from './components/icon-select/icon-select.component';
//import { NotificationCenterComponent } from './components/notification-center/notification-center.component';
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
		// NotificationCenterComponent
		// IconSelectComponent
		// IconTreeComponent
	],
	imports: [CommonModule, DragDropModule],
})
export class SharedModule {}
