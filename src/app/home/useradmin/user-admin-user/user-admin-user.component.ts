import { Component, OnInit, HostListener } from '@angular/core';
import { NoAuthDataService } from '../../../services/no-auth-data.service';

import * as usreActions from '../../../store/user-admin/user/user.action';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { User } from '../../../store/user-admin/user/user.model';
import * as userSelectors from '../../../store/user-admin/user/user.selectors';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { filter } from 'rxjs/operators';
import { AddUser, UpdateUser } from '../../../store/user-admin/user/user.action';
import { UserAdminService } from '../../../services/user-admin.service';
import { UseradminService } from '../../../services/useradmin.service2';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-user-admin-user',
  templateUrl: './user-admin-user.component.html',
  styleUrls: ['./user-admin-user.component.scss']
})
export class UserAdminUserComponent implements OnInit {
  Label: any[] = [];
  user = {
    V_USR_NM: '',
    V_USR_DSC: '',
    V_STS: ''
  };

  emailMessage;

  public users$: Observable<User[]>;
  form: FormGroup;
  addBtn = true;
  updateBtn = false;
  // public userGroups$:Observable<userGroup[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  selecteduser: any;
  selectedid;

  public nameChanged = false;
  protected clonedName = '';

  public descChanged = false;
  protected clonedDesc = '';

  public statusChanged = false;
  protected clonedStatus = '';
  public duplicated = false;
  public totalDuplicated = false;
  public hideButton = false;
  public V_SRC_CD_DATA;

  protected usersList = [];

  protected emailIds: string[] = [];
  public domainError = false;
  public screenHeight = 0;
  public screenWidth = 0;
  public mobileView = false;
  public desktopView = true;
  initial_setup: any;
  domainErrorMsg = '';
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.mobileView = true;
      this.desktopView = false;
    } else {
      this.mobileView = false;
      this.desktopView = true;
    }
  }

  constructor(
    public noAuthData: NoAuthDataService,
    protected store: Store<AppState>,
    protected userAdminService: UseradminService,
    protected httpClient: HttpClient
  ) {
    // Label get service
    this.noAuthData.getJSON().subscribe(data => {
      this.Label = data;
    });
    this.httpClient.get('../../../../assets/initial-setup.json').subscribe(res => {
      this.initial_setup = res;
    });
  }

  ngOnInit() {
    this.V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };
    this.store.dispatch(new usreActions.getUser(this.V_SRC_CD_DATA));
    // this.store.dispatch(new userGroupActions.getUserGroup());
    this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
    // this.userGroups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
    this.error$ = this.store.pipe(select(userSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userSelectors.getLoaded));

    this.users$
      .subscribe((val) => {
        this.usersList = val;
      });

    this.setButtonLabel();
    this.user.V_STS = 'ACTIVE';
  }

  getUserDetails(user) {
    this.user.V_USR_NM = user.V_USR_NM;
    this.user.V_USR_DSC = user.V_USR_DSC;
    this.user.V_STS = user.V_STS;
    // this.addBtn = true;
  }

  availableGroupValueChange(usr) {
    // debugger
    this.users$.subscribe(data => {
      if (data.length) {
        const newArray = data.filter(item => item.V_USR_NM == usr);
        this.addBtn = newArray.length == 0 ? false : true;
      }
    });
  }

  selected(index) {
    this.selecteduser = index.toString();
    this.clonedName = this.user.V_USR_NM;
    this.clonedDesc = this.user.V_USR_DSC;
    this.clonedStatus = this.user.V_STS;
    this.updateBtn = true;
    this.statusChanged = false;
    this.nameChanged = false;
    this.descChanged = false;
    this.setButtonLabel();
  }

  selectedId(id) {
    this.selectedid = id;
  }

  downloadFile() {
    this.userAdminService.downloadFile('UserDL.xlsx');
  }

  uploadData() {
    document.getElementById('Document_File').click();
  }

  addUser() {

    const data = {
      V_USR_NM: this.user.V_USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_USR_DSC: this.user.V_USR_DSC,
      V_STS: this.user.V_STS != '' ? this.user.V_STS : 'Active',
    };
    this.store.dispatch(new AddUser(data));
  }

  public updateUser() {
    const data = {
      V_USR_NM: this.user.V_USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_USR_DSC: this.user.V_USR_DSC,
      V_STS: this.user.V_STS,
      REST_Service: 'User',
      Verb: 'PATCH',
      id: this.selectedid
    };
    this.store.dispatch(new UpdateUser(data));
  }

  statusChange() {
    if (this.selecteduser) {
      this.updateBtn = true;
    }
    if (this.clonedStatus !== this.user.V_STS) {
      this.statusChanged = true;
      this.updateBtn = true;
    } else {
      this.statusChanged = false;
    }
    this.checkDuplications();
  }

  protected setButtonLabel() {
    if (this.selecteduser === 0) {
      this.updateBtn = true;
    } else {
      this.updateBtn = !!this.selecteduser;
    }
  }

  public nameModelChanged() {
    if (this.clonedName.toLowerCase() !== this.user.V_USR_NM.toLowerCase()) {
      this.nameChanged = true;
      this.updateBtn = false;
    } else {
      this.nameChanged = false;
      this.updateBtn = true;
    }
    this.checkUserDomain();
    this.checkDuplications();
  }

  public descModelChanged() {
    if (this.clonedDesc !== this.user.V_USR_DSC) {
      if (this.nameChanged == false) {
        this.descChanged = true;
        this.updateBtn = true;
      }
    } else {
      this.descChanged = false;
      this.updateBtn = false;
    }
    this.checkDuplications();
  }

  public checkDuplications() {
    for (let i = 0; i < this.usersList.length; i++) {
      if (this.usersList[i].V_USR_NM === this.user.V_USR_NM) {
        this.duplicated = true;
        this.updateBtn = true;
        this.hideButton = true;
        this.deepCheck();
        return;
      } else {
        this.duplicated = false;
        this.hideButton = false;
      }
    }
  }

  protected deepCheck() {
    if (this.duplicated) {
      for (let i = 0; i < this.usersList.length; i++) {
        if (this.usersList[i].V_STS === this.user.V_STS && this.usersList[i].V_USR_DSC === this.user.V_USR_DSC) {
          this.totalDuplicated = true;
          return;
        } else {
          this.totalDuplicated = false;
        }
      }
    }
  }

  protected checkUserDomain() {
    this.emailIds = this.initial_setup.restricted_email_id;
    let index_start = this.user.V_USR_NM.indexOf("@");
    let index_end = this.user.V_USR_NM.indexOf(".");
    let sub_string = this.user.V_USR_NM.substring(index_start + 1, index_end);
    for (let i = 0; i < this.emailIds.length; i++) {
      if (this.user.V_USR_NM.indexOf(this.emailIds[i]) > -1) {
        this.domainErrorMsg = `${this.user.V_USR_NM} email can not be used.`;
        this.domainError = true;
        return;
      } else {
        this.domainError = false;
      }
    }
  }

  fileChangeEvent(event: any, file: any) {
    const fileList: FileList = event.target.files;
    ('====================');
    (fileList.item(0));
    this.userAdminService.fileUpload(fileList.item(0), 'UserDL.xlsx', 'user').subscribe(
      res => {
        (res);
        setTimeout(() => {
          //this.getUser();
          this.store.dispatch(new usreActions.getUser(this.V_SRC_CD_DATA));
        }, 3000);
      },
      error => {
        console.error(error);

      }
    );
  }

  onUserSelect(user, index): void {
    if (this.mobileView) {
      this.getUserDetails(user);
      this.selected(index);
    } else {
      this.getUserDetails(user);
      this.selected(index);
      this.selectedId(user.id);
    }
  }

}
