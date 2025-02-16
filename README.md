# Angular16MaterialStarter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.x.

## Code scaffolding

bookmarks:

- <https://www.tektutorialshub.com/angular/angular-folder-structure-best-practices/>
- <https://stackblitz.com/github/janders/angular-tab-router-with-children>
- <https://m3.material.io/develop/web>
- <https://blog.angular-university.io/angular-material-data-table/>
- <https://www.vitamindev.com/angular/how-to-initialize-a-service-on-startup/>
- <http://www.prideparrot.com/blog/archive/2019/3/how_to_create_custom_dropdown_cdk>
- <https://stackblitz.com/edit/custom-mat-form-field-control?file=app%2Fcustom-input%2Fabstract-mat-form-field.ts>
- [country codes ISO 3166](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)
- [Language codes ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

### Basics

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

---

### Feature modules

A Feature module contains a set of consistent business GUI (so NOT services). A feature module is assigned to a consistent business processes (i.e. 'order' (for order management), 'bill', 'catalog', .. even 'admin').

The main/default page of a feature module could be a dashboard (i.e. : counter per order status) or redirecting to the main page of the business process (place an order). A feature module contain its own / feature wide routing module.

A feature module should not depend on a another feature module.

#### initializing

add a `demo` module with its routing: `ng generate module demo --routing`
add a main feature page to `demo`: `ng generate component demo/pages/demo -m demo --flat --standalone false`

then add to `demo-routing.module.ts`

```typescript
const routes: Routes = [{ path: "demo", component: DemoComponent }];
```

then import this module in `app.module.ts`:

```typescript
@NgModule({
 declarations: [AppComponent],
 imports: [
    //...
  DemoModule,
 ],
 providers: [],
 bootstrap: [AppComponent],
})
```

#### add (sub) pages

add a sub page to `demo` feature : `ng generate component demo/pages/demo-table --standalone false -m demo`

then add to `demo-routing.module.ts`

```typescript
const routes: Routes = [
  {
    path: "demo",
    component: DemoComponent,
    children: [
      // list "sub" pages from this demo feature components
      { path: "demo-table", component: DemoTableComponent, data: { animation: "slideRight" } },
    ],
  },
];
```

> `data` attribute is used to config. transition while changing route

... and to `demo` feature page: `demo.component.html`

```html
<ul>
  <li><a routerLink="demo-table">Table demo</a></li>
</ul>
<router-outlet></router-outlet>
```

Alternatively, you could use a navigation by tabs in `demo.component.html`

```html
<app-tabs-nav path="demo"></app-tabs-nav>
```

...where `path` ith the path (route) of the 'demo' module

---

### Shared components

Share component are components & modules should **not** have any dependency on any of the other modules in the application.

The shared module must declare the components, pipes, and directives using the declarations metadata and export it using the exports metadata

Other Modules can import the shared modules and use the exported components, directives & pipes

The Services must not be defined here. Since the shared modules are imported everywhere, it may create a new instance of the service if it is imported in the lazy loaded modules.

Tips: The commonly required angular modules like ( CommonModule, FormsModule, etc) or third party modules can be imported here and re-exported. The other module importing the shared module does not have to import those modules.

### add new shared module (if not exist) [not recommended]

If you don't plan to use **recommended standalone components**,
add a `shared` module : `ng generate module shared`

### add new shared component

add a component in `shared` folder/module : `ng generate component shared/components/table-expandable-rows -m shared`

or (for standalone component **recommended**)

add a component in `shared` folder : `ng generate component shared/components/table-expandable-rows --standalone --view-encapsulation None`

---

### Core module

This module contain all singletons, and so, **all services**.

As services (& associated models) could be related to feature module ( i.e. `OrderService`, `OrderPlacementService`...) it should be organized in sub folders / modules (reflecting the feature modules organization)

#### initializing core

- add a `github` module: `ng generate module core/github`
- add a service to `github`: `ng generate service core/github/services/github`

  - then, add it to module:

    ```typescript
    @NgModule({
    declarations: [],
    imports: [
      CommonModule
    ],
    providers: [
      GithubService
    ],
    })
    ```

- add a model to `github`: `ng generate interface core/github/models/issue`
- add a datasource for issues to `github`: `ng generate class core/github/models/IssuesDataSource`

---

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## links

- rail menu <https://stackblitz.com/edit/angular-side-nav-icon?file=src%2Fapp%2Fside-nav%2Fside-nav.component.html>
- filterable column <https://www.freakyjolly.com/angular-material-table-custom-filter-using-select-box/>, <https://github.com/malbarmavi/mat-table-column-filter>
- various demos <https://github.com/railsstudent/ng-rxjs-30/tree/main/projects>
- material icons <https://fonts.google.com/icons?selected=Material+Symbols+Outlined:assistant_direction:FILL>
