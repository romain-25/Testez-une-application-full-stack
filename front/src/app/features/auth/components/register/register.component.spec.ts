import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {RegisterRequest} from "../../interfaces/registerRequest.interface";
import {of, throwError} from "rxjs";

jest.mock('../../services/auth.service');

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: AuthService },
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        }
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call authService.register with correct data on submit', () => {
    const registerRequest: RegisterRequest = {
      email: 'test@example.com',
      firstName: 'Romain',
      lastName: 'R',
      password: 'password123'
    };
    component.form.setValue(registerRequest)
    jest.spyOn(authService, 'register').mockReturnValue(of(void 0));
    component.submit();
    expect(authService.register).toHaveBeenCalledWith(registerRequest);
  });
  it('should set onError to true on registration error', () => {
    const registerRequest: RegisterRequest = {
      email: 'testexample.com',
      firstName: 'Romain',
      lastName: 'R',
      password: 'password123'
    };
    component.form.setValue(registerRequest);
    jest.spyOn(authService, 'register').mockReturnValue(throwError(() => new Error('test')));
    component.submit();

    expect(authService.register).toHaveBeenCalledWith(registerRequest);
    expect(component.onError).toBe(true);
  });
  it('should display validation errors for required fields', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['firstName'].setValue('');
    component.form.controls['lastName'].setValue('');
    component.form.controls['password'].setValue('');

    fixture.detectChanges();

    expect(component.onError).toBe(false);
  })
});
