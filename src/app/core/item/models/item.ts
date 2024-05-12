import { FilterValue } from "../../services/http-service";

export interface Item extends Record<string, FilterValue> { }
