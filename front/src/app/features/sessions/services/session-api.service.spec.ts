import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import {of} from "rxjs";

describe('SessionsService', () => {
  let service: SessionApiService;
  const sessionApiServiceStub = {
    detail: (sessionId: string) => of({/* mock session data */})
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ], providers: [
        { provide: SessionApiService, useValue: sessionApiServiceStub }
      ]
    });
    service = TestBed.inject(SessionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
