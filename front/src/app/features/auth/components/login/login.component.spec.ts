import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import {AuthService} from "../../services/auth.service";
import {of, throwError} from "rxjs";
import {Router} from "@angular/router";
import {SessionInformation} from "../../../../interfaces/sessionInformation.interface";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let sessionService: SessionService;
  const authServiceMock = {
    login: jest.fn().mockReturnValue(of({})),
  };

  const sessionServiceMock = {
    logIn: jest.fn(),
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        SessionService,
        AuthService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        ],
      imports: [
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
    fixture.detectChanges();
  });
  it('should call authService.login and navigate on successful login', async () => {
    const loginRequest = {email: 'test@example.com', password: 'password123'};
    const sessionInformation: SessionInformation = {
      token: 'token',
      type: 'type',
      id: 1,
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: true
    };

    component.form.setValue(loginRequest);
    (authService.login as jest.Mock).mockReturnValue(of(sessionInformation));
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.submit();
    await fixture.whenStable();
    expect(authService.login).toHaveBeenCalledWith(loginRequest);
    expect(sessionService.logIn).toHaveBeenCalledWith(sessionInformation);
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true on login error', () => {
    const loginRequest = { email: 'test@example.com', password: 'password123' };

    component.form.setValue(loginRequest);
    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('test')));

    component.submit();

    expect(authService.login).toHaveBeenCalledWith(loginRequest);
    expect(component.onError).toBe(true);
  });
});
