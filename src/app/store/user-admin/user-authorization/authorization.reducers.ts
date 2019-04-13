import * as AuthActions from './authorization.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { AuthorizationData } from './authorization.model';

export interface AuthState extends EntityState<AuthorizationData> {
    // additional entity state properties
    selectedAuthId: number | null;
    loading:boolean,
    loaded:boolean,
    error:string
}

export const adapter: EntityAdapter<AuthorizationData> = createEntityAdapter<AuthorizationData>();


export const initialState: AuthState = adapter.getInitialState({
    // additional entity state properties
    selectedAuthId: null,
    loading:false,
    loaded:false,
    error:''
  });

export function authReducer(state = initialState, action: AuthActions.Actions):AuthState {

    switch(action.type) {

        case AuthActions.GET_AUTH:
        return {
            ...state,
            loading:true,
            loaded:false
        }

        case AuthActions.GET_AUTH_SUCCESS:
        return adapter.addAll(action.payload, {
            ...state,
            loading:false,
            loaded:true
        });

        case AuthActions.GET_AUTH_FAIL:
        return {
            ...state,
            loading:false,
            error:action.payload
        }
        
        default:
            return state;
    }
}

export const getSelectedAuthId = (state: AuthState) => state.selectedAuthId;
 
// get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
 
// select the array of auth ids
export const selectAuthIds = selectIds;
 
// select the dictionary of auth entities
export const selectAuthEntities = selectEntities;
 
// select the array of authdata
export const selectAllAuthvalues = selectAll;
 
// select the total auth count
export const selectAuthCount = selectTotal;