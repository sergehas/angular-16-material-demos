
export enum STAGE {
    PENDING,
    PROGRESS,
    PAUSE,
    SUCCESS,
    PARTIAL,
    ERROR
}


class Position {

    private _total;
    private _value;

    constructor(total: number = -1, value: number = -1) {
        this._total = total;
        this._value = value;

    }
    set value(v: number) {
        this._value = v;
        if (this._total < this._value) {
            this._total = this._value;
        }
    }
    get value(): number {
        return this._value;
    }

    set total(t: number) {
        this._total = t;
        if (this._total < this._value) {
            this._value = this._total;
        }
    }
    get total(): number {
        return this._total;
    }
}

export class Progress {
    stage: STAGE = STAGE.PENDING;
    position: Position = new Position();
}
