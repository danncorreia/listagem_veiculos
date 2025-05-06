import { Routes } from "@angular/router";
import { ListVeiculosComponent } from "./components/list-veiculos/list-veiculos.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ListVeiculosComponent,
    title: 'Listagem de veículos'
  }
];

