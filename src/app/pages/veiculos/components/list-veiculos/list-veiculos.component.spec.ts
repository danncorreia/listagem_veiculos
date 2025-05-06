import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVeiculosComponent } from './list-veiculos.component';

describe('ListVeiculosComponent', () => {
  let component: ListVeiculosComponent;
  let fixture: ComponentFixture<ListVeiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListVeiculosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListVeiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
