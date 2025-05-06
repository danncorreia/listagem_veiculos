import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Veiculo } from '../../models/veiculo.model';
import { VeiculoService } from '../../services/veiculo.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { tap } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-modal-veiculo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './modal-veiculo.component.html',
  styleUrls: ['./modal-veiculo.component.scss'],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    provideNgxMask(),
  ],
})
export class ModalVeiculoComponent  implements OnInit {
  @ViewChild('yearPicker') datepicker!: MatDatepicker<Date>;
  private dialogRef = inject(MatDialogRef<ModalVeiculoComponent>);
  private fb = inject(FormBuilder);
  private veiculoService = inject(VeiculoService);
  private snackBar = inject(MatSnackBar);
  private data = inject(MAT_DIALOG_DATA);

  form!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.isEdit) {
      this.form.patchValue(this.data.veiculo);
    }
  }

  get isEdit() {
    return !!this.data.veiculo?.id;
  }

  get titulo() {
    return this.isEdit ? 'Editar Veículo' : 'Novo Veículo';
  }

  initForm() {
    this.form = this.fb.group({
      placa: ['', [Validators.required, Validators.maxLength(8)]],
      chassi: ['', [Validators.required, Validators.maxLength(17)]],
      renavam: ['', [Validators.required, Validators.maxLength(11)]],
      modelo: ['', [Validators.required, Validators.maxLength(50)]],
      marca: ['', [Validators.required, Validators.maxLength(50)]],
      ano: [null, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]]
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control) return '';
    
    if (control.hasError('required')) {
      return 'Campo obrigatório';
    } 
    
    if (control.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Tamanho máximo excedido (máx: ${maxLength} caracteres)`;
    }
    
    if (control.hasError('min')) {
      const minValue = control.errors?.['min'].min;
      return `Valor mínimo: ${minValue}`;
    }
    
    if (control.hasError('max')) {
      const maxValue = control.errors?.['max'].max;
      return `Valor máximo: ${maxValue}`;
    }
    
    return 'Valor inválido';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.openSnackBar('Preencha todos os campos');
      return;
    }
    const veiculo = this.form.value as Veiculo;

    this.isEdit
      ? this.updateVeiculoHandler(veiculo)
      : this.createVeiculoHandler(veiculo);
  }

  createVeiculoHandler(veiculo: Veiculo): void {
    this.veiculoService.addVeiculo(veiculo).pipe(tap((value) => {
      this.openSnackBar('Veículo criado com sucesso');
      this.dialogRef.close(true);
    })).subscribe();
  }

  updateVeiculoHandler(veiculo: Veiculo): void {
    this.veiculoService.updateVeiculo({ ...veiculo, id: this.data.veiculo.id }).pipe(tap((value) => {
      this.openSnackBar('Veículo atualizado com sucesso');
      this.dialogRef.close(true);
    })).subscribe();
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  chosenYearHandler(normalizedYear: Date): void {
    this.form.get('ano')?.setValue(normalizedYear.getFullYear());
    this.datepicker.close();
  }
}
