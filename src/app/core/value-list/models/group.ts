import { TrackedEntity } from "../../models/tracked-entity";

export interface Group extends TrackedEntity {
	name: string;
	label: string;
}
