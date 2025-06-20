import { Component } from '@angular/core';
import { AiAgentService } from  '../../services/ai-agent.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-ai-agent',
  templateUrl: './ai-agent.component.html',
  styleUrl: './ai-agent.component.scss'
})
export class AiAgentComponent {
  userInput: string = '';
  output: string = '';
  renderedMarkdown: SafeHtml = '';
  isGenerating: boolean = false;
  isImproving: boolean = false;
  hasCodeBlocks: boolean = false;

  constructor(
    private aiService: AiAgentService,
    private sanitizer: DomSanitizer
  ) {}

  submitPrompt(): void {
    if (!this.userInput.trim()) {
      return;
    }

    this.isGenerating = true;
    this.output = '';
    this.renderedMarkdown = '';
    this.hasCodeBlocks = false;

    
    const enhancedPrompt = `${this.userInput}

Please format your response in markdown with:
- Clear headings for different sections
- Code blocks with proper syntax highlighting
- Explanations before and after code
- Step-by-step breakdown if applicable
- Comments within the code
- A conclusion or summary section`;

    this.aiService.generateCode(enhancedPrompt).subscribe({
      next: (res) => {
        this.output = res.output || res.error || 'No response received';
        this.renderMarkdown();
        this.isGenerating = false;
      },
      error: (error) => {
        this.output = `Error: ${error.message || 'Failed to generate code. Please try again.'}`;
        this.renderMarkdown();
        this.isGenerating = false;
      }
    });
  }
  improveCode(): void {
    if (!this.output.trim()) {
      return;
    }

    this.isImproving = true;

    this.aiService.improveCode(this.output).subscribe({
      next: (res) => {
        this.output = res.output || res.error || 'No improved response received';
        this.renderMarkdown();
        this.isImproving = false;
      },
      error: (error) => {
        console.error('Error improving code:', error);
        this.isImproving = false;
      }
    });
  }

  private renderMarkdown(): void {
    // Simple markdown parser - you might want to use a library like marked.js for production
    let html = this.output;
    
    // Check if there are code blocks
    this.hasCodeBlocks = /```[\s\S]*?```/.test(html);
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Code blocks
    html = html.replace(/```python\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/```\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic text
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$1. $2</li>');
    
    // Wrap consecutive list items in ul tags
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    // Wrap in paragraphs
    html = '<p>' + html + '</p>';
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    
    this.renderedMarkdown = this.sanitizer.bypassSecurityTrustHtml(html);
  }

  copyToClipboard(): void {
    if (navigator.clipboard && this.output) {
      navigator.clipboard.writeText(this.output).then(() => {
        console.log('Content copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy content: ', err);
        this.fallbackCopy(this.output);
      });
    } else {
      this.fallbackCopy(this.output);
    }
  }

  copyCodeOnly(): void {
    if (!this.hasCodeBlocks) return;
    
    // Extract code blocks from the output
    const codeBlocks = this.output.match(/```(?:python)?\n?([\s\S]*?)\n?```/g);
    if (codeBlocks) {
      const codeOnly = codeBlocks
        .map(block => block.replace(/```(?:python)?\n?/g, '').replace(/\n?```/g, ''))
        .join('\n\n# ========================================\n\n');
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(codeOnly).then(() => {
          console.log('Code copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy code: ', err);
          this.fallbackCopy(codeOnly);
        });
      } else {
        this.fallbackCopy(codeOnly);
      }
    }
  }

  private fallbackCopy(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      console.log('Content copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy content: ', err);
    }
    
    document.body.removeChild(textArea);
  }
}