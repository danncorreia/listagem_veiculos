import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Ocorreu um erro na requisição';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Erro de conexão. Verifique sua internet ou tente novamente mais tarde.';
    } else if (error.status === 404) {
      errorMessage = 'Recurso não encontrado';
    } else if (error.status === 500) {
      errorMessage = 'Erro interno do servidor';
    }

    this.snackBar.open(errorMessage, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
}
