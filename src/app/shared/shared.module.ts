import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { ChartsModule } from 'ng2-charts-x';
import { FormErrorMsgComponent } from './components/form-error-msg/form-error-msg.component';
import { NoDataMsgComponent } from './components/no-data-msg/no-data-msg.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatListModule, MatIconModule, MatCardModule, MatInputModule, MatRadioModule, MatButtonModule,
  MatSidenavModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
  MatCheckboxModule, MatAutocompleteModule, MatSortModule, MatDividerModule
} from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SplitLastPipe, MyFilterPipe } from '../home/enduser/execute/MyFilterPipe ';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmationAlertComponent } from './components/confirmation-alert/confirmation-alert.component';
import { TreeviewModule } from 'ngx-treeview';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MyFilterPipe1 } from '../home/enduser/process-design/myFilterPipe1';
import { DeleteConfirmComponent } from './components/delete-confirm/delete-confirm.component';
import { DialogScheduleComponent } from './components/dialog-schedule/dialog-schedule.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    // CoreModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatListModule,
    DragDropModule,
    MatChipsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    MatDividerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatSliderModule,
    ColorPickerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ChartsModule,
    MatTabsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatMenuModule,
    TreeviewModule.forRoot(),
  ],
  declarations: [
    FormErrorMsgComponent,
    NoDataMsgComponent,
    MyFilterPipe,
    MyFilterPipe1,
    SplitLastPipe,
    ConfirmationAlertComponent,
    DeleteConfirmComponent,
    DialogScheduleComponent
  ],
  entryComponents: [
    ConfirmationAlertComponent,
    DeleteConfirmComponent,
    DialogScheduleComponent],
  exports: [
    FormErrorMsgComponent,
    NoDataMsgComponent,
    MatCardModule,
    MatIconModule,
    DragDropModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatTableModule,
    MatChipsModule,
    MatSortModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatSliderModule,
    ColorPickerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ChartsModule,
    MatTabsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MyFilterPipe,
    MyFilterPipe1,
    SplitLastPipe,
    MatMenuModule,
    ConfirmationAlertComponent,
    TreeviewModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class SharedModule {
}
