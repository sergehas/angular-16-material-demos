import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  input
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable } from "@angular/material/sort";
import { BehaviorSubject, tap } from "rxjs";
import { PageableDataSource } from "src/app/core/models/pageable-data-source";
import { Value } from "src/app/core/value-list/models/value";
import { ValuesService } from "src/app/core/value-list/services/values.service";
import { AsyncPipe } from "@angular/common";
import { MatButton, MatMiniFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatLabel, MatFormField, MatHint } from "@angular/material/form-field";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatInput } from "@angular/material/input";
import { IconSelectComponent } from "../../../shared/components/icon-select/icon-select.component";

@Component({
  selector: "app-values",
  templateUrl: "./values.component.html",
  styleUrls: ["./values.component.scss"],
  imports: [MatButton, MatIcon, MatLabel, MatMiniFabButton, MatPaginator, AsyncPipe],
})
export class ValuesComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly service = inject(ValuesService);
  private readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly group = input<string>();

  dataSource!: PageableDataSource<Value>;
  private readonly _page = new BehaviorSubject<Value[]>([]);

  get page(): BehaviorSubject<Value[]> {
    return this._page;
  }

  constructor() {
    this.dataSource = new PageableDataSource<Value>(this.service);
  }

  ngOnInit(): void {
    //just for debug
    this.dataSource.loading$
      .pipe(tap((b) => console.info(`loading ${this.group()}: ${b}`)))
      .subscribe();
    this.dataSource.counting$
      .pipe(tap((b) => console.info(`counting ${this.group()}: ${b}`)))
      .subscribe();
  }

  ngAfterViewInit(): void {
    console.log("set pager");
    this.dataSource.filter = { group: this.group()! };
    this.dataSource.sort = new MatSort();
    this.dataSource.paginator = this.paginator;
    //sorting fires event, which is fireing page loading
    this.dataSource.sort?.sort({ id: "name", start: "asc" } as MatSortable);
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
          entity: { group: this.group(), label: "" } as Value,
        },
      });
    }
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed with:", result);
      if (result !== undefined) {
        this.service.save(result).subscribe((v) => {
          console.info(`after save: ${JSON.stringify(v, null, 2)}`);
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
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    IconSelectComponent,
    MatHint,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class ValueEditDialog {
  dialogRef = inject<MatDialogRef<ValueEditDialog>>(MatDialogRef);
  data = inject<{
    mode: EditMode;
    entity: Value;
  }>(MAT_DIALOG_DATA);

  private readonly _fb = inject(FormBuilder);
  valueForm: FormGroup;

  constructor() {
    const data = this.data;

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
      group: [{ value: data.entity.group, disabled: true }, Validators.required],
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
