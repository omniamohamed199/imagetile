import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagemapComponent } from './imagemap.component';

describe('ImagemapComponent', () => {
  let component: ImagemapComponent;
  let fixture: ComponentFixture<ImagemapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagemapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
