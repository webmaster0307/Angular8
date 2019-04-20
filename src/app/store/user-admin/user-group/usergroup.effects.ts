import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as userGroupActions from './usergroup.action';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { userGroup } from './usergroup.model';
import { UserAdminService } from 'src/app/services/user-admin.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UserGroupEffects {
  constructor(private actions$: Actions, private useradmin: UserAdminService,
              private http: HttpClient) {}

  @Effect({ dispatch: true })
  getUsersGroup$: Observable<Action> = this.actions$.pipe(
    ofType<userGroupActions.getUserGroup>(userGroupActions.GET_USER_GROUP),
    mergeMap((action: userGroupActions.getUserGroup) =>
      this.useradmin.getUserGroups().pipe(
        map(
          (user: userGroup[]) => new userGroupActions.getUserGroupSuccess(user)
        ),
        catchError(err => of(new userGroupActions.getUserGroupFail(err.error)))
      )
    )
  );

  @Effect({ dispatch: true })
  addGroup$: Observable<Action> = this.actions$.pipe(
    ofType<userGroupActions.addUserGroup>(userGroupActions.ADD_USER_GROUP),
    mergeMap((action: userGroupActions.addUserGroup) =>
      this.http.post('https://enablement.us/Enablement/rest/E_DB/SP', action.payload)
        .pipe(
          map(
            () => new userGroupActions.ActionSuccess()
          ),
          catchError(err => of(new userGroupActions.ActionError(err.error)))
        )
      )
    );

  @Effect({ dispatch: true })
  updateGroup$: Observable<Action> = this.actions$.pipe(
    ofType<userGroupActions.UpdateUserGroup>(userGroupActions.UPDATE_USER_GROUP),
    mergeMap((action: userGroupActions.UpdateUserGroup) =>
      this.http.patch('https://enablement.us/Enablement/rest/E_DB/SP', action.payload)
        .pipe(
          map(
            () => new userGroupActions.ActionSuccess()
          ),
          catchError(err => of(new userGroupActions.ActionError(err.error)))
        )
    )
  );

  @Effect({ dispatch: true })
  deleteGroup: Observable<Action> = this.actions$.pipe(
    ofType<userGroupActions.DeleteUserGroup>(userGroupActions.DELETE_USER_GROUP),
    mergeMap((action: userGroupActions.DeleteUserGroup) =>
      this.http.delete('https://enablement.us/Enablement/rest/E_DB/SP?V_USR_GRP_CD='
        + action.payload.V_USR_GRP_CD + '&V_SRC_CD=' + action.payload.V_SRC_CD + '&REST_Service=Group&Verb=DELETE')
        .pipe(
          map(
            () => new userGroupActions.ActionSuccess()
          ),
          catchError(err => of(new userGroupActions.ActionError(err.error)))
        )
    )
  );
}
