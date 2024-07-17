import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterTestingModule,} from '@angular/router/testing';
import {expect} from '@jest/globals';
import {SessionService} from '../../../../services/session.service';
import { NgZone } from '@angular/core';
import {DetailComponent} from './detail.component';
import {SessionApiService} from "../../services/session-api.service";
import {TeacherService} from "../../../../services/teacher.service";
import {Teacher} from "../../../../interfaces/teacher.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {Session} from "../../interfaces/session.interface";
import {of} from "rxjs";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let teacherService: jest.Mocked<TeacherService>;
  let router: Router;
  let navigateSpy: jest.SpyInstance;

  const sessionApiServiceMock = {
    delete: jest.fn().mockReturnValue(of({})),
    detail: jest.fn().mockReturnValue(of({
      id: 1,
      name: 'Yoga Session',
      users: [],
      teacher_id: '1',
      description: 'A relaxing yoga session.',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    })),
    participate: jest.fn().mockReturnValue(of({})),
    unParticipate: jest.fn().mockReturnValue(of({}))
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }
  const mockSession: Session = {
    id: 1,
    name: 'Yoga Session',
    date: new Date(),
    description: 'A relaxing yoga session',
    users: [1],
    teacher_id: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTeacher: Teacher = {
    id: 1,
    firstName: 'Romain',
    lastName: 'R',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const matSnackBarMock = {
    open: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      declarations: [DetailComponent],
      providers: [
        {provide: SessionService, useValue: mockSessionService},
        {provide: SessionApiService, useValue: sessionApiServiceMock},
        {provide: TeacherService, useValue: teacherService},
        { provide: MatSnackBar, useValue: matSnackBarMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ],

    })
      .compileComponents();
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));;
    sessionApiService = TestBed.inject(SessionApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display session information', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain(mockSession.name);
    expect(fixture.nativeElement.querySelector('.description').textContent).toContain(mockSession.description);
  });

  it('should display "Delete" button if user is admin', () => {
    const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]');
    expect(deleteButton).toBeTruthy();
  });
  it('should navigate to sessions list on delete', async () => {
    const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]');
    expect(deleteButton).not.toBeNull();
    component.delete();

    expect(sessionApiServiceMock.delete).toHaveBeenCalledWith('1');
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });
  it('should call participate on sessionApiService when participate is called', () => {
    component.participate();
    expect(sessionApiServiceMock.participate).toHaveBeenCalledWith('1', '1');
    expect(sessionApiServiceMock.detail).toHaveBeenCalledWith('1');
  });

  it('should call unParticipate on sessionApiService when unParticipate is called', () => {
    component.unParticipate();
    expect(sessionApiServiceMock.unParticipate).toHaveBeenCalledWith('1', '1');
    expect(sessionApiServiceMock.detail).toHaveBeenCalledWith('1');
  });

});

