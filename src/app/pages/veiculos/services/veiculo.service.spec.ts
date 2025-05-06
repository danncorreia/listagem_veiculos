import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { VeiculoService } from './veiculo.service';
import { Veiculo } from '../models/veiculo.model';
import { ErrorService } from '../../../core/services/error.service';
import { RequestInterceptor } from '../../../core/interceptors/request.interceptor';
import { LoadingService } from '../../../core/services/loading.service';

describe('VeiculoService', () => {
  let service: VeiculoService;
  let httpTestingController: HttpTestingController;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  const apiUrl = 'http://localhost:3000/api/veiculos';

  beforeEach(() => {
    const errorSpy = jasmine.createSpyObj('ErrorService', ['handleError']);
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VeiculoService,
        { provide: ErrorService, useValue: errorSpy },
        { provide: LoadingService, useValue: loadingSpy },
        { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
      ]
    });

    service = TestBed.inject(VeiculoService);
    httpTestingController = TestBed.inject(HttpTestingController);
    errorServiceSpy = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('tratamento de erros HTTP', () => {
    it('deve tratar erro 404 ao buscar veículo inexistente', fakeAsync(() => {
      const id = 999;
      let errorResponse: HttpErrorResponse | undefined;

      service.getVeiculoById(id).subscribe({
        next: () => fail('Deveria falhar com 404'),
        error: (error) => errorResponse = error
      });

      const req = httpTestingController.expectOne(`${apiUrl}/${id}`);

      req.flush('Veículo não encontrado', {
        status: 404,
        statusText: 'Not Found'
      });

      tick();

      expect(errorServiceSpy.handleError).toHaveBeenCalled();
      expect(errorResponse?.status).toBe(404);
    }));

    it('deve tratar erro 500 ao adicionar veículo com dados inválidos', fakeAsync(() => {
      const invalidVeiculo: Veiculo = {
        id: 0,
        placa: '',
        chassi: '9BWZZZ377VT004251',
        renavam: '12345678901',
        modelo: 'Civic',
        marca: 'Honda',
        ano: 2020
      };

      let errorResponse: HttpErrorResponse | undefined;

      service.addVeiculo(invalidVeiculo).subscribe({
        next: () => fail('Deveria falhar com 500'),
        error: (error) => errorResponse = error
      });

      const req = httpTestingController.expectOne(apiUrl);

      req.flush('Erro ao processar dados do veículo', {
        status: 500,
        statusText: 'Internal Server Error'
      });

      tick();

      expect(errorServiceSpy.handleError).toHaveBeenCalled();
      expect(errorResponse?.status).toBe(500);
    }));

    it('deve tratar erro de conexão (status 0)', fakeAsync(() => {
      let errorResponse: HttpErrorResponse | undefined;

      service.getVeiculos().subscribe({
        next: () => fail('Deveria falhar com erro de conexão'),
        error: (error) => errorResponse = error
      });

      const req = httpTestingController.expectOne(`${apiUrl}?page=0&size=10`);

      const mockError = new ProgressEvent('error');
      req.error(mockError);

      tick();

      expect(errorServiceSpy.handleError).toHaveBeenCalled();
      expect(errorResponse?.status).toBe(0);
    }));

    it('deve tratar erro 400 ao atualizar veículo com dados inválidos', fakeAsync(() => {
      const invalidVeiculo: Veiculo = {
        id: 5,
        placa: 'ABC1234',
        chassi: '9BWZZZ377VT004251',
        renavam: '',
        modelo: 'Civic',
        marca: 'Honda',
        ano: 2020
      };

      let errorResponse: HttpErrorResponse | undefined;

      service.updateVeiculo(invalidVeiculo).subscribe({
        next: () => fail('Deveria falhar com 400'),
        error: (error) => errorResponse = error
      });

      const req = httpTestingController.expectOne(`${apiUrl}/${invalidVeiculo.id}`);

      req.flush({ message: 'Dados do veículo inválidos' }, {
        status: 400,
        statusText: 'Bad Request'
      });

      tick();

      expect(errorServiceSpy.handleError).toHaveBeenCalled();
      expect(errorResponse?.status).toBe(400);
      expect(errorResponse?.error.message).toBe('Dados do veículo inválidos');
    }));
  });
});
