import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { userMemberShip } from 'src/app/store/user-admin/user-membership/usermembership.model';
import { Observable } from 'rxjs';

import * as usreActions from '../../../store/user-admin/user/user.action';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { User } from '../../../store/user-admin/user/user.model';
import * as userSelectors from '../../../store/user-admin/user/user.selectors';
import * as userGroupSelectors from '../../../store/user-admin/user-group/usergroup.selectors';
import * as userGroupActions from '../../../store/user-admin/user-group/usergroup.action';
import { userGroup } from 'src/app/store/user-admin/user-group/usergroup.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { userRole } from 'src/app/store/user-admin/user-role/userrole.model';
import * as userRoleSelectors from '../../../store/user-admin/user-role/userrole.selectors';
import * as userRoleActions from '../../../store/user-admin/user-role/userrole.action';


@Component({
  selector: 'app-assignrole',
  templateUrl: './assignrole.component.html',
  styleUrls: ['./assignrole.component.scss']
})
export class AssignroleComponent implements OnInit {
  Label: any[] = [];
  user: any[] = [];
  roledesc;
  public userGroup$: Observable<userGroup[]>;
  public roles$: Observable<userRole[]>;
  selectedOptions;
  RollR;

  addBtn = true;
  updateBtn = false;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  selecteduser: string;
  selectedgroup: string;

  constructor(
    public noAuthData: NoAuthDataService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });
    // this.store.dispatch(new usreActions.getUser());
    this.store.dispatch(new userGroupActions.getUserGroup());
    this.store.dispatch(new userRoleActions.getUserRole());
    this.userGroup$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
    this.roles$ = this.store.pipe(select(userRoleSelectors.selectAllUserRoles));

    this.error$ = this.store.pipe(select(userRoleSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userRoleSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userRoleSelectors.getLoaded));

  }
  selectedRole(role, index) {
    console.log(role);
    this.roles$.subscribe(roles => {
      roles.forEach(rolesArray => {
        //rolesArray.is_selected_usr_grp = false;

      });
    });
    this.selecteduser = index;
    if (role.USR_GRP_ID.length > 0) {
     this.userGroup$.subscribe(data => {
       data.forEach(ele => {
         role.USR_GRP_ID.forEach(element => {
          if (ele.USR_GRP_ID == element) {
            console.log(ele);
            //ele.is_selected_usr_grp = true;
          }
         });

       });
     });
    }
  }

  selectedGroup(group, index) {
    this.selectedgroup = index;
    console.log(group);
  //  this.roles$.subscribe(groups=>{
  //   groups.forEach(groupsArray=>{
  //     groupsArray['is_selected_role'] = false
  //   })
  // })
  // if(group['ROLE_ID'].length > 0){
  //  this.roles$.subscribe(data=>{
  //    data.forEach(ele=>{
  //     group['ROLE_ID'].forEach(element => {
  //       // console.log(group)
  //       if(ele['ROLE_ID'] == element){
  //         console.log(ele)
  //         ele['is_selected_role'] = true
  //       }
  //      });

  //    })
  //  })
  // }
  }

  addBothfield() {
    
  }
}
