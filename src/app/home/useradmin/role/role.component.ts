import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { Observable } from 'rxjs';
import { userRole } from 'src/app/store/user-admin/user-role/userrole.model';
import * as userRoleSelectors from '../../../store/user-admin/user-role/userrole.selectors';
import * as userRoleActions from '../../../store/user-admin/user-role/userrole.action';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import {addUserGroup, UpdateUserGroup} from '../../../store/user-admin/user-group/usergroup.action';
import {AddUserRole, DeleteUserRole, UpdateUserRole} from '../../../store/user-admin/user-role/userrole.action';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  Label: any[] = [];
  userRoles$: Observable<userRole[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  roleData = new roleData;
  selecteduser: string;

  updateBtn = false;

  public nameChanged = false;
  private clonedName = '';

  public descChanged = false;
  private clonedDesc = '';

  public duplicated = false;
  private roleList = [];

  constructor(
    public noAuthData: NoAuthDataService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });
    this.store.dispatch(new userRoleActions.getUserRole());
    this.userRoles$ = this.store.pipe(select(userRoleSelectors.selectAllUserRoles));
    this.error$ = this.store.pipe(select(userRoleSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userRoleSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userRoleSelectors.getLoaded));

    this.userRoles$
      .subscribe((val) => {
        this.roleList = val;
      });

    this.setButtonLabel();
  }
  getRollData(roleSelectData) {
    this.roleData = roleSelectData;
  }
  selected(index) {
    this.selecteduser = index;
    this.setButtonLabel();
    this.clonedName = this.roleData.V_ROLE_CD;
    this.clonedDesc = this.roleData.V_ROLE_DSC;
    this.updateBtn = true;
    this.nameChanged = false;
    this.descChanged = false;
  }

  private setButtonLabel() {
    this.updateBtn = !!this.selecteduser;
  }

  public addRole() {
    const data = {
      V_ROLE_CD: this.roleData.V_ROLE_CD,
      V_ROLE_DSC: this.roleData.V_ROLE_DSC,
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      REST_Service: 'Role',
      Verb: 'POST'
    };
    this.store.dispatch(new AddUserRole(data));
  }

  public updateRole() {
    const data = {
      V_ROLE_CD: this.roleData.V_ROLE_CD,
      V_ROLE_DSC: this.roleData.V_ROLE_DSC,
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      REST_Service: 'Role',
      Verb: 'PATCH'
    };
    this.store.dispatch(new UpdateUserRole(data));
  }

  public deleteRole() {
    console.log('delete');
    const data = {
      V_ROLE_CD: this.roleData.V_ROLE_CD,
      V_ROLE_DSC: this.roleData.V_ROLE_DSC,
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      REST_Service: 'Role',
      Verb: 'DELETE'
    };

    this.store.dispatch(new DeleteUserRole(data));
  }

  changeRole() {
    // const x = roleData.ROLE_CD;
    // if (this.roleData != null) {
    //   this.userRoles$.subscribe(data => {
    //     const result = data.filter(s => s.ROLE_CD == x);
    //     console.log(result);
    //   });
    // }
  }

  public nameModelChanged() {
    if (this.clonedName !== this.roleData.V_ROLE_CD) {
      this.nameChanged = true;
      this.updateBtn = false;
    } else {
      this.nameChanged = false;
      this.updateBtn = true;
    }
    this.checkDuplications();
  }

  public descModelChanged() {
    if (this.clonedDesc !== this.roleData.V_ROLE_DSC) {
      this.descChanged = true;
      this.updateBtn = !this.nameChanged;
    } else {
      this.descChanged = false;
    }
  }

  public checkDuplications() {
    for (let i = 0; i < this.roleList.length; i++) {
      if (this.roleList[i].V_ROLE_CD === this.roleData.V_ROLE_CD) {
        this.duplicated = true;
        return;
      } else {
        this.duplicated = false;
      }
    }
  }

}

export class roleData {
  ROLE_CD: string;
  V_ROLE_CD: string;
ROLE_DSC: string;
V_ROLE_DSC: string;
ROLE_ID: number;
USR_GRP_ID: any;
id: number;
is_selected: boolean;
is_selected_usr_grp: boolean;
}
