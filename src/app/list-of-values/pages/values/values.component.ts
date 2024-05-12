import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable } from "@angular/material/sort";
import { Subject, tap } from "rxjs";
import { PageableDataSource } from "src/app/core/models/pageable-data-source";
import { Value } from "src/app/core/value-list/models/value";
import { ValuesService } from "src/app/core/value-list/services/values.service";

@Component({
  selector: "app-values",
  templateUrl: "./values.component.html",
  styleUrls: ["./values.component.scss"],
})
export class ValuesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort!: MatSort | undefined;
  @Input() group?: string;

  dataSource!: PageableDataSource<Value>;
  private _page = new Subject<Value[]>();

  get page(): Subject<Value[]> {
    return this._page;
  }

  constructor(
    private service: ValuesService,
    private dialog: MatDialog
  ) {
    this.dataSource = new PageableDataSource<Value>(this.service);
  }

  ngOnInit(): void {
    //just for debug
    this.dataSource.loading$
      .pipe(tap((b) => console.info(`loading: ${b}`)))
      .subscribe();
    this.dataSource.counting$
      .pipe(tap((b) => console.info(`counting: ${b}`)))
      .subscribe();
  }

  ngAfterViewInit() {
    this.dataSource.filter = { group: this.group! };
    this.dataSource.sort = new MatSort();
    //this.dataSource.sort = new MatSort();
    console.log("set pager");
    this.dataSource.paginator = this.paginator;
    //sorting fires event, which is fireing page loading
    this.dataSource.sort.sort({ id: "name", start: "asc" } as MatSortable);
    this.dataSource.connect().subscribe((data) => {
      //as data is readonly, we must clone it to be able to set _page
      this._page.next(data.map((i) => i));
    });
  }

  ngOnDestroy(): void {
    this.dataSource.disconnect();
  }

  createOrEdit(entity?: Value) {
    let dialogRef!: MatDialogRef<ValueEditDialog, Value>;
    if (entity !== undefined) {
      dialogRef = this.dialog.open(ValueEditDialog, {
        data: {
          mode: EditMode.EDIT,
          entity: entity,
        },
      });
    } else {
      dialogRef = this.dialog.open(ValueEditDialog, {
        data: {
          mode: EditMode.CREATE,
          entity: { group: this.group, label: "" } as Value,
        },
      });
    }
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed with:", result);
      if (result !== undefined) {
        this.service.save(result).subscribe((v) => {
          console.info(`after save: ${v}`);
          console.log("refreshing");
          this.dataSource.count();
          this.dataSource.loadPage();
        });
      }
    });
  }
}

export enum EditMode {
  CREATE,
  EDIT,
}

@Component({
  selector: "app-value-edit-dialog",
  templateUrl: "value-edit.dialog.html",
  styleUrls: ["./value-edit.dialog.scss"],
})
export class ValueEditDialog {
  private _fb = inject(FormBuilder);
  valueForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ValueEditDialog>,

    @Inject(MAT_DIALOG_DATA) public data: { mode: EditMode; entity: Value }
  ) {
    console.log("ent", data.entity);
    this.valueForm = this._fb.group({
      name: [
        data.entity.name,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
        ]),
      ],
      label: [
        data.entity.label,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ]),
      ],
      icon: [data.entity.icon],
      group: [
        { value: data.entity.group, disabled: true },
        Validators.required,
      ],
    });

    if (data.mode === EditMode.EDIT) {
      this.valueForm.get("name")?.disable();
    }
  }

  save() {
    this.dialogRef.close(this.valueForm.getRawValue());
  }

  delete() {
    alert("TODO");
  }
}
