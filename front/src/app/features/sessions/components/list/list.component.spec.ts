import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ListComponent } from './list.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { expect } from '@jest/globals';
const mockSessions = [
  { id: 1, name: 'Yoga Session', date: new Date(), description: 'A relaxing yoga session' },
  { id: 2, name: 'Meditation Session', date: new Date(), description: 'A calming meditation session' },
];

const adminUser = { admin: true };
const regularUser = { admin: false };

describe('ListComponent', () => {
  let fixture: ComponentFixture<ListComponent>;
  let component: ListComponent;
  let httpTestingController: HttpTestingController;
  let debugElement: DebugElement;

  beforeEach(async () => {
    const sessionServiceMock = { sessionInformation: adminUser };
    const sessionApiServiceMock = { all: () => of(mockSessions) };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule,
        CommonModule
      ],
      declarations: [ListComponent],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: SessionApiService, useValue: sessionApiServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });
  it('should display create button for admin user', () => {
    const createButton = fixture.nativeElement.querySelector('#create');
    expect(createButton).not.toBeNull();
  });

  test('should not display create button for regular user', async () => {
    TestBed.resetTestingModule();
    const sessionServiceMock = { sessionInformation: regularUser };
    const sessionApiServiceMock = { all: () => of(mockSessions) };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule,
        CommonModule
      ],
      declarations: [ListComponent],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: SessionApiService, useValue: sessionApiServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();

    await fixture.whenStable();
    const createButton = fixture.nativeElement.querySelector('#create');
    expect(createButton).toBeNull();
  });

  it('should display session list', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const sessionNames = debugElement.queryAll(By.css('.item'));
    expect(sessionNames.length).toBe(mockSessions.length);
    expect(sessionNames[0].nativeElement.textContent).toContain('Yoga Session');
    expect(sessionNames[1].nativeElement.textContent).toContain('Meditation Session');
  });

  it('should display detail button for each session', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const detailButtons = debugElement.queryAll(By.css('#detail'));
    expect(detailButtons.length).toBe(mockSessions.length);
  });
});
