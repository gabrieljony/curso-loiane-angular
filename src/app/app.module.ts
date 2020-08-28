import { ListService } from './services/list.service';
import { ConsultarCepService } from './services/consultar-cep.service';
import { VerificarEmailService } from './services/verificar-email.service';
import { DataFormFullModule } from './pages/data-form-full/data-form-full.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateModule } from './template/template.module';
import { TemplateFormModule } from './pages/template-form/template-form.module';
import { DataFormModule } from './pages/data-form/data-form.module';
import { DataFormBuilderComponent } from './pages/data-form-builder/data-form-builder.component';

@NgModule({
  declarations: [AppComponent, DataFormBuilderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TemplateModule,
    TemplateFormModule,
    DataFormModule,
    DataFormFullModule
  ],
  providers: [VerificarEmailService, ConsultarCepService, ListService],
  bootstrap: [AppComponent],
})
export class AppModule {}
