import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCategoriaComponent } from './item-categoria.component';

describe('ItemCategoriaComponent', () => {
  let component: ItemCategoriaComponent;
  let fixture: ComponentFixture<ItemCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemCategoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
