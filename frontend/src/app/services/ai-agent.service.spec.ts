import { TestBed } from '@angular/core/testing';

import { AiAgentService } from './ai-agent.service';

describe('AiAgentService', () => {
  let service: AiAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
