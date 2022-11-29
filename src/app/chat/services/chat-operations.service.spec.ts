import { TestBed } from '@angular/core/testing';

import { ChatOperationsService } from './chat-operations.service';

describe('ChatOperationsService', () => {
  let service: ChatOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
