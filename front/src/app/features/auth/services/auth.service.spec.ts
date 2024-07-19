import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { AuthService } from './auth.service';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import {SessionInformation} from "../../../interfaces/sessionInformation.interface";

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockSessionInformation: SessionInformation = {
    token: 'token',
    type: 'Bearer',
    id: 1,
    username: 'rr',
    firstName: 'Romain',
    lastName: 'Rouabah',
    admin: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const mockRegisterRequest: RegisterRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    };

    service.register(mockRegisterRequest).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should log in a user', () => {
    const mockLoginRequest: LoginRequest = {
      email: 'romain@gmail.com',
      password: 'password123'
    };

    service.login(mockLoginRequest).subscribe(sessionInfo => {
      expect(sessionInfo).toEqual(mockSessionInformation);
    });

    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockSessionInformation);
  });
});
