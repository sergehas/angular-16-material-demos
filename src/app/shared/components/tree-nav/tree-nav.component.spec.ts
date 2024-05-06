import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeNavComponent } from './tree-nav.component';

describe('TreeNavComponent', () => {
  let component: TreeNavComponent;
  let fixture: ComponentFixture<TreeNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreeNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
