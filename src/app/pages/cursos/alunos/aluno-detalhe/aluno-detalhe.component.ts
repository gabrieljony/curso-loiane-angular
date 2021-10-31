import { AlunosService } from './../alunos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aluno-detalhe',
  templateUrl: './aluno-detalhe.component.html',
  styleUrls: ['./aluno-detalhe.component.scss']
})
export class AlunoDetalheComponent implements OnInit, OnDestroy {

  aluno: any;
  alunoSubscription: Subscription;

  constructor(private router: Router,
    private routeActive: ActivatedRoute,
    private alunosService: AlunosService) { }

  ngOnInit() {
    this.alunoSubscription = this.routeActive.params.subscribe((params: any) => {
      let id = params['id'];

      this.aluno = this.alunosService.getAluno(id);
    });
  }

  ngOnDestroy() {
    this.alunoSubscription.unsubscribe();
  }

  editarContato(){
    this.router.navigate(['/alunos', this.aluno.id, 'editar'])
  }

}
