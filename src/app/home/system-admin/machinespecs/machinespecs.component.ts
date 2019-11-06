import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTable, MatTableModule, MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef, MatRow, MatRowDef, MatCell, MatCellDef } from '@angular/material/table';
import { MatTabHeader } from '@angular/material/tabs';
import { HostListener } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';

import { SelectionModel } from '@angular/cdk/collections';
import { StorageSessionService } from '../../../services/storage-session.service';
import { ConfigServiceService } from '../../../services/config-service.service';
import { UseradminService } from '../../../services/useradmin.service2';
import { Globals } from '../../../services/globals';

@Component({
  selector: 'app-machine',
  templateUrl: './machinespecs.component.html',
  styleUrls: ['./machinespecs.component.scss']
})
export class MachinespecsComponent implements OnInit {

  V_SRC_CD: string = '';
  V_USR_NM: string = '';
  V_BASE_ID: string[] = null;
  screenHeight = 0;
  screenWidth = 0;
  mobileView = false;
  desktopView = true;
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
  constructor(private http: HttpClient,
    private data2: UseradminService, private globals: Globals,
    private StorageSessionService: StorageSessionService,
    private data: ConfigServiceService) {
    this.onResize();
    this.onpselect = function (index) {
      this.selectedplftyp = index;
      // this.selectedcon = ;
    }
  }

  domain_name = this.globals.domain_name; private apiUrlGet = "https://" + this.domain_name + "/rest/v1/secured?";
  private apiUrlAdd = "https://" + this.domain_name + "/rest/v1/secured";
  private apiUrldelete = "https://" + this.domain_name + "/rest/v1/secured";

  PLF_DATA = [];
  ADDITIONAL_PLF_DATA = [];
  ADDITIONAL_PLF_DATA_ARR = [];
  // PLF_DETAILS = [];
  // PLATFORM_CD = "";
  // PLATFORM_DSC = "";
  // PLATFORM_CAP = "";
  // RATING = "";
  // VRTL_FLG = "";
  // EFF_END_DT_TM = "";
  // EFF_STRT_DT_TM = "";
  // MODESTATUS = "";
  // STATE_FLG = "";

  P = ["RM_NMBR", "RCK_NMBR", "NTWRK_PRT", "WDTH", "WGHT", "VLTG", "AMPR", "PWR", "RAM", "PRCSSR", "PRCSSR_TYP", "LNGTH", "HGHT", "PRCSSR_SPEED", "MMRY_TYP", "NTWRK_STRGE", "BTTRY_BCK_UP", "STREET_NMBR", "STREET_NM1", "STREET_NM2", "CITY", "STATE", "COUNTRY", "ZIP", "PLATFORM_CD", "RESULT"];
  onpselect: Function;
  selectedplftyp: Number;
  // virtual: boolean = false;



  PLF = "";

  Label: any[] = [];
  MachineCode() {
    ("Machine List!");
    this.data.getMachineCode().subscribe(res => {
      ("Machine List!");
      this.PLF_DATA = res.json();
      (this.PLF_DATA);

    });
  }
  additionalMachineDetails(sel_mach) {
    ("Hello");
    ("Machine DETAILS");
    this.data.getAddMachineDetails(sel_mach).subscribe(res => {
      (res.json());
      this.ADDITIONAL_PLF_DATA = res.json();
      (this.P.length);
      (this.ADDITIONAL_PLF_DATA[this.P[24]]);


      for (var i = 0; i < this.P.length; i++) {
        this.ADDITIONAL_PLF_DATA_ARR[i] = { name: this.ADDITIONAL_PLF_DATA[this.P[i]], title: this.Label[this.P[i]] };
      }
      (this.ADDITIONAL_PLF_DATA_ARR);
      // (this.ADDITIONAL_PLF_DATA_ARR);
      // ("Machine List!");
      // this.PLATFORM_CD = sel_mach;
      // this.PLF_DETAILS = res.json();
      // (this.PLF_DETAILS);
      // this.PLATFORM_DSC = this.PLF_DETAILS['PLATFORM_DSC'];
      // this.PLATFORM_CAP = this.PLF_DETAILS['PLATFORM_CAP'];
      // this.RATING = this.PLF_DETAILS['RATING'];
      // this.EFF_STRT_DT_TM = this.PLF_DETAILS['EFF_STRT_DT_TM'];
      // this.EFF_END_DT_TM = this.PLF_DETAILS['EFF_END_DT_TM'];
      // this.VRTL_FLG = this.PLF_DETAILS['VRTL_FLG'];
      // this.MODESTATUS = this.PLF_DETAILS['MODESTATUS'];

      // this.STATE_FLG = this.PLF_DETAILS['STATE_FLG'];

      // if (this.VRTL_FLG == "Y") {
      //   this.virtual = true;
      // }

    });
  }
  ngOnInit() {
    this.V_SRC_CD = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM = JSON.parse(sessionStorage.getItem('u')).USR_NM;
    this.data2.getJSON().subscribe(data2 => {
      this.Label = data2.json();
    })
    this.MachineCode();

  }

}
