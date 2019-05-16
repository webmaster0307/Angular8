import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthorizationData } from 'src/app/store/user-admin/user-authorization/authorization.model';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { AppState } from 'src/app/app.state';
import { Store, select } from '@ngrx/store';
import * as authActions from '../../../store/user-admin/user-authorization/authorization.actions';
import * as authSelectors from '../../../store/user-admin//user-authorization/authorization.selectors';
import { MatRadioChange } from '@angular/material';
import { OptionalValuesService } from 'src/app/services/optional-values.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit, OnDestroy {

  Label: any[] = [];
  user: any[] = [];
  public authValues$: Observable<AuthorizationData[]>;
  addBtn = true;
  updateBtn = false;
  public authData$: Observable<AuthorizationData[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  selecteduser: string;
  authD = new data;
  V_SRC_CD_DATA;
  radioList = ['PROCESS', 'SERVICE', 'EXE', 'ARTIFACT', 'PLATFORM', 'SERVER', 'SLA'];
  authValues: AuthorizationData[] = [];
  filteredAuthValues: AuthorizationData[] = [];
  authValueObj: data;
  applicationValues$: Subscription;
  processValues$: Subscription;
  serviceValues$: Subscription;
  applicationValues = [];
  processValues = [];
  serviceValues = [];
  selectedApplication = [];
  selectedProcess = [];
  addFlag = false;
  radioSelected;
  constructor(
    public noAuthData: NoAuthDataService,
    private store: Store<AppState>,
    private optionalService: OptionalValuesService,
    private http: HttpClient, private apiServcie: ApiService
  ) {
    this.authValueObj = new data();
    this.authValueObj.V_CREATE = 'N';
    this.authValueObj.V_READ = 'N';
    this.authValueObj.V_DELETE = 'N';
    this.authValueObj.V_UPDATE = 'N';
    this.authValueObj.V_EXECUTE = 'N';
    // Label get service
    this.noAuthData.getJSON().subscribe(data => {
      //console.log(data);
      this.Label = data;
    });
  }

  ngOnInit() {
    this.V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };
    this.radioSelected = this.radioList[0];
    this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
    this.authValues$ = this.store.pipe(select(authSelectors.selectAllAutorizationvalues));
    this.error$ = this.store.pipe(select(authSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(authSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(authSelectors.getLoaded));
    this.authValues$.subscribe(data => {
      this.authValues = data;
      this.getFilterData(this.radioSelected);
    });
    this.getApplicationList();
    this.applicationValues$ = this.optionalService.applicationOptionalValue.subscribe(data => {
      if (data != null) {
        this.applicationValues = data;
      }
    });
    this.processValues$ = this.optionalService.processOptionalValue.subscribe(data => {
      if (data != null) {
        this.processValues = data;
      }
    });
    this.serviceValues$ = this.optionalService.serviceOptionalValue.subscribe(data => {
      if (data != null) {
        this.serviceValues = data;
      }
    });
  }
  ngOnDestroy() {
    this.applicationValues$.unsubscribe();
    this.processValues$.unsubscribe();
    this.serviceValues$.unsubscribe();
  }

  selected(index) {
    this.selecteduser = index;
  }

  onAppSelect(event) {
    this.selectedApplication = event.value;
    if (this.radioSelected === 'SERVICE' || this.radioSelected === 'PROCESS') {
      this.authValueObj.V_APP_CD = event.value;
      this.optionalService.getProcessOptionalValue(event.value);
    } else if (this.radioSelected === 'ARTIFACT' || this.radioSelected === 'PLATFORM' || this.radioSelected === 'SERVER' || this.radioSelected === 'SLA') {
      this.authValueObj.V_AUTH_DSC = event.value;
    } else {
      this.authValueObj.V_EXE_TYP = event.value;
    }
  }

  onProcessSelect(event) {
    // this.selectedProcess.push({ 'index': index, 'process': event.value });
    if (this.radioSelected === 'SERVICE') {
      this.authValueObj.V_PRCS_CD = event.value;
    } else {
      this.authValueObj.V_AUTH_DSC = event.value;
    }
    this.optionalService.getServiceOptionalValue(this.selectedApplication, event.value);
  }
  onServiceSelect(event) {
    this.authValueObj.V_AUTH_DSC = event.value;
  }
  getFilterData(data: string) {
    this.filteredAuthValues = [];
    this.filteredAuthValues = this.authValues.filter(v => v['V_AUTH_TYP'] === data);
    if (this.radioSelected === 'ARTIFACT' || this.radioSelected === 'PLATFORM' || this.radioSelected === 'SERVER' || this.radioSelected === 'SLA') {
      if (this.filteredAuthValues.length) {
        this.applicationValues = [];
        this.filteredAuthValues.forEach((ele: any) => {
          if (this.applicationValues.length && (this.applicationValues.indexOf(ele.V_AUTH_DSC) > -1)) {

          } else {
            this.applicationValues.push(ele.V_AUTH_DSC);
          }
        });
      } else {
        this.applicationValues = [];
      }
    } else if (this.radioSelected === 'EXE') {
      if (this.filteredAuthValues.length) {
        this.applicationValues = [];
        this.processValues = [];
        this.filteredAuthValues.forEach((ele: any) => {
          if (this.applicationValues.length && (this.applicationValues.indexOf(ele.V_EXE_TYP) > -1)) {

          } else {
            this.applicationValues.push(ele.V_EXE_TYP);
          }
          if (this.processValues.length && this.processValues.indexOf(ele.V_AUTH_DSC) > -1) {

          } else {
            this.processValues.push(ele.V_AUTH_DSC);
          }
        });
      } else {
        this.applicationValues = [];
        this.processValues = [];
      }
    }
  }
  getApplicationList() {
    this.optionalService.getApplicationOptionalValue();
  }
  addRow() {
    this.addFlag = true;
  }
  onPermissionChange(item, paramter_name) {
    item[paramter_name] = item[paramter_name] === 'Y' ? 'N' : 'Y';
  }
  editTick_click(index) {
    const data = this.filteredAuthValues[index];
    let body = {
      "V_AUTH_DSC": data.V_AUTH_DSC,
      "V_AUTH_TYP": data.V_AUTH_TYP,
      "V_SRC_CD": this.V_SRC_CD_DATA.V_SRC_CD,
      "V_APP_CD": data.V_APP_CD,
      "V_PRCS_CD": data.V_PRCS_CD,
      "V_EXE_TYP": data.V_EXE_TYP,
      "V_READ": data.V_READ,
      "V_UPDATE": data.V_UPDATE,
      "V_DELETE": data.V_DELETE,
      "V_CREATE": data.V_CREATE,
      "V_EXECUTE": data.V_EXECUTE,
      "V_USR_NM": this.optionalService.V_USR_NM,
      "V_COMMNT": '',
      "REST_Service": "Auth",
      "Verb": "POST"
    }
    this.http.post('https://enablement.us/Enablement/rest/v1/securedJSON', body)
      .subscribe(res => {
        this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
      });
    err => {
      ("Error in form record post request:\n" + err);
    }
  }
  delete_click(index) {
    const data = this.filteredAuthValues[index];
    this.http.delete(this.apiServcie.endPoints.securedJSON + `V_AUTH_CD=${data.V_AUTH_CD}&V_AUTH_TYP=${data.V_AUTH_TYP}&V_SRC_CD=${this.V_SRC_CD_DATA.V_SRC_CD}&REST_Service=Auth&Verb=DELETE`)
      .subscribe(res => {
        this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
      });
    err => {
      ("Error in form record post request:\n" + err);
    }
  }
  onAddSubmit() {
    const data = this.authValueObj;
    let body = {
      "V_AUTH_DSC": data.V_AUTH_DSC,
      "V_AUTH_TYP": this.radioSelected,
      "V_SRC_CD": this.V_SRC_CD_DATA.V_SRC_CD,
      "V_APP_CD": data.V_APP_CD,
      "V_PRCS_CD": data.V_PRCS_CD,
      "V_EXE_TYP": data.V_EXE_TYP,
      "V_READ": data.V_READ,
      "V_UPDATE": data.V_UPDATE,
      "V_DELETE": data.V_DELETE,
      "V_CREATE": data.V_CREATE,
      "V_EXECUTE": data.V_EXECUTE,
      "V_USR_NM": this.optionalService.V_USR_NM,
      "V_COMMNT": '',
      "REST_Service": "Auth",
      "Verb": "POST"
    }
    this.http.post('https://enablement.us/Enablement/rest/v1/securedJSON', body)
      .subscribe(res => {
        this.addFlag = false;
        this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
      });
    err => {
      ("Error in form record post request:\n" + err);
    }
  }
  // showAuthData(authData) {
  //   this.authD.AUTH_DSC = authData.AUTH_DSC;
  //   this.authD.create_select = authData.CREATE == 'Y' ? true : false;
  //   this.authD.read_select = authData.READ == 'Y' ? true : false;
  //   this.authD.update_select = authData.UPDATE == 'Y' ? true : false;
  //   this.authD.delete_select = authData.DELETE == 'Y' ? true : false;
  //   this.authD.execute_select = authData.EXECUTE == 'Y' ? true : false;

  // }
  authData(auth) {
    this.authValues$.subscribe(data => {
      this.updateBtn = data.filter(s => s.V_AUTH_CD == auth).length > 0 ? true : false;
      //console.log(this.updateBtn);
      // }
    });
  }
  // checkUncheck(str) {
  //   //console.log(str);
  //   switch (str) {
  //     case 'Read': {
  //       this.authD.read_select = !this.authD.read_select;
  //       this.authD.READ = this.authD.read_select ? 'Y' : 'N';
  //       break;
  //     }
  //     case 'Delete': {
  //       this.authD.delete_select = !this.authD.delete_select;
  //       this.authD.DELETE = this.authD.delete_select ? 'Y' : 'N';
  //       break;
  //     }
  //     case 'Create': {
  //       this.authD.create_select = !this.authD.create_select;
  //       this.authD.CREATE = this.authD.create_select ? 'Y' : 'N';
  //       break;
  //     }
  //     case 'Update': {
  //       this.authD.update_select = !this.authD.update_select;
  //       this.authD.UPDATE = this.authD.update_select ? 'Y' : 'N';
  //       break;
  //     }
  //     default: {
  //       // statements;
  //       break;
  //     }
  //   }
  // }
  onItemSelect(event: MatRadioChange) {
    this.getFilterData(event.value);
    this.addFlag = false;
    this.authValueObj = new data();
  }
}

export class data {
  V_AUTH_CD: string;
  V_AUTH_TYP: string;
  V_SRC_CD: string;
  V_APP_CD: string;
  V_PRCS_CD: string;
  V_EXE_TYP: string;
  V_USR_GRP_CD: string;
  V_READ: string;
  V_UPDATE: string;
  V_DELETE: string;
  V_CREATE: string;
  V_EXECUTE: string;
  V_USR_NM: string;
  V_COMMNT: string;

  AUTH_ID: number;
  APP_ID: number;
  ROLE_ID: string;
  V_AUTH_DSC: string;
  id: number;
  V_AUTH_FLD: number;
  is_selected: boolean;
  is_selected_role: boolean;
}
