import { Component, OnInit } from '@angular/core';
import { Tool } from '../models/Tool';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  tools!: Tool[];

  constructor(private toolService: ToolService) { }

  ngOnInit() {
    this.getTools();
  }

  getTools(){
    this.toolService.getTool().subscribe(
      (_tools: Tool[]) => {
        this.tools = _tools;
        console.log(_tools);
      },error => {
        console.log(error);
      }      
    );
  }

}
