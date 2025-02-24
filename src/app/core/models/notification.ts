import { v4 as uuid } from "uuid";
import { Progress, STAGE } from "./progress";

export type NotificationSeverity = "info" | "warn" | "sever";
export interface NotificationDef {
  severity: NotificationSeverity;
  message: string;
  date?: Date;
  ref?: string;
  persistent?: boolean;
  show?: boolean;
}

export class Notification implements NotificationDef {
  readonly id: string;
  protected _severity: NotificationSeverity;
  message: string;
  readonly date: Date;
  readonly ref?: string;
  readonly persistent: boolean;
  readonly show: boolean;

  constructor(def: NotificationDef) {
    this.id = uuid();
    this._severity = def.severity;
    this.message = def.message;
    this.date = def.date ?? new Date();
    this.ref = def.ref;
    this.persistent = def.persistent ?? true;
    this.show = def.show ?? true;
  }

  get severity(): NotificationSeverity {
    return this._severity;
  }
}

export class ProgressNotification extends Notification {
  readonly progress: Progress;

  constructor(def: NotificationDef) {
    super(def);
    this.progress = new Progress();
  }

  override set severity(s: NotificationSeverity) {
    this._severity = s;
  }
  override get severity(): NotificationSeverity {
    return this._severity;
  }
  setProgress(value: number, total?: number, stage?: STAGE): void {
    this.progress.position.value = value;
    if (total !== undefined) {
      this.progress.position.total = total;
    }
    if (stage !== undefined) {
      this.progress.stage = stage;
    }
  }
}
