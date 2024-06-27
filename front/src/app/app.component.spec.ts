import { HttpClientModule } from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { Component, NgZone } from '@angular/core';
import { AppComponent } from './app.component';
import {SessionService} from "./services/session.service";
import {AuthService} from "./features/auth/services/auth.service";
import {Router} from "@angular/router";
@Component({ template: '' })
class DummyComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let sessionServiceMock: { $isLogged: any; logOut: any };
  let router: Router;
  beforeEach(async () => {
    sessionServiceMock = { $isLogged: jest.fn(), logOut: jest.fn() };
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        RouterTestingModule.withRoutes([
          { path: '', component: DummyComponent },
        ]),
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: SessionService, useValue: sessionServiceMock }]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should call logOut and navigate to home on logout', () => {
    const spyRouter = jest.spyOn(component['router'], 'navigate');
    const ngZone = TestBed.inject(NgZone);
    ngZone.run(() => {
      component.logout();
    });

    expect(sessionServiceMock.logOut).toHaveBeenCalled();

    expect(spyRouter).toHaveBeenCalledWith(['']);
  });
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
