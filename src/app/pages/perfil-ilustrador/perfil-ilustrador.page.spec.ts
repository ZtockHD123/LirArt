import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilILustradorPage } from './perfil-ilustrador.page';

describe('PerfilILustradorPage', () => {
  let component: PerfilILustradorPage;
  let fixture: ComponentFixture<PerfilILustradorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilILustradorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
