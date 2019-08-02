import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

import { EnduserRoutingModule } from './enduser-routing.module';
import { EnduserComponent } from '../enduser/enduser.component';
import { MytaskComponent } from './mytask/mytask.component';
import { ExceptionComponent } from './exception/exception.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsernavbarComponent } from './usernavbar/usernavbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from '../header/header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './execute/form/form.component';
import { InputArtComponent } from './execute/Input_Art/InputArt.component';
import { NonRepeatableFormComponent } from './execute/non-repeatable-form/non-repeatable-form.component';
import { RepeatProcessComponent } from './execute/repeat-process/repeat-process.component';
import { RepeatableFormComponent } from './execute/repeatable-form/repeatable-form.component';
import { ReportTableComponent } from './report-table/report-table.component';
import { DialogChartsComponent } from './report-table/dialog-charts/dialog-charts.component';
import { ProcessDesignComponent } from './process-design/process-design.component';

@NgModule({
  declarations: [
    EnduserComponent,
    MytaskComponent,
    ExceptionComponent,
    DashboardComponent,
    UsernavbarComponent,
    FormComponent,
    InputArtComponent,
    NonRepeatableFormComponent,
    RepeatProcessComponent,
    RepeatableFormComponent,
    ReportTableComponent,
    DialogChartsComponent,
    ProcessDesignComponent
  ],
  imports: [
    CommonModule,
    EnduserRoutingModule,
    SharedModule,
    HeaderModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    NgbModule,
    ModalModule.forRoot(),
  ],
  entryComponents: [ DialogChartsComponent]
})
export class EnduserModule {
  constructor() {
    console.log("EnduserModule => ");
  }
}
