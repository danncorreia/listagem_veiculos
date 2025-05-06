import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { ListVeiculosComponent } from './list-veiculos.component';
import { VeiculoService } from '../../services/veiculo.service';
import { Veiculo } from '../../models/veiculo.model';
import { ModalVeiculoComponent } from '../modal-veiculo/modal-veiculo.component';
import { ConfirmationDialogComponent } from '../../../../common/confirmation-dialog/confirmation-dialog.component';

describe('ListVeiculosComponent', () => {
  let component: ListVeiculosComponent;
  let fixture: ComponentFixture<ListVeiculosComponent>;
  let veiculoServiceSpy: jasmine.SpyObj<VeiculoService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockVeiculos = [
    {
      id: 1,
      placa: 'ABC1234',
      chassi: '9BWZZZ377VT004251',
      renavam: '12345678901',
      modelo: 'Civic',
      marca: 'Honda',
      ano: 2020
    },
    {
      id: 2,
      placa: 'DEF5678',
      chassi: '7DXPZ2311FT033466',
      renavam: '45678912301',
      modelo: 'Gol',
      marca: 'Volkswagen',
      ano: 2019
    }
  ] as Veiculo[];

  beforeEach(async () => {
    const veiculoSpy = jasmine.createSpyObj('VeiculoService', ['getVeiculos', 'deleteVeiculo']);
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    veiculoSpy.getVeiculos.and.returnValue(of({
      data: mockVeiculos,
      total: mockVeiculos.length
    }));

    await TestBed.configureTestingModule({
      imports: [
        ListVeiculosComponent,
        NoopAnimationsModule,
        MatPaginatorModule
      ],
      providers: [
        { provide: VeiculoService, useValue: veiculoSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListVeiculosComponent);
    component = fixture.componentInstance;
    veiculoServiceSpy = TestBed.inject(VeiculoService) as jasmine.SpyObj<VeiculoService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar veículos', () => {
    expect(veiculoServiceSpy.getVeiculos).toHaveBeenCalledWith(0, 5);
    expect(component.dataSource).toEqual(mockVeiculos);
    expect(component.totalItems).toBe(mockVeiculos.length);
  });

  it('deve abrir o modal para adicionar um novo veículo', () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpyObj.afterClosed.and.returnValue(of(true));
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    veiculoServiceSpy.getVeiculos.calls.reset();
    component.openModal();

    expect(dialogSpy.open).toHaveBeenCalledWith(ModalVeiculoComponent, { width: '600px', data: { veiculo: undefined } });
    expect(veiculoServiceSpy.getVeiculos).toHaveBeenCalled();
  });

  it('deve abrir o modal para editar um veículo existente', () => {
    const veiculo = mockVeiculos[0];
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpyObj.afterClosed.and.returnValue(of(true));
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    veiculoServiceSpy.getVeiculos.calls.reset();
    component.openModal(veiculo);

    expect(dialogSpy.open).toHaveBeenCalledWith(ModalVeiculoComponent, { width: '600px', data: { veiculo } });
    expect(veiculoServiceSpy.getVeiculos).toHaveBeenCalled();
  });

  it('deve mostrar confirmação ao excluir um veículo', () => {
    const veiculo = mockVeiculos[0];
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpyObj.afterClosed.and.returnValue(of(false));
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    component.confirmDelete(veiculo);

    expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar exclusão',
        message: `Deseja realmente excluir o veículo ${veiculo.placa}?`
      }
    });
    expect(veiculoServiceSpy.deleteVeiculo).not.toHaveBeenCalled();
  });

  it('deve excluir veículo ', fakeAsync(() => {
    const veiculo = mockVeiculos[0];
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpyObj.afterClosed.and.returnValue(of(true));
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    veiculoServiceSpy.deleteVeiculo.and.returnValue(of(undefined));
    veiculoServiceSpy.getVeiculos.calls.reset();

    component.confirmDelete(veiculo);
    tick();

    expect(veiculoServiceSpy.deleteVeiculo).toHaveBeenCalledWith(veiculo.id);
    expect(veiculoServiceSpy.getVeiculos).toHaveBeenCalled();
  }));
});
