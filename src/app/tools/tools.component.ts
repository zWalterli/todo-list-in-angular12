import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Tool } from '../models/Tool';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  tools: Tool[] = [];
  filtroLista: string = '';
  modalRef!: BsModalRef;

  constructor(private toolService: ToolService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.getTools();
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  getToolsByTag(tag: string){
    this.toolService.getToolByTag(tag).subscribe(
      (_tools: Tool[]) => {
        this.tools = _tools;
        console.log(_tools);
      },error => {
        console.log(error);
      }
    );
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
