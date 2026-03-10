import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosCadastrar } from './cursos-cadastrar';

describe('CursosCadastrar', () => {
  let component: CursosCadastrar;
  let fixture: ComponentFixture<CursosCadastrar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosCadastrar],
    }).compileComponents();

    fixture = TestBed.createComponent(CursosCadastrar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
