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
  applicationValues$: Subscription;
  processValues$: Subscription;
  serviceValues$: Subscription;
  applicationValues = [];
  processValues = [];
  serviceValues = [];
  selectedApplication = [];
  selectedProcess = [];
  addFlag = false;
  constructor(
    public noAuthData: NoAuthDataService,
    private store: Store<AppState>,
    private optionalService: OptionalValuesService
  ) {
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
    this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
    this.authValues$ = this.store.pipe(select(authSelectors.selectAllAutorizationvalues));
    this.error$ = this.store.pipe(select(authSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(authSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(authSelectors.getLoaded));
    this.authValues$.subscribe(data => {
      this.authValues = data;
      this.getFilterData(this.radioList[0]);
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

  onAppSelect(event, index) {
    console.log('value', event.value);
    this.selectedApplication.push({ 'index': index, 'app': event.value });
    this.optionalService.getProcessOptionalValue(event.value);
  }

  onProcessSelect(event, index) {
    console.log('value', event.value);
    this.selectedProcess.push({ 'index': index, 'process': event.value });
    this.optionalService.getServiceOptionalValue(this.selectedApplication[index].app, event.value);
  }
  getFilterData(data: string) {
    this.filteredAuthValues = [];
    this.filteredAuthValues = this.authValues.filter(v => v['V_AUTH_TYP'] === data);
  }
  getApplicationList() {
    this.optionalService.getApplicationOptionalValue();
  }

  showAuthData(authData) {
    this.authD.AUTH_DSC = authData.AUTH_DSC;
    this.authD.create_select = authData.CREATE == 'Y' ? true : false;
    this.authD.read_select = authData.READ == 'Y' ? true : false;
    this.authD.update_select = authData.UPDATE == 'Y' ? true : false;
    this.authD.delete_select = authData.DELETE == 'Y' ? true : false;
    this.authD.execute_select = authData.EXECUTE == 'Y' ? true : false;
    
  }
  authData(auth) {
    this.authValues$.subscribe(data => {
      this.updateBtn = data.filter(s => s.AUTH_CD == auth).length > 0 ? true : false;
      //console.log(this.updateBtn);
      // }
    });
  }
  checkUncheck(str) {
    //console.log(str);
    switch (str) {
      case 'Read': {
        this.authD.read_select = !this.authD.read_select;
        this.authD.READ = this.authD.read_select ? 'Y' : 'N';
        break;
      }
      case 'Delete': {
        this.authD.delete_select = !this.authD.delete_select;
        this.authD.DELETE = this.authD.delete_select ? 'Y' : 'N';
        break;
      }
      case 'Create': {
        this.authD.create_select = !this.authD.create_select;
        this.authD.CREATE = this.authD.create_select ? 'Y' : 'N';
        break;
      }
      case 'Update': {
        this.authD.update_select = !this.authD.update_select;
        this.authD.UPDATE = this.authD.update_select ? 'Y' : 'N';
        break;
      }
      default: {
        // statements;
        break;
      }
    }
  }
  onItemSelect(event: MatRadioChange) {
    this.getFilterData(event.value);
  }
}

export class data {
  APP_ID: number;
  AUTH_CD: string;
  AUTH_DSC: string;
  AUTH_FLD: number;
  ROLE_ID: any;
  AUTH_ID: number;
  CREATE: string;
  create_select: boolean;

  DELETE: string;
  delete_select: boolean;

  EXECUTE: string;
  execute_select: boolean;

  READ: string;
  read_select: boolean;

  UPDATE: string;
  update_select: boolean;

  id: number;
  is_selected: boolean;
  is_selected_role: boolean;
}
