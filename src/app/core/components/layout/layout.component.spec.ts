import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutService } from '../../services/layout.service';
import { LoadingService } from '../../services/loading.service';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    const layoutServiceSpy = jasmine.createSpyObj('LayoutService', ['isOppened', 'isMobile']);
    layoutServiceSpy.isOppened.and.returnValue(true);
    layoutServiceSpy.isMobile.and.returnValue(false);

    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', [], {
      isLoading: jasmine.createSpy().and.returnValue(false)
    });
    
    await TestBed.configureTestingModule({
      imports: [
        LayoutComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: LayoutService, useValue: layoutServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
