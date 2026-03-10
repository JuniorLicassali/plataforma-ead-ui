import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntaDialog } from './pergunta-dialog';

describe('PerguntaDialog', () => {
  let component: PerguntaDialog;
  let fixture: ComponentFixture<PerguntaDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerguntaDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(PerguntaDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
