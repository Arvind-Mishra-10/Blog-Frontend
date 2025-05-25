import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPostsFeedComponent } from './all-posts-feed.component';

describe('AllPostsFeedComponent', () => {
  let component: AllPostsFeedComponent;
  let fixture: ComponentFixture<AllPostsFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPostsFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPostsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
