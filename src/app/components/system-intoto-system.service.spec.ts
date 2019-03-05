import { TestBed, inject } from '@angular/core/testing';

import { SystemIntotoSystemService } from './system-intoto-system.service';

describe('SystemIntotoSystemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemIntotoSystemService]
    });
  });

  it('should be created', inject([SystemIntotoSystemService], (service: SystemIntotoSystemService) => {
    expect(service).toBeTruthy();
  }));
});
