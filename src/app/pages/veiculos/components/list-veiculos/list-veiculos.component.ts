import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Veiculo, VeiculoResponse } from '../../models/veiculo.model';
import { VeiculoService } from '../../services/veiculo.service';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ModalVeiculoComponent } from '../modal-veiculo/modal-veiculo.component';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../../../common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-list-veiculos',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MatCardModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './list-veiculos.component.html',
  styleUrl: './list-veiculos.component.scss'
})
export class ListVeiculosComponent implements OnInit {
  private veiculoService = inject(VeiculoService);
  private dialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource: Veiculo[] = [];
  displayedColumns: string[] = ['placa', 'chassi', 'renavam', 'modelo', 'marca', 'ano', 'actions'];

  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  ngOnInit(): void {
    this.loadVeiculos();
  }

  loadVeiculos() {
    this.veiculoService.getVeiculos(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.dataSource = response.data;
        this.totalItems = response.total;
      },
      error: (error) => {
        console.error('Erro ao carregar veículos:', error);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadVeiculos();
  }

  openModal(veiculo?: Veiculo) {
    const dialogRef = this.dialog.open(ModalVeiculoComponent, { width: '600px', data: { veiculo } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVeiculos();
      }
    });
  }

  confirmDelete(veiculo: Veiculo): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar exclusão',
        message: `Deseja realmente excluir o veículo ${veiculo.placa}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.veiculoService.deleteVeiculo(veiculo.id).subscribe({
          next: () => this.loadVeiculos(),
          error: (err) => console.error('Erro ao excluir veículo', err)
        });
      }
    });
  }
}
