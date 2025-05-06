import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVeiculoComponent } from './modal-veiculo.component';

describe('ModalVeiculoComponent', () => {
  let component: ModalVeiculoComponent;
  let fixture: ComponentFixture<ModalVeiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVeiculoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVeiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
