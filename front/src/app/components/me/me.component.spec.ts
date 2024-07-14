import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';

import { MeComponent } from './me.component';
import {UserService} from "../../services/user.service";
import {of, throwError} from "rxjs";
import { expect } from '@jest/globals';
describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;


  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
      email: 'romain@studio.com',
      firstName: 'ROMAIN',
      lastName: 'rouabah',
    }
  }
  beforeEach(async () => {
    userService = {
      getById: jest.fn().mockReturnValue(of({
        id: 1,
        email: 'romain@studio.com',
        firstName: 'ROMAIN',
        lastName: 'rouabah',
        admin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      delete: jest.fn().mockReturnValue(of({}))
    } as unknown as jest.Mocked<UserService>;

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: userService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display user information', () => {
    const userInfoText = fixture.nativeElement.querySelector('p').textContent;
    expect(userInfoText).toContain('Name: ROMAIN ROUABAH');
  });
  it('should handle user deletion', () => {
    component.delete();
    expect(userService.delete).toHaveBeenCalledWith('1');
  });
});
