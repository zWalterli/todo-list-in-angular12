import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tool } from '../models/Tool';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

constructor(private http: HttpClient) { }
  baseURL = 'http://localhost:3000/api/tools';

  getTool() : Observable<Tool[]> {
    return this.http.get<Tool[]>(this.baseURL);
  }

  getToolByTag(tag: string) : Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.baseURL}/?tag=${tag}`);
  }

  postTool(tool: Tool) {
    return this.http.post(this.baseURL, tool);
  }

  putTool(tool: Tool) {
    return this.http.put(this.baseURL, tool);
  }

  deleteTool(toolId: number) {
    return this.http.delete(`${this.baseURL}/${toolId}`);
  }

}

