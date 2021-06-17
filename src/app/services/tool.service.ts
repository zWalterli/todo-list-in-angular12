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
    return this.http.get<Tool[]>(`${this.baseURL}/?tag=string`);
  }

}

