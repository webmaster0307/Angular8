import { Action } from '@ngrx/store'
import { userInfo } from './userinfo.model';

export const USER_LOGIN = 'User login';
export const USER_LOGIN_SUCCESS = 'User login Success';
export const USER_LOGIN_FAIL = 'User login Fail';

export class userLogin implements Action {
    readonly type = USER_LOGIN
    constructor(public payload: any) {
        console.log(payload);
    }
}

export class userLoginSuccess implements Action {
    readonly type = USER_LOGIN_SUCCESS
    constructor(public payload: userInfo) {
        console.log(payload);
    }
}

export class userLoginFail implements Action {
    readonly type = USER_LOGIN_FAIL

    constructor(public payload: string) {}
}

export type Actions = userLogin 
| userLoginSuccess
| userLoginFail