import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseradminComponent } from './useradmin.component';
import { UserAdminUserComponent } from './user-admin-user/user-admin-user.component';
import { UseradminRoutingModule } from './useradmin-routing.module';
import { MatIconModule, MatListModule } from '@angular/material';

@NgModule({
  declarations: [UseradminComponent, UserAdminUserComponent],
  imports: [
    MatIconModule,
    MatListModule,
    CommonModule,
    UseradminRoutingModule
  ]
})
export class UseradminModule { }
