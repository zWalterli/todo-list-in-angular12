import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray , FormControl, FormGroup, Validators } from '@angular/forms';
import { Tool } from '../models/Tool';
import { ToolModel } from '../models/ToolModel';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  listString: string[] = [];
  tool!: Tool;
  model!: ToolModel;
  tools: Tool[] = [];
  filtroLista: string = '';
  registerForm!: FormGroup;

  constructor(private toolService: ToolService,
              private fb: FormBuilder)
              {
              }

  ngOnInit() {
    this.model = new ToolModel();
    this.validation();
    this.getTools();
  }

  openModal(template: any){
    template.show();
  }

  getToolsByTag(tag: string){
    this.toolService.getToolByTag(tag).subscribe(
      (_tools: Tool[]) => {
        this.tools = _tools;
      },error => {
        console.log(error);
      }
    );
  }

  getTools(){
    this.toolService.getTool().subscribe(
      (_tools: Tool[]) => {
        this.tools = _tools;
        console.log("Tools Capturadas do Backend", this.tools);
      },error => {
        console.log(error);
      }
    );
  }

  validation(){
    this.registerForm = this.fb.group({
      id: [''],
      title: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      link: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      tags: this.fb.array([]),
    });
  }

  get tags() : FormArray {
    return this.registerForm.get('tags') as FormArray;
  }

  newTag() : FormGroup {
    return this.fb.group({
      tag: '',
    })
  }

  addTag() {
    this.tags.push(this.newTag());
  }

  removeTag(id : number) {
    this.tags.removeAt(id);
  }

  postTool(tool: ToolModel){
    this.toolService.postTool(this.model).subscribe(
      () => {
        console.log("POST realizado com sucesso!");
      }, error => {
        console.log(console.log(error));
      }
    )
  }

  putTool(tool: ToolModel){
    this.toolService.putTool(this.model).subscribe(
      () => {
        console.log("PUT realizado com sucesso!");
      }, error => {
        console.log(console.log(error));
      }
    );
  }

  deleteTool(toolId: number){
    this.toolService.deleteTool(toolId).subscribe(
      () => {
        console.log("DELETE realizado com sucesso!");
      }, error => {
        console.log(console.log(error));
      }
    );
  }


  salvarAlteracao(template: any) {
    if(this.registerForm.valid){

      this.tool = Object.assign({}, this.registerForm.value);

      this.model.description = this.tool.description;
      this.model.link = this.tool.link;
      this.model.title = this.tool.title;
      this.model.id = this.tool.id == 0 ? 0 : this.tool.id;
      this.model.Tags = [];

      for (let index = 0; index < this.registerForm.value.tags.length; index++) {
        const e = this.registerForm.value.tags[index];
        this.model.Tags?.push(e.tag);
      }

      if(this.model.id == null || this.model.id <= 0){
        console.log("Vai entrar no POST.", this.model);
        this.postTool(this.model);
      } else {
        console.log("Vai entrar no PUT.", this.model);
        this.putTool(this.model);
      }

      template.hide();
      this.getTools();
    }
  }

}
