import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import {Router} from "@angular/router";
import {of} from "rxjs";
import {TeacherService} from "../../../../services/teacher.service";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let router: Router;
  let snackBar: MatSnackBar;
  let snackBarSpy: jest.SpyInstance;
  let navigateSpy: jest.SpyInstance;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }
  const mockSession = {
    id: 1,
    name: 'Yoga Session',
    date: new Date(),
    description: 'A relaxing yoga session',
    users: [1],
    teacher_id: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTeacher = {
    id: 1,
    firstName: 'Romain',
    lastName: 'R'
  };

  const matSnackBarMock = {
    open: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: { create: () => of(mockSession), update: () => of(mockSession), detail: () => of(mockSession) } },
        { provide: TeacherService, useValue: { all: () => of([mockTeacher]) } },
        { provide: MatSnackBar, useValue: matSnackBarMock  },
        SessionApiService
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));;
    snackBar = TestBed.inject(MatSnackBar);
    snackBarSpy = jest.spyOn(snackBar, 'open');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create a session successfully', async () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    component.sessionForm?.setValue({
      name: 'Yoga Session',
      date: '2024-07-21',
      teacher_id: 1,
      description: 'Description'
    });

    component.submit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should display error when form is invalid', () => {
    component.sessionForm?.setValue({
      name: '',
      date: '',
      teacher_id: '',
      description: 'A very long description that exceeds the maximum length allowed'
    });
    component.submit();
    fixture.detectChanges();
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Form is invalid !', 'Close', { duration: 3000 });
  });
});
