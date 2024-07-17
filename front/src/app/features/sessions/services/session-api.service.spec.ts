import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed ,} from '@angular/core/testing';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';
import { expect } from '@jest/globals';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  const mockSessions: Session[] = [
    { id: 1, name: 'Session 1', description: 'Desc 1', date: new Date(), teacher_id: 1, users: [], createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: 'Session 2', description: 'Desc 2', date: new Date(), teacher_id: 2, users: [], createdAt: new Date(), updatedAt: new Date() }
  ];

  const mockSession: Session = {
    id: 1,
    name: 'Session 1',
    description: 'Desc 1',
    date: new Date(),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService]
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all sessions', () => {
    service.all().subscribe(sessions => {
      expect(sessions.length).toBe(2);
      expect(sessions).toEqual(mockSessions);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  it('should retrieve a session by id', () => {
    service.detail('1').subscribe(session => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should delete a session', () => {
    service.delete('1').subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should create a new session', () => {
    service.create(mockSession).subscribe(session => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    req.flush(mockSession);
  });

  it('should update a session', () => {
    const updatedSession = { ...mockSession, name: 'Updated Session 1' };

    service.update('1', updatedSession).subscribe(session => {
      expect(session).toEqual(updatedSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedSession);
  });

  it('should participate in a session', () => {
    service.participate('1', 'user1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('api/session/1/participate/user1');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should unParticipate from a session', () => {
    service.unParticipate('1', 'user1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('api/session/1/participate/user1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
