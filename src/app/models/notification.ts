import { v4 as uuid } from 'uuid';
import { Progress, STAGE } from './progress';

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
    readonly severity: NotificationSeverity;
    message: string;
    readonly date: Date;
    readonly ref?: string;
    readonly persistent: boolean;
    readonly show: boolean;

    constructor(def: NotificationDef) {
        this.id = uuid();
        this.severity = def.severity;
        this.message = def.message;
        this.date = def.date ?? new Date();
        this.ref = def.ref;
        this.persistent = def.persistent === undefined ? true : def.persistent;
        this.show = def.show === undefined ? true : def.show;
    }
}

export class ProgressNotification extends Notification {

    readonly progress: Progress;

    constructor(def: NotificationDef) {
        super(def);
        this.progress = new Progress();
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
