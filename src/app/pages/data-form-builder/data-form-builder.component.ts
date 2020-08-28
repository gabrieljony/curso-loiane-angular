import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ConsultarCepService } from './../../services/consultar-cep.service';
import { ListService } from './../../services/list.service';
import { CidadeBr } from './../../models/cidadebr.model';
import { EstadoBr } from './../../models/estadobr.model';

@Component({
  templateUrl: './data-form-builder.component.html',
  styleUrls: ['./data-form-builder.component.less'],
})
export class DataFormBuilderComponent
  extends BaseFormComponent
  implements OnInit {
  estados: EstadoBr[];
  cidades: CidadeBr[];

  cepInvalido: boolean = false;

  cargos: any[];
  tecnologias: any[];
  newsletterOp: any[];

  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService,
    private cepService: ConsultarCepService
  ) {
    super();
  }

  ngOnInit(): void {
    this.listService.getEstadoBr().subscribe((dados) => (this.estados = dados));

    this.cargos = this.listService.getCargos();
    this.tecnologias = this.listService.getTecnologias();
    this.newsletterOp = this.listService.getNewsLetter();

    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      confirmarEmail: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required],
      }),
      cargo: [null],
      tecnologia: [null],
      newsletter: ['s'],
      termos: [null, Validators.pattern('true')],
    });
  }

  submit(): void {
    console.log(this.formulario);
  }

  consultaCEP(): void {
    const cep = this.formulario.get('endereco.cep').value;

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep).subscribe((dados) => {
        this.populaDadosForm(dados);
      });
    }
  }

  populaDadosForm(dados): void {
    if (dados.resultado === '1') {
      this.cepInvalido = false;
      this.formulario.patchValue({
        endereco: {
          rua: dados.tipo_logradouro + ' ' + dados.logradouro,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.cidade,
          estado: dados.uf,
        },
      });
    } else {
      this.resetaDadosForm();
      this.verificaValidCep();
    }
  }

  resetaDadosForm(): void {
    this.formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null,
      },
    });
  }

  verificaValidCep(): boolean {
    return (this.cepInvalido = true);
  }

  compararCargos(obj1, obj2): boolean {
    return obj1 && obj2
      ? obj1.nome === obj2.nome && obj1.nivel === obj2.nivel
      : obj1 && obj2;
  }
}
