import { TrackedEntity } from "../../models/tracked-entity";

export interface Value extends TrackedEntity {
	group: string;
	name: string;
	label: string;
	icon?: string;
}
