import { Component, OnInit } from '@angular/core';
import { FormComponent } from '../form/form.component';
import { AppComponent } from '../../../../app.component';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { Router, NavigationEnd, ParamMap, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import * as dateFormat from 'dateformat';
import { HostListener, ChangeDetectorRef, ViewChild } from "@angular/core";
import { MatTableDataSource } from '@angular/material';
import { getISODayOfWeek } from 'ngx-bootstrap/chronos/units/day-of-week';
import { encode } from 'punycode';
import { CommonUtils } from '../../../../common/utils';
import { Http } from '@angular/http';
import { HomeComponent } from 'src/app/home/home.component';
import { Globals2 } from 'src/app/service/globals';
import { Globals } from 'src/app/services/globals';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { ApiService } from 'src/app/service/api/api.service';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { EndUserService } from 'src/app/services/EndUser-service';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-non-repeatable-form',
  templateUrl: './non-repeatable-form.component.html',
  styleUrls: ['./../../../../../assets/css/threepage.css']
})

export class NonRepeatableFormComponent extends FormComponent implements OnInit {
  // 10th April added two row
  rows = [0];
  totalRow = 1;
  // domain_name = this.globals.domain_name;
  //  private apiUrlGet = "https://" + this.domain_name + "/rest/v1/secured?";
  public param: any;
  mobileView = false;
  editing = true;
  input: any[] = [];
  V_PVP: any;
  Field_Length: any;
  currentDate: string;
  PVP_Updated: any = {};
  date_value: any;
  dateEntry: any;
  screenHeight: number;
  screenWidth: number;
  desktopView: boolean = true;
  @ViewChild('nrpForm') nrpForm: any;
  navigationSubscription;
  private apiUrlGetSecure = this.apiService.endPoints.secure;

  constructor(
    public StorageSessionService: StorageSessionService,
    public app: HomeComponent,
    public globalUser: Globals2,
    public https: Http,
    public http: HttpClient,
    public router: Router,
    public globals: Globals,
    public cdr: ChangeDetectorRef,
    public apiService: ApiService,
    public configService: ConfigServiceService,
    public toasterService: ToastrService,
    private endUserService: EndUserService,
    private activatedRoute: ActivatedRoute,

  ) {
    super(StorageSessionService, http, https, router, globals, app, cdr, apiService, globalUser, configService, toasterService);
    // 10th April
    this.navigationSubscription = router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        // alert('e'+e.urlAfterRedirects);
        this.registerDataChangeHandler(this.updateInput.bind(this));
        this.getFormData();
        this.updateInput();
      });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 900) {
      this.mobileView = true;
      this.desktopView = false;
    } else {
      this.mobileView = false;
      this.desktopView = true;
    }
  }
  ngOnInit() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 900) {
      this.mobileView = true;
      this.desktopView = false;
    } else {
      this.mobileView = false;
      this.desktopView = true;
    }
    // 10th April removed set timeout
    // setTimeout(()=>{ this.getFormData();}, 500);
    // 10th April commented
    // this.getFormData();
    // this.updateInput();

  }

  ngOnDestroy() {
    this.navigationSubscription.unsubscribe();
  }
  updateInput() {
    // 10th April added code to display data in form
    for (let i = 0; i < this.RVP_labels.length; i++) {
      this.input[this.RVP_labels[i]] = [];
    }
    this.totalRow = 1;
    this.rows = [0];
    this.cdr.detectChanges();
    var row_present = this.RVP_DataObj[this.RVP_labels[0].split(" ").join("_")].length;
    this.totalRow += row_present;
    for (let i = 1; i < this.totalRow; i++) {
      this.rows.push(i);
    }
    ("Iterations :");
    (this.rows);

    for (let i = 0; i < this.RVP_labels.length; i++) {
      // join("_")
      this.input[this.RVP_labels[i]] = this.RVP_DataObj[this.RVP_labels[i].split(" ").join(" ")][0];
    }
    this.cdr.detectChanges();
    var key_array = Object.keys(this.RVP_DataObj)
    this.Field_Names = '';
    this.Field_Values = '';
    for (let i = 0; i < key_array.length; i++) {
      if (i != 0) {
        this.Field_Names += '|';
        this.Field_Values += '|';
      }
      this.Field_Names += "\"" + key_array[i] + "\"";
      this.Field_Values += "\"" + this.RVP_DataObj[key_array[i]] + "\"";
    }
    // 10th April commented this
    // this.Field_Names = '';
    // this.Field_Values = "";
    // if(this.RVP_Keys){
    //   for (let i = 0; i < this.RVP_Keys.length; i++) {
    //     if (i != 0) {
    //             this.Field_Names += '|';
    //             this.Field_Values += '|';
    //         }
    //         this.Field_Names += "`" + this.RVP_Keys[i] + "`";
    //         this.Field_Values += "'" + this.RVP_DataObj[this.RVP_Keys[i]] + "'";
    //     }
    // }
  }

  Update_value(v: any, n: any) { //v=value and n=paramter name
    n = n.split(" ").join("_")
    // var Field_Names_Ar = ('"`' + n + '`"');
    var Field_Values_Ar = ('"' + v + '"');

    var Field_Names_Ar = n;
    // var Field_Values_Ar = v;
    if (this.V_TABLE_NAME.length && this.V_TABLE_NAME != '') {
      {
        this.apiService.requestSecureApi(this.apiUrlGetSecure + 'V_Table_Name=' + this.V_TABLE_NAME + '&V_Schema_Name=' + this.V_SCHEMA_NAME + '&V_SRVC_CD=' + this.V_SRVC_CD + '&V_PRCS_ID=' + this.V_PRCS_ID + '&V_SRC_CD=' + this.V_SRC_CD + '&V_USR_NM=' + this.V_USR_NM + '&Field_Names=' + Field_Names_Ar + '&Field_Values=' + Field_Values_Ar + '&REST_Service=Forms_Record&Verb=PATCH', 'get').subscribe(
          res => {
          }
        );
      }
    }
  }
  prepareFieldValues() {
    let values = [];
    for (let i = 0; i < this.RVP_Keys.length; i++) {
      const Field_Value = "'" + this.input[this.RVP_labels[i]] + "'";
      values.push(Field_Value);
    }
    return values.join("|");
  }

  onSubmit() {
    if (this.nrpForm.valid) {
      if (this.V_TABLE_NAME !== '') {
        this.submit_formsRecord();
      } else {
        this.build_PVP();
      }
    }
  }

  submit_formsRecord() {
    let body_FORMrec = {
      "Field_Names": this.Field_Names,
      "Field_Values": this.prepareFieldValues(),
      "V_Table_Name": this.PVP['V_Table_Name'] ? this.PVP['V_Table_Name'][0] : '',
      "V_Schema_Name": this.PVP['V_Schema_Name'] ? this.PVP['V_Schema_Name'][0] : '',
      "V_Key_Names": this.PVP['V_Key_Names'] ? this.PVP['V_Key_Names'][0] : '',
      "V_Key_Values": this.PVP['V_Key_Values'] ? this.PVP['V_Key_Values'][0] : '',
      "V_SRVC_CD": this.V_SRVC_CD,
      "V_USR_NM": this.V_USR_NM,
      "V_SRC_CD": this.V_SRC_CD,
      "V_PRCS_ID": this.V_PRCS_ID,
      "REST_Service": "Forms_Record",
      "Verb": "POST"
    }
    // console.log('submit'); // igor
    this.http.post(this.apiUrlGet, body_FORMrec).subscribe(
      res => {
        ("Response:\n" + res);
        this.build_PVP();
        (body_FORMrec);
      });
    err => {
      ("Error in form record post request:\n" + err);
    }
  }

  build_PVP() {
    this.currentDate = dateFormat(new Date(), "ddd mmm dd yyyy hh:MM:ss TT o");
    //-------Update PVP--------//

    for (let i = 0; i < this.RVP_labels.length; i++) {
      let val = this.input[this.RVP_labels[i]];
      if (CommonUtils.isValidValue(val)) {
        val = val.toString();
      }
      this.PVP_Updated[this.RVP_labels[i].split(" ").join("_")] = val;
    }


    let body_buildPVP = {
      "V_USR_NM": this.V_USR_NM,
      "V_EXE_CD": this.Check_RPT_NRPT,
      "V_PRCS_TXN_ID": this.V_PRCS_TXN_ID,
      "V_APP_ID": this.V_APP_ID,
      "V_PRCS_ID": this.V_PRCS_ID,
      "V_SRVC_ID": this.V_SRVC_ID,
      "V_PVP": JSON.stringify(this.PVP_Updated),
      "V_RELEASE_RSN": "Submitted manual input",
      "V_SRC_ID": this.V_SRC_ID,
      "V_OPERATION": "MANUALSUBMIT",
      "V_UNIQUE_ID": this.V_UNIQUE_ID[0],
      "TimeZone": this.currentDate
    }
    // 10th April added for future call after token works

    // const url = this.apiService.securedApiUrl + '/secured/FormSubmit';
    // insecure

    // this.https.post(this.apiService.endPoints.insecureFormSubmit, body_buildPVP).subscribe(
    //   res => {
    //     // console.log(res); //igor
    //     res = res.json();
    //     if (res['RESULT'][0] === 'SUCCESS') {
    //       this.reportCall(body_buildPVP)
    //     }
    //     this.invoke_router(res);
    //   });
    //10th April secured call
    // secure
    this.https.post(this.apiService.endPoints.secureFormSubmit, body_buildPVP, this.apiService.setHeaders()).subscribe(
      (res: any) => {
        if (res._body !== '{}') {
          // console.log(res); //igor
          res = res.json();
          if (res['RESULT'][0] === 'SUCCESS') {
            this.reportCall(body_buildPVP)
          }
          this.invoke_router(res);
        }
        else {
          this.router.navigate(['/End_User'], { skipLocationChange: true });
        }
      });
  }
  reportCall(data) {

    // insecure

    // this.https.post(this.apiService.endPoints.insecureProcessReport, data).subscribe(
    //   res => {
    //     // console.log(res);
    //   });

    // secure
    this.https.post(this.apiService.endPoints.secureProcessReport, data, this.apiService.setHeaders()).subscribe(
      res => {
        // console.log(res);
      });

  }
  onCancel() {
    // console.log('cancelbtn_click', this);
    this.endUserService.processCancel(this.V_SRVC_ID, this.V_PRCS_TXN_ID, this.V_UNIQUE_ID[0]).subscribe(
      res => {
        // console.log('Response:\n', res);
        this.router.navigateByUrl('End_User', { skipLocationChange: true });
      });
  }

}
