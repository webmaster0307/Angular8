import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { userGroup } from '../../../../store/user-admin/user-group/usergroup.model';
import { groupTypeOptions, groupTypeConstant } from '../../useradmin.constants';
import { AddGroupComponent } from '../../user-admin-group/add-group/add-group.component';
import { take, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UseradminService } from '../../../../services/useradmin.service2';
import { OverviewService } from '../overview.service';
import { Subject } from 'rxjs';
import { SortPipe } from 'src/app/shared/pipes/sort.pipe';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
  providers: [SortPipe]
})
export class GroupListComponent implements OnInit, OnDestroy {
  @Input() membershipPermission: boolean;
  @Input() groupPermission: boolean;
  @Input() userPermission: boolean;
  @Input() assignPermission: boolean;
  @Input() controlVariables: any;
  onLoadGroupPermission: any;
  groups: userGroup[];
  groupTypeOptions = this.sortPipe.transform(groupTypeOptions, 'label');
  selectedGroupType;
  // index = this.groupTypeOptions.findIndex(v => v.key == groupTypeConstant.CUSTOM);
  // selectedGroupType = this.groupTypeOptions[this.index];
  V_SRC_CD_DATA: any;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  constructor(
    private dialog: MatDialog,
    private userAdminService: UseradminService,
    public overviewService: OverviewService,
    public sortPipe: SortPipe
  ) {
    this.overviewService.groups$.pipe(takeUntil(this.unsubscribeAll)).subscribe((groups) => {
      this.groups = groups.sort((a, b) => {
        // Use toUpperCase() to ignore character casing
        const genreA = a.V_USR_GRP_CD.toUpperCase();
        const genreB = b.V_USR_GRP_CD.toUpperCase();

        let comparison = 0;
        if (genreA > genreB) {
          comparison = 1;
        } else if (genreA < genreB) {
          comparison = -1;
        }
        return comparison;
      });
    });
    this.overviewService.selectedGroupType$.pipe(takeUntil(this.unsubscribeAll)).subscribe(type => this.selectedGroupType = type);
  }

  ngOnInit() {
    // this.index = this.groupTypeOptions.findIndex(v => v.key == groupTypeConstant.CUSTOM);
    // this.selectedGroupType = this.groupTypeOptions[this.index];
    this.onLoadGroupPermission = this.groupPermission;
    this.controlVariables = this.userAdminService.controlVariables;
    this.changePermissionOnGroupTypeChange();
    this.V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };
  }

  onAddGroupBtnClick(): void {
    this.overviewService.openAddGroupDialog();
  }

  changeGroupType(type): void {
    this.selectedGroupType = type;
    this.changePermissionOnGroupTypeChange();
    this.overviewService.selectGroupType(type);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  changePermissionOnGroupTypeChange() {
    if (this.controlVariables['hide_ControlsofNonCustomGroup'] && this.selectedGroupType.key !== 'CUSTOM' && this.onLoadGroupPermission) {
      this.groupPermission = false;
      this.assignPermission = false;
    } else if (this.onLoadGroupPermission) {
      this.groupPermission = true;
      this.assignPermission = true;
    }
  }
}
