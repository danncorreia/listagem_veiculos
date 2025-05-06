export interface Veiculo {
  id: number;
  placa: string;
  chassi: string;
  renavam: string;
  modelo: string;
  marca: string;
  ano: number;
}

export interface VeiculoResponse {
  data: Veiculo[];
  total: number;
}
