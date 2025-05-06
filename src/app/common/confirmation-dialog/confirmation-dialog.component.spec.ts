import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ConfirmationDialogComponent, ConfirmationDialogData } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  beforeEach(async () => {
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    const mockDialogData: ConfirmationDialogData = {
      title: 'Teste de confirmação',
      message: 'Esta é uma mensagem de teste'
    };

    await TestBed.configureTestingModule({
      imports: [
        ConfirmationDialogComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
  
  it('deve exibir o título e mensagem corretos', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Teste de confirmação');
    expect(compiled.querySelector('mat-dialog-content p')?.textContent).toContain('Esta é uma mensagem de teste');
  });
  
  it('deve fechar o diálogo com true ao confirmar', () => {
    const dialogRef = TestBed.inject(MatDialogRef);
    component.onConfirm();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
  
  it('deve fechar o diálogo com false ao cancelar', () => {
    const dialogRef = TestBed.inject(MatDialogRef);
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
