import { Component } from '@angular/core';
import { AiAgentService } from  '../../services/ai-agent.service';

@Component({
  selector: 'app-ai-agent',
  templateUrl: './ai-agent.component.html',
  styleUrl: './ai-agent.component.scss'
})
export class AiAgentComponent {
  userInput = '';
  output = '';
  constructor(private aiService: AiAgentService) {}
  submitPrompt() {
    this.aiService.generateCode(this.userInput).subscribe(res => {
      this.output = res.output || res.error;
    });
  }
}
