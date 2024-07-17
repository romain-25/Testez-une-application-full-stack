import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { expect } from '@jest/globals';
describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with isLogged as false', () => {
    expect(service.isLogged).toBe(false);
  });

  it('should log in a user', () => {
    const mockUser: SessionInformation = {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'rr',
      firstName: 'Romain',
      lastName: 'Rouabah',
      admin: true
    };

    service.logIn(mockUser);

    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(mockUser);
  });

  it('should log out a user', () => {
    const mockUser: SessionInformation = {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'rr',
      firstName: 'Romain',
      lastName: 'Rouabah',
      admin: true
    };

    service.logIn(mockUser);
    expect(service.isLogged).toBe(true);

    service.logOut();
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit isLogged value correctly on login', (done) => {
    const mockUser: SessionInformation = {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'rr',
      firstName: 'Romain',
      lastName: 'Rouabah',
      admin: true
    };

    service.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBe(true);
      done();
    });

    service.logIn(mockUser);
  });

  it('should emit isLogged value correctly on logout', (done) => {
    const mockUser: SessionInformation = {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'rr',
      firstName: 'Romain',
      lastName: 'Rouabah',
      admin: true
    };

    service.logIn(mockUser); // Log in first to set isLogged to true

    service.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBe(false);
      done();
    });

    service.logOut();
  });
});
