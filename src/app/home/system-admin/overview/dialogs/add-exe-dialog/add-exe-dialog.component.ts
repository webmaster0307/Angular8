import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ConfigServiceService } from '../../../../../services/config-service.service';
import { SystemAdminOverviewService } from '../../system-admin-overview.service';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-add-exe-dialog',
  templateUrl: './add-exe-dialog.component.html',
  styleUrls: ['./add-exe-dialog.component.scss']
})
export class AddExeDialogComponent implements OnInit {
  F_EXE_CD: string = '';
  F_EXE_DSC: string = '';
  F_EXE_SIGN: string = '';
  domain_name = environment.domainName;
  V_SRC_CD = '';
  V_USR_NM = '';
  F_EXE_OUT_PARAM: string;
  F_EXE_VRSN: string = "1.0";
  F_SYNC_FLG: string = "Y";
  F_EXE_S_DLMTR: string = '';
  F_EXE_E_DLMTR: string = '';
  PLF_DSC: string = 'Apache Tomcat Web Server';
  ipart: boolean = false;
  opart: boolean = false;
  PLF_TYPE = [];
  PLF_CD: string = "Amazon";
  V_ICN_TYP;
  ICN_TYP;
  PLF_DATA;
  exesData = [];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  isExeExist: boolean = true;

  constructor(public dialogRef: MatDialogRef<AddExeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private config: ConfigServiceService, public SystemAdminOverviewService: SystemAdminOverviewService) { }

  ngOnInit() {
    this.V_SRC_CD = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM = JSON.parse(sessionStorage.getItem('u')).USR_NM;
    this.config.getPlatformType().subscribe(res => {
    this.PLF_TYPE = res.json();
      (this.PLF_TYPE);
      // this.PLF_CD=this.PLF_TYPE['SERVER_CD'];
    });

    this.config.getICN().subscribe(res => {
      this.V_ICN_TYP = res;
    });

    this.PLF_CD = this.data.platformData.SERVER_CD;
    this.PLF_DSC = this.data.platformData.SERVER_DSC;
    this.exesData = this.SystemAdminOverviewService.exesData;
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.exesData.filter(option => option.V_EXE_CD.toLowerCase().includes(filterValue));
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  platformDescription() {

    this.config.getPlatformDescription(this.PLF_CD).subscribe(
      res => {
        this.PLF_DATA = res.json();
        (this.PLF_DATA);
        this.PLF_DSC = this.PLF_DATA['SERVER_DSC'];
      });
  }

  selectedExe(exe) {

  }

  exeChange() {
    let find = false;
    this.exesData.filter(option => {
      if (option.V_EXE_CD.toLowerCase() == this.F_EXE_CD.toLowerCase()) {
        find = true;
      }
    });

    if (find) {
      this.isExeExist = true;
    } else {
      this.isExeExist = false;
    }
  }

  onBtnAddClick() {
    let Input = '';
    let Output = '';
    if (this.ipart) {
      Input = "Y"
    } else {
      Input = "N"
    }

    if (this.opart) {
      Output = "Y"
    } else {
      Output = "N"
    }
    let data = {
      "V_EXE_CD": this.F_EXE_CD,
      "V_SRC_CD": this.V_SRC_CD,
      "V_EXE_SIGN": this.F_EXE_SIGN,
      "V_PARAM_DLMTR_STRT": this.F_EXE_S_DLMTR,
      "V_PARAM_DLMTR_END": this.F_EXE_E_DLMTR,
      "V_EXE_VRSN": this.F_EXE_VRSN,
      "V_EXE_TYP": this.data.EXE_TYP,
      "V_SYNC_FLG": this.F_SYNC_FLG,
      "V_EXE_DSC": this.F_EXE_DSC,
      "V_EXE_OUT_PARAMS": this.F_EXE_OUT_PARAM,
      "V_USR_NM": this.V_USR_NM,
      "V_EXE_IN_ARTFCTS": Input,
      "V_EXE_OUT_ARTFCTS": Output,
      "V_SERVER_CD": this.PLF_CD,
      "V_COMMNT": '',
      "V_ICN_TYP": this.ICN_TYP,
      "REST_Service": ["Exe"],
      "Verb": ["PUT"]
    }
    this.http.put('https://' + this.domain_name + '/rest/v1/securedJSON?', data).subscribe(res => {
      console.log("res", res);
      this.dialogRef.close(true);
    }, err => {

    })
  }
}
