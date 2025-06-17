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
  isGenerating = false;

  constructor(private aiService: AiAgentService) {}
submitPrompt() {
    if (!this.userInput.trim()) {
      return;
    }

    this.isGenerating = true;
    this.output = '';

    this.aiService.generateCode(this.userInput).subscribe({
      next: (res) => {
        this.output = res.output || res.error || 'No response received';
        this.isGenerating = false;
      },
      error: (error) => {
        this.output = `Error: ${error.message || 'Failed to generate code. Please try again.'}`;
        this.isGenerating = false;
      }
    });
  }

  copyToClipboard() {
    if (navigator.clipboard && this.output) {
      navigator.clipboard.writeText(this.output).then(() => {
        // You can add a toast notification here
        console.log('Code copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy code: ', err);
        // Fallback for older browsers
        this.fallbackCopy();
      });
    } else {
      this.fallbackCopy();
    }
  }

  private fallbackCopy() {
    const textArea = document.createElement('textarea');
    textArea.value = this.output;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      console.log('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
    
    document.body.removeChild(textArea);
  }
}
