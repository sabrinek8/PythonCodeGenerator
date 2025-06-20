import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AiAgentService {

  constructor(private http: HttpClient) {}
  generateCode(prompt: string) {
    return this.http.post<any>('http://localhost:8000/api/generate-code', { user_input: prompt });
  }
  improveCode(code: string) {
    return this.http.post<any>('http://localhost:8000/api/improve-code', { user_input: code });
  }
}
