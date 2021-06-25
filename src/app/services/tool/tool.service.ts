import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tool } from '../../models/Tool';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

constructor(private http: HttpClient) { }
  baseURL = 'http://localhost:3000/api/tools';

  getTool() : Observable<Tool[]> {
    const token = new HttpHeaders({'Authorization' : `Bearer ${localStorage.getItem('token')}`});
    return this.http.get<Tool[]>(this.baseURL, { headers: token });
  }

  getToolByTag(tag: string) : Observable<Tool[]> {
    const token = new HttpHeaders({'Authorization' : `Bearer ${localStorage.getItem('token')}`});
    return this.http.get<Tool[]>(`${this.baseURL}/?tag=${tag}`, { headers: token });
  }

  postTool(tool: Tool) {
    const token = new HttpHeaders({'Authorization' : `Bearer ${localStorage.getItem('token')}`});
    return this.http.post(this.baseURL, tool, { headers: token });
  }

  putTool(tool: Tool) {
    const token = new HttpHeaders({'Authorization' : `Bearer ${localStorage.getItem('token')}`});
    return this.http.put(this.baseURL, tool, { headers: token });
  }

  deleteTool(toolId: number) {
    const token = new HttpHeaders({'Authorization' : `Bearer ${localStorage.getItem('token')}`});
    return this.http.delete(`${this.baseURL}/${toolId}`, { headers: token });
  }

}

