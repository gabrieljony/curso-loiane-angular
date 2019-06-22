import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ConsultarCepService } from '../shared/services/consultar-cep.service';
import { VerificaEmailService } from './services/verifica-email.service';
import { DropdownService } from './../shared/services/dropdown.service';

import { FormValidations } from './../shared/form-validation';
import { EstadoBr } from '../shared/models/estadobr.model';

import { Observable, empty } from 'rxjs';
import { map, tap, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BaseFormComponent } from '../shared/base-form/base-form.component';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {


  // formulario: FormGroup;
  // estados: EstadoBr[];
  estados: Observable<EstadoBr[]>;
  cepInvalido: boolean = false;

  cargos: any[];
  tecnologias: any[];
  newsletterOp: any[];


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cepService: ConsultarCepService,
    private dropdownService: DropdownService,
    private verificaEmailService: VerificaEmailService) {
      super();
     }

  //No momento da inicialização do component chama o ngOnInit
  ngOnInit() {

    // this.verificaEmailService.verificarEmail('email@email.com').subscribe();

    this.estados = this.dropdownService.getEstadoBr();
    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOp = this.dropdownService.getNewsLetter();

    // this.dropdownEstados();

    // FormGroup
    //Instanciar uma classe FormGroup e a classe recebe um objeto como parâmetro - nome e email

    this.formulario = new FormGroup({
      nome: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(15)]),
      email: new FormControl(null, [Validators.required, Validators.email], this.validarEmail.bind(this)),
      confirmarEmail: new FormControl(null, [FormValidations.equalsTo('email')]),
      endereco: new FormGroup({
        cep: new FormControl(null, [Validators.required, FormValidations.cepValidator]),
        numero: new FormControl(null, Validators.required),
        complemento: new FormControl(null),
        rua: new FormControl(null, Validators.required),
        bairro: new FormControl(null, Validators.required),
        cidade: new FormControl(null, Validators.required),
        estado: new FormControl(null, Validators.required)
      }),
      cargo: new FormControl(null),
      tecnologia: new FormControl(null),
      newsletter: new FormControl(null),
      termos: new FormControl(null, Validators.pattern('true'))

  });

  // FormBuilder
  //Instanciar uma classe usando o FormBuilder e a classe recebe um objeto como parâmetro

  // this.formulario = this.formBuilder.group({
  //   nome:[null, Validators.required],
  //   email:[null, [Validators.required, Validators.email]],
  //   endereco: this.formBuilder.group({
  //     cep:[null, Validators.required],
  //     numero:[null, Validators.required],
  //     complemento:[null],
  //     rua:[null, Validators.required],
  //     bairro:[null, Validators.required],
  //     cidade:[null, Validators.required],
  //     estado:[null, Validators.required]
  //   })
  // });

  this.formulario.get('endereco.cep').statusChanges
    .pipe(
      distinctUntilChanged(),
      tap(value => console.log('Status do CEP: ', value)),
      switchMap( status => status === 'VALID' ? this.cepService.consultaCEP(this.formulario.get('endereco.cep').value) : empty() )
    )
    .subscribe(dados => dados ? this.populaDadosForm(dados) : {});
  }

  submit() {
    console.log(this.formulario);
    console.log(this.formulario.value);

    this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .subscribe(dados => {
        console.log(dados);
        console.log(this.formulario.value);
      },
      (error: any) => alert('erro'));
      //reseta o form
      // this.formulario.reset();
      // ou
      //this.limpar();
  }

  verificaValidCep() {
    return this.cepInvalido = true;
  }

  consultaCEP() {

    const cep = this.formulario.get('endereco.cep').value;

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
      .subscribe(dados => {
        this.populaDadosForm(dados);
        // console.log(dados);
      });
    }

  }

  populaDadosForm(dados){

    if (dados.resultado === '1') {
      this.cepInvalido = false;
      this.formulario.patchValue({
        endereco: {
          rua: dados.tipo_logradouro + ' ' + dados.logradouro,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.cidade,
          estado: dados.uf,
        }
      });
    } else {
      this.resetaDadosForm();
      this.verificaValidCep();
    }
  }

  resetaDadosForm(){
    this.formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null,
      }
    });
  }

  dropdownEstados() {
    // this.dropdownService.getEstadoBr()
    //   .subscribe(dados => {
    //     this.estados = dados;
    //     console.log(this.estados);
    //   });
  }

  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', descricao: 'Dev Pl'};
    this.formulario.get('cargo').setValue(cargo);
  }

  compararCargos (obj1, obj2) {
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 && obj2 ;
  }

  setarTecnologias() {
    this.formulario.get('tecnologia').setValue(['java', 'javascript', 'php']);
  }

  validarEmail(formControl: FormControl) {
    return this.verificaEmailService.verificarEmail(formControl.value)
      .pipe(map(emailExiste => emailExiste ? { emailInvalido : true } : null));
  }

}
