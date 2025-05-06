import { Injectable } from "@angular/core";
import { Veiculo, VeiculoResponse } from "../models/veiculo.model";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  private apiUrl = "http://localhost:3000/api/veiculos";
  constructor(private http: HttpClient) {}

  getVeiculos(page: number = 0, size: number = 10): Observable<VeiculoResponse> {
    const params = new HttpParams().set("page", page.toString()).set("size", size.toString());
    return this.http.get<VeiculoResponse>(this.apiUrl, { params });
  }

  getVeiculoById(id: number): Observable<Veiculo> {
    return this.http.get<Veiculo>(`${this.apiUrl}/${id}`);
  }

  addVeiculo(veiculo: Veiculo): Observable<Veiculo> {
    return this.http.post<Veiculo>(this.apiUrl, veiculo);
  }

  updateVeiculo(veiculo: Veiculo): Observable<Veiculo> {
    return this.http.put<Veiculo>(`${this.apiUrl}/${veiculo.id}`, veiculo);
  }

  deleteVeiculo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
