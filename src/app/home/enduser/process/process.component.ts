import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource, MatSelectChange } from '@angular/material';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

import { EVENT_MANAGER_PLUGINS } from '../../../../../node_modules/@angular/platform-browser';
import { Globals } from 'src/app/services/globals';
import { RollserviceService } from 'src/app/services/rollservice.service';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { GetMessageService } from 'src/app/services/get-message.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { OptionalValuesService, ProcessObservable, ServiceObservable } from 'src/app/services/optional-values.service';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  // styleUrls: ['../../../../assets/css/threepage.css']
})
export class ProcessComponent implements OnInit, OnDestroy {
  applicationValues$: Subscription;
  processValues$: Subscription;
  serviceValues$: Subscription;
  domain_name = this.globals.domain_name;
  private apiUrlGet = "https://" + this.domain_name + "/rest/v1/secured?";
  private apiUrlAdd = "https://" + this.domain_name + "/rest/v1/secured";
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  APP_CD = [];
  PRCS_CD = [];
  SRVC_CD = [];
  APP_SEL_PRCS;
  APP_SEL_PRCS_ARR;
  APP_SEL_PRCS_ARR_final;
  selectedapp: string = null;
  selectedprcs: string = null;
  selectedsrvc: string = null;
  modifing;
  applicationValuesObservable = [];
  processValuesObservable: ProcessObservable[] = [];
  serviceValuesObservable: ServiceObservable[] = [];
  flag = true;
  timer: any;


  constructor(private Router: Router,
    private http: HttpClient,
    private https: Http,
    private StorageSessionService: StorageSessionService,
    private data: ConfigServiceService,
    private roll: RollserviceService,
    public resp: GetMessageService,
    public deviceService: DeviceDetectorService,
    private webSocket: WebSocketService,
    private globals: Globals,
    private optionalService: OptionalValuesService
  ) {
    this.applicationValues$ = this.optionalService.applicationOptionalValue.subscribe(data => {
      if (data != null) {
        this.applicationValuesObservable = data;
        this.APP_CD = (data.sort(function (a, b) { return a.localeCompare(b); }));
      }
    });
    this.processValues$ = this.optionalService.processOptionalValue.subscribe(data => {
      if (data != null) {
        this.processValuesObservable = data;
        if (this.processValuesObservable.length) {
          if (this.selectedapp !== '') {
            this.processValuesObservable.forEach(ele => {
              if (ele.app === this.selectedapp) {
                this.PRCS_CD = (ele.process.sort(function (a, b) { return a.localeCompare(b); }));
              }
            });
          }
        }
      }
    });
    this.serviceValues$ = this.optionalService.serviceOptionalValue.subscribe(data => {
      if (data != null) {
        this.serviceValuesObservable = [];
        this.serviceValuesObservable = data;
        if (this.serviceValuesObservable.length) {
          if (this.selectedapp !== '' && this.selectedprcs !== '') {
            this.serviceValuesObservable.forEach(ele => {
              if (ele.app === this.selectedapp && ele.process === this.selectedprcs) {
                this.SRVC_CD = (ele.service.sort(function (a, b) { return a.localeCompare(b); }));
              }
            });
          }
        }
      }
    });
  }


  ngOnInit() {
    if (!this.applicationValuesObservable.length) {
      this.functionapplist();
    }


  }
  ngOnDestroy() {
    this.applicationValues$.unsubscribe();
    this.processValues$.unsubscribe();
    this.serviceValues$.unsubscribe();
  }

  sendMessage() {
    //this.resp.sendResponse("Hi There....");
    /*this.webSocket.listenOn="102";
    this.webSocket.sendOnKey="102";
    this.resp.getMessage.subscribe(res =>{
      //res.text.PRCS_TXN_ID

        clearInterval(this.timer);
        this.webSocket.socket.removeAllListeners(this.webSocket.listenOn);
        //this.webSocket.reconnectSocket();

    });


    var i=0;

    this.timer= setInterval(function(){i++; (i+" seconds passed");},1000);
    this.http.get<any>("https://enablement.us/rest/v1/secured?V_SRC_ID=205&V_APP_ID=143&V_PRCS_ID=311&V_PRCS_TXN_ID=8752&REST_Service=ProcessStatus&Verb=GET").subscribe(
      res=>{
        var proc=this;

        setTimeout(function(){proc.resp.sendMessage(res);

       //   proc.flag=false;

        },5000);
      }
    )
    //this.resp.sendMessage("Hello");
      */
  }
  recr_() {
    this.http.get<any>("https://enablement.us/rest/v1/secured?V_SRC_ID=205&V_APP_ID=143&V_PRCS_ID=311&V_PRCS_TXN_ID=8752&REST_Service=ProcessStatus&Verb=GET").subscribe(
      res => {

        if (this.flag)
          this.recr_();
      }
    );
  }

  clickme(app, i, evt) {
    this.selectedapp = app;
    this.functionprocesslist();
    // this.APP_SEL_PRCS_ARR_final = [];
    // this.selectedapp = app;
    // let index = this.APP_CD.indexOf(this.selectedapp);
    // (<HTMLElement>document.querySelectorAll("mat-list")[1]).style.display = "block";
    // (<HTMLElement>document.querySelectorAll("mat-list")[2]).style.display = "none";
    // this.selectedsrvc = null;
    // this.APP_SEL_PRCS = this.PRCS_CD[index];
    // this.APP_SEL_PRCS_ARR = this.APP_SEL_PRCS.split(',')
    // for (let i = 0; i < this.APP_SEL_PRCS_ARR.length; i++) {
    //   this.modifing = this.APP_SEL_PRCS_ARR[i].split('\'')
    //   this.modifing.shift()
    //   this.modifing.pop();
    //   this.modifing.join();
    //   this.APP_SEL_PRCS_ARR_final.push(this.modifing[0]);

    // }
  }
  clickme1(u, evt) {
    this.selectedprcs = u;
    // (<HTMLElement>document.querySelectorAll("mat-list")[2]).style.display = "block";
    this.functionserviceslist();
  }
  clickme2(u, evt) {
    this.selectedsrvc = u;
  }
  // ----------- get Applications ------------
  functionapplist() {

    if (!this.applicationValuesObservable.length) {
      this.optionalService.getApplicationOptionalValue();
    }
    // this.http.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=ApplicationProcesses&Verb=GET").subscribe(
    //   res => {

    //     this.APP_CD = this.APP_CD.concat(res.APP_CD.sort(function (a, b) { return a.localeCompare(b); }));
    //     this.PRCS_CD = this.PRCS_CD.concat(res.PRCS_CD.sort(function (a, b) { return a.localeCompare(b); }))

    //   }
    // );
  }

  //-------------Get Processes---------------
  functionprocesslist() {
    if (!this.processValuesObservable.length) {
      this.optionalService.getProcessOptionalValue(this.selectedapp);
    } else {
      let flag = 0;
      this.processValuesObservable.forEach(ele => {
        if (ele.app === this.selectedapp) {
          if (ele.data.CREATE[0] == "Y" && ele.data.DELETE[0] == "Y" && ele.data.UPDATE[0] == "Y") {
            this.PRCS_CD = (ele.process.sort(function (a, b) { return a.localeCompare(b); }));
            flag = 1;
          }
        }
      });
      if (!flag) {
        this.optionalService.getProcessOptionalValue(this.selectedapp);
      }
    }
    // this.http.get<data>(this.apiUrlGet + "V_APP_CD=" + this.selectedapp + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET").subscribe(
    //   res => {
    //     //(this.apiUrlGet + "V_APP_CD=" + this.predapp_sl + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET");
    //     if (res.CREATE[0] == "Y" && res.DELETE[0] == "Y" && res.UPDATE[0] == "Y") {
    //       this.PRCS_CD = this.PRCS_CD.concat(res.PRCS_CD.sort(function (a, b) { return a.localeCompare(b); }));
    //     } else { }
    //   }
    // );
  }
  // ----------  get Services ------------
  functionserviceslist() {
    if (!this.serviceValuesObservable.length) {
      this.optionalService.getServiceOptionalValue(this.selectedapp, this.selectedprcs);
    } else {
      let flag = 0;
      this.serviceValuesObservable.forEach(ele => {
        if (ele.app === this.selectedapp && ele.process === this.selectedprcs) {
          this.SRVC_CD = [];
          this.SRVC_CD = (ele.service.sort(function (a, b) { return a.localeCompare(b); }));
          flag = 1;
        }
      });
      if (!flag) {
        this.optionalService.getServiceOptionalValue(this.selectedapp, this.selectedprcs);
      }
    }
    // this.http.get<data>(this.apiUrlGet + "V_APP_CD=" + this.selectedapp + "&V_SRC_CD=" + this.V_SRC_CD + "&V_PRCS_CD=" + this.selectedprcs + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=ProcessServices&Verb=GET").subscribe(
    //   res => {

    //     this.SRVC_CD = this.SRVC_CD.concat(res.SRVC_CD.sort(function (a, b) { return a.localeCompare(b); }));
    //   }
    // );
  }
}
export interface data {
  APP_CD: string[];
  PRCS_CD: string[];
  SRVC_CD: string[];
  CREATE: string[];
  UPDATE: string[];
  DELETE: string[];
  PRDCR_SRVC_CD: string[];
  TRNSN_CND: string[];
  CONT_ON_ERR_FLG: string[];
  AUTO_ID: string[];
  USR_GRP_CD: string[];
}
