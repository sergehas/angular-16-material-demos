import { TrackedEntity } from "@app/core/commons/services/models/tracked-entity";

export interface Group extends TrackedEntity {
  name: string;
  label: string;
}
