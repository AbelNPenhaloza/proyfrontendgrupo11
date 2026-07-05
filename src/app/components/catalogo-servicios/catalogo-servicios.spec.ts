import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoServicios } from './catalogo-servicios';

describe('CatalogoServicios', () => {
  let component: CatalogoServicios;
  let fixture: ComponentFixture<CatalogoServicios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoServicios],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoServicios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
