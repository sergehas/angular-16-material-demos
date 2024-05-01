import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { anyRoleGuard } from "../shared/guards/any-role.guard";
import { ArtInstituteComponent } from "./pages/art-institute.component";

const routes: Routes = [
	{
		path: "art-institute",
		component: ArtInstituteComponent,
		canActivate: [anyRoleGuard],
		data: {
			animation: "slideLeft",
			roles: ["ADMIN", "VIEWER"]
		},
		children: [],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ArtInstituteRoutingModule { }
