import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { ModalVeiculoComponent } from './modal-veiculo.component';
import { VeiculoService } from '../../services/veiculo.service';
import { Veiculo } from '../../models/veiculo.model';

describe('ModalVeiculoComponent', () => {
  let component: ModalVeiculoComponent;
  let fixture: ComponentFixture<ModalVeiculoComponent>;
  let veiculoServiceSpy: jasmine.SpyObj<VeiculoService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ModalVeiculoComponent>>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockVeiculo: Veiculo = {
    id: 1,
    placa: 'ABC1234',
    chassi: '9BWZZZ377VT004251',
    renavam: '12345678901',
    modelo: 'Civic',
    marca: 'Honda',
    ano: 2020
  };

  const setupTestModuleForCreate = async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModalVeiculoComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: VeiculoService, useValue: veiculoServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { veiculo: undefined } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalVeiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const setupTestModuleForEdit = async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModalVeiculoComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: VeiculoService, useValue: veiculoServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { veiculo: mockVeiculo } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalVeiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(() => {
    veiculoServiceSpy = jasmine.createSpyObj('VeiculoService', ['addVeiculo', 'updateVeiculo']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
  });

  describe('Modo Criação', () => {
    beforeEach(async () => {
      await setupTestModuleForCreate();
    });

    it('deve criar o componente para cadastrar veículo', () => {
      expect(component).toBeTruthy();
      expect(component.isEdit).toBeFalse();
      expect(component.titulo).toBe('Novo Veículo');
    });

    it('deve adicionar um novo veiculo', fakeAsync(() => {
      veiculoServiceSpy.addVeiculo.and.returnValue(of(mockVeiculo));
      spyOn(component, 'openSnackBar');

      component.form.setValue({
        placa: 'ABC1234',
        chassi: '9BWZZZ377VT004251',
        renavam: '12345678901',
        modelo: 'Civic',
        marca: 'Honda',
        ano: 2020
      });
      component.createVeiculoHandler(component.form.value);

      tick();

      expect(veiculoServiceSpy.addVeiculo).toHaveBeenCalled();
      expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    }));

    it('deve dar erro ao enviar dados inválidos', () => {
      component.onSubmit();

      expect(veiculoServiceSpy.addVeiculo).not.toHaveBeenCalled();
    });
  });

  describe('Modo Edição', () => {
    beforeEach(async () => {
      await setupTestModuleForEdit();
    });

    it('deve criar o componente para editar veículo', () => {
      expect(component).toBeTruthy();
      expect(component.isEdit).toBeTrue();
      expect(component.titulo).toBe('Editar Veículo');
    });

    it('deve inicializar o formulário com os dados do veículo', () => {
      expect(component.form.get('placa')?.value).toBe(mockVeiculo.placa);
      expect(component.form.get('chassi')?.value).toBe(mockVeiculo.chassi);
      expect(component.form.get('renavam')?.value).toBe(mockVeiculo.renavam);
      expect(component.form.get('modelo')?.value).toBe(mockVeiculo.modelo);
      expect(component.form.get('marca')?.value).toBe(mockVeiculo.marca);
      expect(component.form.get('ano')?.value).toBe(mockVeiculo.ano);
    });

    it('deve atualizar um veiculo', fakeAsync(() => {
      // Resposta do mock que força a execução do tap
      veiculoServiceSpy.updateVeiculo.and.returnValue(of(mockVeiculo));

      // Mock adicional para o método openSnackBar para não depender dele
      spyOn(component, 'openSnackBar');

      const updatedVeiculo = {
        ...mockVeiculo,
        modelo: 'Civic Touring',
        ano: 2021
      };

      component.form.patchValue({
        modelo: updatedVeiculo.modelo,
        ano: updatedVeiculo.ano
      });

      // Chamar diretamente o método que contém a lógica em vez de onSubmit
      component.updateVeiculoHandler({
        ...component.form.value,
        id: mockVeiculo.id
      });

      // Para garantir que todos os microtasks assíncronos sejam processados
      tick();

      expect(veiculoServiceSpy.updateVeiculo).toHaveBeenCalledWith({
        ...updatedVeiculo,
        id: mockVeiculo.id
      });
      expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    }));
  });
});
