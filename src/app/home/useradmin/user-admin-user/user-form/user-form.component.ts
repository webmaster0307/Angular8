import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators, EmailValidator } from '@angular/forms';
import { User } from '../../../../store/user-admin/user/user.model';
import { userStatusConstants, userStatusOptions } from '../../useradmin.constants';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as userSelectors from '../../../../store/user-admin/user/user.selectors';
import { HttpClient } from '@angular/common/http';
import { userGroup } from 'src/app/store/user-admin/user-group/usergroup.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnChanges {

  @Input() user: User;
  @Input() users: User[];
  @Input() group: userGroup;

  userForm: FormGroup;
  userStatusOptions = userStatusOptions;
  protected emailIds: string[] = [];
  initial_setup: any;

  constructor(protected store: Store<AppState>, protected httpClient: HttpClient) {
    this.httpClient.get('../../../../../assets/initial-setup.json').subscribe(res => {
      this.initial_setup = res;
    });
    this.userForm = new FormGroup({
      V_USR_NM: new FormControl('', [Validators.required, Validators.email]),
      V_SRC_CD: new FormControl(JSON.parse(sessionStorage.getItem('u')).SRC_CD, [Validators.required]),
      V_USR_DSC: new FormControl(''),
      V_STS: new FormControl(userStatusConstants.ACTIVE, Validators.required),
      V_IS_PRIMARY: new FormControl(false),
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('user') && changes.hasOwnProperty('group')) {
      this.setFormValue(this.user, this.group);
    }
    if (changes.hasOwnProperty('users')) {
      this.userForm.get('V_USR_NM').setValidators([Validators.required, Validators.email, userNameValidator(this.users), this.userNameGroupValidator()]);
    }
  }

  get f() { return this.userForm.controls; }

  setFormValue(user: User, group: userGroup): void {
    this.userForm.setValue({
      V_USR_NM: user.V_USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_USR_DSC: user.V_USR_DSC,
      V_STS: user.V_STS != '' ? user.V_STS : userStatusConstants.ACTIVE,
      V_IS_PRIMARY: group.V_IS_PRIMARY[group.V_USR_ID.indexOf(Number(user.id))] === 'Y',
    });
    this.userForm.get('V_USR_NM').disable({ onlySelf: true, emitEvent: false });
  }

  isValid(): boolean {
    return this.userForm.valid;
  }

  getValue(): any {
    const formValue = this.userForm.value;
    return {
      V_USR_NM: formValue.V_USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_USR_DSC: formValue.V_USR_DSC,
      V_STS: formValue.V_STS != '' ? formValue.V_STS : userStatusConstants.ACTIVE,
      V_IS_PRIMARY: formValue.V_IS_PRIMARY ? 'Y' : 'N',
    };
  }

  hasUser(userName: string): boolean {
    return !!this.users.filter(user => user.V_USR_NM.toLowerCase() === userName.toLowerCase()).length;
  }
  userNameGroupValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      this.emailIds = this.initial_setup != undefined ? this.initial_setup.restricted_email_id : [];
      for (let i = 0; i < this.emailIds.length; i++) {
        if (control.value.indexOf(this.emailIds[i]) > -1) {
          return {
            groupError: {
              userName: true
            }
          };
        } else {
          return null;
        }
      }
    };
  }


}

export function userNameValidator(allUsers: User[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (allUsers && control.value && (!!allUsers.filter(user => user.V_USR_NM.toLowerCase() === control.value.toLowerCase()).length)) {
      return {
        userError: {
          userName: true
        }
      };
    }
    return null;
  };
}
