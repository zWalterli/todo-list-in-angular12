import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray , FormGroup, Validators } from '@angular/forms';
import { Tool } from '../models/Tool';
import { ToolService } from '../services/tool/tool.service';
import { ToastrService } from "ngx-toastr";
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';
import { Tag } from '../models/Tag';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  listString: string[] = [];
  tool!: Tool;
  tools: Tool[] = [];
  filtroLista: string = '';
  registerForm!: FormGroup;
  modoSalvar: string = '';
  tagsList!: string[];
  bodyTemplateModal : string = '';

  // Pagination
  pageSize: number = 10;
  page: number = 1;

  constructor(private toolService: ToolService,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private userService : UserService,
              private router : Router)
              {
              }

  ngOnInit() {
    this.validation();
    this.getTools();
  }

  log(x : any, name? : string) {
    if (name == undefined) {
      console.log(x);
    } else {
      console.log( name, x);
    }
  }

  ValidaVoltar() : boolean {
    return this.page > 1;
  }

  ValidaPrimeiro() : boolean {
    return this.page > 1;
  }

  ValidaSegundo() : boolean {
    return true;
  }

  ValidaTerceiro() : boolean {
    return this.tools.slice( this.pageSize * ((this.page-1) + 1)).length > 0;
  }

  ValidaProximo() : boolean {
    return this.tools.slice( this.pageSize * ((this.page-1) + 1)).length > 0;
  }

  nextPage() {
    this.page = this.tools.slice( this.pageSize * ((this.page-1) + 1)).length < 1 ? this.page : this.page + 1;
  }

  previousPage() {
    this.page = this.page == 1 ? this.page : this.page - 1;
  }

  EditTool(tool: Tool, template: any) {
    this.openModal(template);
    this.modoSalvar = 'put';
    this.tool = tool;

    this.tool.tags.forEach(e => {
      this.addTag(e);
    });

    this.registerForm.patchValue(tool);
  }

  NewTool(template: any) {
    this.openModal(template);
    this.modoSalvar = 'post';
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  Log( x : any) {
    console.log(x);
  }

  openModal(template: any) {
    this.clearFormArray(this.tags);
    this.registerForm.reset();
    this.tags.reset();
    template.show();
  }

  getToolsByTag(tag: string) {
    this.toolService.getToolByTag(tag).subscribe(
      (_tools: Tool[]) => {
        this.tools = _tools;
      },error => {
        this.toastr.warning("Ocorreu um erro ao capturar as tools!");
      }
    );
  }

  getTools(){
    this.toolService.getTool().subscribe(
      (_tools: Tool[]) => {
        this.tools = _tools;
      },error => {
        console.log("Erro: ", error);
        this.toastr.warning("Ocorreu um erro ao capturar as tools!");
      }
    );
  }

  validation(){
    this.registerForm = this.fb.group({
      id: [''],
      title: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      link: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      tags: this.fb.array([]),
    });
  }

  get tags() : FormArray {
    return this.registerForm.get('tags') as FormArray;
  }

  newTag(value? : Tag) : FormGroup {
    return this.fb.group({
      id: value == undefined ? 0 : value.id,
      description: value == undefined ? '' : value.description,
    })
  }

  addTag(value? : Tag) {
    this.tags.push(this.newTag(value));
  }

  removeTag(id : number) {
    this.tags.removeAt(id);
  }

  postTool(tool: Tool){
    this.toolService.postTool(tool).subscribe(
      () => {
        this.toastr.success("Tool criada com sucesso!", "Sucesso!");
        this.getTools();
      }, error => {
        this.toastr.error("Ocorreu um erro ao criar a Tool.", "Erro!");
      }
    )
  }

  putTool(tool: Tool){
    this.toolService.putTool(tool).subscribe(
      () => {
        this.toastr.success("Tool atualizada com sucesso!", "Sucesso!");
        this.getTools();
      }, error => {
        this.toastr.error("Ocorreu um erro ao atualizar a Tool.", "Erro!");
      }
    );
  }

  openDeleteTool(tool: Tool, template : any) {
    this.modoSalvar = 'delete';
    this.tool = tool;
    this.bodyTemplateModal = `Deseja mesmo deletar a Tool com o identificador '${this.tool.id}' com título '${this.tool.title == null ? 'Sem título' : this.tool.title}'?`;
    this.openModal(template);
  }

  deleteTool(template : any) {
    this.toolService.deleteTool(this.tool.id).subscribe(
      () => {
        this.getTools();
        this.toastr.success("Tool deletada com sucesso!", "Sucesso!");
      }, error => {
        this.toastr.error("Ocorreu um erro ao deletar a Tool.", "Erro!");
      }
    );
    template.hide();
  }

  salvarAlteracao(template: any) {
    if(this.registerForm.valid) {

      this.tool = Object.assign({}, this.registerForm.value);
      this.tool.tags = [];

      this.registerForm.value.tags?.forEach((tag: Tag) => {
        this.tool.tags.push(tag);
      });

      switch (this.modoSalvar) {
        case 'post':
          this.tool.id = 0;
          this.postTool(this.tool);
          break;

        case 'put':
          this.putTool(this.tool);
          break;

        default:
          break;
      }
      template.hide();
    }
  }
}
