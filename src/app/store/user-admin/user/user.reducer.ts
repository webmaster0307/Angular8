import * as UserActions from './user.action';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { User } from './user.model';

export interface UserState extends EntityState<User> {
  // additional entity state properties
  selectedUserId: number | null;
  loading: boolean;
  loaded: boolean;
  error: string;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: UserState = adapter.getInitialState({
  // additional entity state properties
  selectedUserId: null,
  loading: false,
  loaded: false,
  error: ''
});

export function userReducer(
  state = initialState,
  action: UserActions.Actions
): UserState {
  switch (action.type) {
    case UserActions.GET_USER:
      return {
        ...state,
        loading: true,
        loaded: false
      };

    case UserActions.GET_USER_SUCCESS:
      return adapter.addAll(action.payload, {
        ...state,
        loading: false,
        loaded: true
      });

    case UserActions.GET_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case UserActions.ADD_USER:
      return {
        ...state,
        loading: true,
        loaded: false
      };

    case UserActions.ADD_USER_SUCCESS:
      console.log(action.payload);
      return adapter.addOne(action.payload, {
        ...state,
        loading: false,
        loaded: true
      });

    case UserActions.ADD_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
     
      case UserActions.UPDATE_USER:
      return {
        ...state,
        loading: true,
        loaded: false
      };

    case UserActions.UPDATE_USER_SUCCESS:
      return adapter.upsertOne(action.payload, {
        ...state,
        loading: false,
        loaded: true
      });

    case UserActions.UPDATE_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };  
    
    default:
      return state;
  }
}

export const getSelectedUserId = (state: UserState) => state.selectedUserId;

// get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

// select the array of user ids
export const selectUserIds = selectIds;

// select the dictionary of user entities
export const selectUserEntities = selectEntities;

// select the array of users
export const selectAllUsers = selectAll;

// select the total user count
export const selectUserTotal = selectTotal;
