import { Component, ViewChild, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Modeler, PropertiesPanelModule, OriginalPropertiesProvider, InjectionNames } from './bpmn-js';
import { Globals } from 'src/app/services/globals';
import { EndUserService } from 'src/app/services/EndUser-service';
import { UseradminService } from 'src/app/services/useradmin.service2';
import { OptionalValuesService, ApplicationProcessObservable } from 'src/app/services/optional-values.service';
import { Subscription } from 'rxjs';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { RollserviceService } from 'src/app/services/rollservice.service';
import { ApiService } from 'src/app/service/api/api.service';
import { Http } from '@angular/http';
import { IFormFieldConfig, ConfigServiceService } from 'src/app/services/config-service.service';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { EnduserComponent } from '../enduser.component';
import { HomeComponent } from '../../home.component';
import { Router } from '@angular/router';
import { CommonUtils } from 'src/app/common/utils';
import * as Chart from 'chart.js';

import { CustomPropsProvider } from './props-provider/CustomPropsProvider';

export class ReportData {
  public RESULT: string;
  public V_EXE_CD: string[];
  constructor() {
  }
}
@Component({
  selector: 'app-process-design',
  templateUrl: './process-design.component.html',
  styleUrls: ['./process-design.component.scss']
})
export class ProcessDesignComponent implements OnInit, OnDestroy {

  public opened: boolean;
  public treeopened: boolean = true;
  private modeler: any;
  private url: string;
  private downloadUrl: string;
  private user: any;
  private bpmnTemplate: any;
  private flows = {};
  @ViewChild('file')
  private file: any;
  @ViewChild('processForm') processForm: any;
  private currentXml: any;
  private uploadLocked: boolean;
  applicationProcessObservable$: Subscription;
  applicationProcessValuesObservable: ApplicationProcessObservable[] = [];
  appProcessList = [];
  item: TreeviewItem[] = [];
  chilItem: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });
  parentMenuItems = [
    { item: 'Add Process', value: 'Add', havePermission: 0 },
    { item: 'Open a Process', value: 'Import', havePermission: 0 },
    { item: 'Delete Application', value: 'Delete', havePermission: 0 }];
  childrenMenuItems = [
    { item: 'Run', value: 'Run', havePermission: 0 },
    { item: 'Edit', value: 'Edit', havePermission: 0 },
    { item: 'Delete', value: 'Delete', havePermission: 0 },
    { item: 'Schedule', value: 'Schedule', havePermission: 0 },
    { item: 'Monitor', value: 'Monitor', havePermission: 0 },
    { item: 'Approve', value: 'Approve', havePermission: 0 },
    { item: 'Resolve', value: 'Resolve', havePermission: 0 },
    { item: 'Download BPNM', value: 'BPNM', havePermission: 0 },
    { item: 'Download SVG', value: 'SVG', havePermission: 0 }];
  roleObservable$: Subscription;
  roleValues;
  childobj = {};
  parentobj = {};
  selectedApp = '';
  selectedPrcoess = '';
  selectedService = '';
  Label: any[] = [];
  resFormData: any;
  form_Data_Keys = [];
  form_Data_Values = [];
  form_Data_labels = [];
  form_result = {};
  fieldConfig: { [key: string]: IFormFieldConfig } = {};
  options: any = {};
  ResetOptimised = false;
  FilterAutoValue: any;
  executedata = {};
  Execute_res_data: any;
  ts = {};
  k = 0;
  ctrl_variables: any;
  check_data = {};
  repeat: any = 0;
  public report: ReportData = new ReportData;
  ColorGantt = [];
  Colorpie = [];
  Colorpie_boder = [];
  ColorBar = [];
  ColorBar_border = [];
  V_OLD_PRCS_CD = '';

  //For property panel
  propertyPanelAllTabsData: any;
  executableTypesData = [];
  selectedExecutableType: string;
  selectedExecutable: string;
  executablesData = [];

  //property panel property tabs variables
  async_sync: string = "sync";
  restorability: string = "auto";
  instances: string = "unlimited";
  isServiceActive: Boolean = true;
  isSynchronousActive: Boolean = true;

  //property panel general tab variables
  generalId: String;

  executableOutput: string;
  executableDesc: string;

  currentDate: any = new Date();
  todaysDate: any = new Date();
  afterFiveDays: any = new Date(this.todaysDate.setDate(this.currentDate.getDate() + 5));

  userEmail: String;

  constructor(
    private httpClient: HttpClient,
    private http: Http,
    private toastrService: ToastrService,
    private globals: Globals,
    private endUserService: EndUserService,
    private useradminService: UseradminService,
    private optionalService: OptionalValuesService,
    private roleService: RollserviceService,
    private apiService: ApiService,
    private data: ConfigServiceService,
    private PFrame: EnduserComponent,
    private app: HomeComponent,
    private router: Router,
    private StorageSessionService: StorageSessionService,
  ) {
    this.applicationProcessObservable$ = this.optionalService.applicationProcessValue.subscribe(data => {
      if (data != null) {
        this.applicationProcessValuesObservable = data;
        if (this.applicationProcessValuesObservable.length) {
          this.appProcessList = [];
          this.appProcessList = data;
          this.generateTreeItem();
        }
      }
    });
    this.roleObservable$ = this.roleService.roleValue.subscribe(data => {
      if (data != null) {
        this.roleValues = data;
        if (this.roleValues.length) {
          this.roleValues.forEach(ele => {
            switch (ele) {
              case 'Enablement Workflow Schedule Role':
                this.childrenMenuItems[3].havePermission = 1;
                break;
              case 'Enablement Workflow Dashboard Role':
                this.childrenMenuItems[4].havePermission = 1;
                break;
              case 'Enablement Workflow MyTask Role':
                this.childrenMenuItems[5].havePermission = 1;
                break;
              case 'Enablement Workflow Exception Role':
                this.childrenMenuItems[6].havePermission = 1;
                break;
              case 'Enablement Workflow Process Role':
                this.parentMenuItems[0].havePermission = 1;
                this.parentMenuItems[1].havePermission = 1;
                this.childrenMenuItems[7].havePermission = 1;
                this.childrenMenuItems[8].havePermission = 1;
                break;
              default:
                break;
            }
          })
        }
      }
    });
  }

  ngOnInit() {
    this.data.getJSON().subscribe(data => {
      this.Label = data.json();
    });
    this.httpClient.get('../../../../assets/control-variable.json').subscribe(res => {
      this.ctrl_variables = res;
    });
    this.url = this.apiService.endPoints.securedJSON;
    this.user = JSON.parse(sessionStorage.getItem('u'));
    this.downloadUrl = this.apiService.endPoints.downloadFile;
    this.getApplicationProcess();
    this.userEmail = this.user.USR_NM;
  }

  ngAfterViewInit() {
    this.modeler = new Modeler({
      container: '#canvas',
      width: '90%',
      height: '500px',
      additionalModules: [
        PropertiesPanelModule,
        OriginalPropertiesProvider,

        { [InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]] },
        { [InjectionNames.propertiesProvider]: ['type', CustomPropsProvider] },
      ]
      // ,
      // propertiesPanel: {
      //   parent: '#properties'
      // }
    });
    // this.newBpmn();
    const eventBus = this.modeler.get('eventBus');
    if (eventBus) {

      eventBus.on('element.click', ($event) => {
        this.generalId = $event.element.id;
        this.getAllTabs(this.generalId);
      }),
        eventBus.on('element.changed', ($event) => {
          console.log('$event.element', $event.element);
          if (['bpmn:Process'].indexOf($event.element.type) > -1) {
            this.selectedPrcoess = $event.element.id;
            this.updateProcess();
            this.generalId = this.selectedPrcoess;
          } else {
            this.selectedPrcoess = 'newProcess';
            // this.V_OLD_PRCS_CD = this.selectedPrcoess;
            // this.addProcess();
            this.generalId = this.selectedPrcoess;
          }
          if ($event && $event.element && ['bpmn:Process', 'label'].indexOf($event.element.type) === -1) {
            const businessObject = $event.element.businessObject;
            const sourceId = businessObject && businessObject.sourceRef ? businessObject.sourceRef.id : '';
            const targetId = businessObject && businessObject.targetRef ? businessObject.targetRef.id : '';
            const objectId = businessObject ? businessObject.id : '';
            // const vAppCd = 'V_APP_CD';
            // const vPrcsCd = 'V_PRCS_CD';
            const vAppCd = this.selectedApp;
            const vPrcsCd = this.selectedPrcoess;
            if ($event.element.type === 'bpmn:SequenceFlow') {
              const data: any = {
                REST_Service: 'Orchetration',
                RESULT: '@RESULT',
                V_APP_CD: vAppCd,
                V_CONT_ON_ERR_FLG: 'N',
                V_PRCS_CD: vPrcsCd,
                V_PRDCR_APP_CD: vAppCd,
                V_PRDCR_PRCS_CD: vPrcsCd,
                V_PRDCR_SRC_CD: this.user.SRC_CD,
                V_PRDCR_SRVC_CD: sourceId,
                V_SRC_CD: this.user.SRC_CD,
                V_SRVC_CD: targetId,
                V_USR_NM: this.user.USR_NM,
                Verb: 'PUT'
              };

              this.generalId = targetId;
              this.getAllTabs(targetId);

              if (!this.flows) {
                this.flows = {};
              }
              this.flows[targetId] = data;
            } else {
              const data: any = {
                REST_Service: 'Service',
                V_APP_CD: vAppCd,
                V_CREATE: 'Y',
                V_DELETE: 'Y',
                V_EXECUTE: 'Y',
                V_PRCS_CD: vPrcsCd,
                V_READ: 'Y',
                V_ROLE_CD: 'Program Assessment Role',
                V_SRC_CD: this.user.SRC_CD,
                V_SRVC_CD: objectId,
                V_SRVC_DSC: '',
                V_UPDATE: 'Y',
                V_USR_NM: this.user.USR_NM,
                Verb: 'PUT'
              };

              this.generalId = objectId;
              this.getAllTabs(objectId);

              this.httpClient.post(this.url, data).subscribe(() => {
                if (objectId && this.flows[objectId]) {
                  this.uploadLocked = true;
                  this.httpClient.put(this.url, this.flows[objectId]).subscribe(() => {
                    delete this.flows[objectId];
                    this.upload(vAppCd, vPrcsCd);
                    this.uploadLocked = false;
                  }, () => this.uploadLocked = false);
                }
              });
            }
            setTimeout(() => {
              this.upload(vAppCd, vPrcsCd);
            }, 2000);
          }
        });
    }
  }

  ngOnDestroy() {
    this.applicationProcessObservable$.unsubscribe();
    this.roleObservable$.unsubscribe();
    if (this.modeler) {
      this.modeler.destroy();
    }
  }

  updateProcess() {
    const body = {
      'V_APP_CD': this.selectedApp,
      'V_OLD_PRCS_CD': this.V_OLD_PRCS_CD,
      'V_NEW_PRCS_CD': this.selectedPrcoess,
      'V_PRCS_DSC': this.selectedPrcoess,
      'REST_Service': 'UpdateProcess',
      'V_SRC_CD': this.user.SRC_CD,
      'V_USR_NM': this.user.USR_NM,
      "Verb": "PUT"
    };
    this.http.post(this.apiService.endPoints.secure, body, this.apiService.setHeaders())
      .subscribe(res => {
      });
  }

  addProcess() {
    const body = {
      'V_APP_CD': this.selectedApp,
      'V_PRCS_CD': this.selectedPrcoess,
      'REST_Service': 'NewProcess',
      'V_SRC_CD': this.user.SRC_CD,
      'V_USR_NM': this.user.USR_NM,
      "Verb": "POST"
    };
    this.http.post(this.apiService.endPoints.secure, body, this.apiService.setHeaders())
      .subscribe(res => {
      });
  }

  upload(vAppCd, vPrcsCd) {
    if (!this.uploadLocked) {
      this.modeler.saveXML((err: any, xml: any) => {
        if (xml !== this.currentXml) {
          const formData: FormData = new FormData();
          formData.append('FileInfo', JSON.stringify({
            File_Path: `/opt/tomcat/webapps/${this.useradminService.reduceFilePath(this.user.SRC_CD)}/${vAppCd}/`,
            File_Name: `${vPrcsCd}.bpmn`,
            V_SRC_CD: this.user.SRC_CD,
            USR_NM: this.user.USR_NM
          }));
          formData.append('Source_File', new File([xml], `${vPrcsCd}.bpmn`, { type: 'text/xml' }));
          this.httpClient.post(`https://${this.globals.domain}/FileAPIs/api/file/v1/upload`, formData).subscribe();
        }
        this.currentXml = xml;
      });
    }
  }

  openBpmn($event) {
    if ($event && $event.target && $event.target.files) {
      const fr: FileReader = new FileReader();
      fr.onloadend = () => {
        this.modeler.importXML(fr.result, this.handleError.bind(this));
        if (this.file && this.file.nativeElement) {
          this.file.nativeElement.value = '';
        }
      }
      fr.readAsText($event.target.files[0]);
    }
  }

  newBpmn() {
    this.opened = true;
    if (this.bpmnTemplate) {
      this.modeler.importXML(this.bpmnTemplate, this.handleError.bind(this));
    } else {
      this.httpClient.get('/assets/bpmn/newDiagram.bpmn', {
        headers: { observe: 'response' }, responseType: 'text'
      }).subscribe(
        (x: any) => {
          this.modeler.importXML(x, this.handleError.bind(this));
          this.bpmnTemplate = x;
          this.selectedPrcoess = 'newProcess';
          this.V_OLD_PRCS_CD = this.selectedPrcoess;
          this.addProcess();
        },
        this.handleError.bind(this)
      );
    }
  }

  downloadBpmn(processName) {
    this.modeler.saveXML((err: any, xml: any) => {
      saveAs(new Blob([xml], { type: 'text/xml' }), processName + '.bpmn');
    });
  }

  downloadSvgBpmn(processName) {
    this.modeler.saveSVG((err: any, svg: any) => {
      saveAs(new Blob([svg], { type: 'image/svg+xml' }), processName + '.svg');
    });
  }

  handleError(err: any) {
    if (err) {
      this.toastrService.error(err);
      console.error(err);
    }
  }

  // storing text as process name and value as application name for child tree view item 
  // to get application and process name both when clicked on child item
  generateTreeItem() {
    this.item = [];
    if (this.appProcessList.length) {
      this.appProcessList.forEach(ele => {

        if (ele.process.length) {
          this.chilItem = [];
          ele.process.forEach(eleProcess => {
            let childTreeObj = new TreeviewItem({ text: eleProcess.replace(/'/g, ""), value: ele.app });
            this.chilItem.push(childTreeObj)
          })
        };
        if (ele.auth.length) {
          let deleteCount = 0;
          ele.auth.forEach((eleauth, index) => {
            eleauth = eleauth.replace(/'/g, "");
            let process = ele.process[index];
            if (eleauth.indexOf(process.replace(/'/g, "")) > -1) {
              let copyChildrenMenuItems = [];
              copyChildrenMenuItems = [...this.childrenMenuItems];
              let i = eleauth.indexOf(process.replace(/'/g, "")) + process.replace(/'/g, "").length;
              let subString = eleauth.substring(i).split(';');
              if (subString.length) {
                subString.forEach(ele => {
                  let authSubStr = ele.split('-');
                  switch (authSubStr[0]) {
                    case 'EXECUTE': {
                      copyChildrenMenuItems[0].havePermission = authSubStr[1] === 'Y' ? 1 : 0;
                      break;
                    }
                    case 'UPDATE': {
                      copyChildrenMenuItems[1].havePermission = authSubStr[1] === 'Y' ? 1 : 0;
                      break;
                    }
                    case 'DELETE': {
                      if (authSubStr[1] === 'Y') {
                        deleteCount++;
                      }
                      copyChildrenMenuItems[2].havePermission = authSubStr[1] === 'Y' ? 1 : 0;
                      break;
                    }
                    default: break;
                  }
                })
              }
              process = process.replace(/'/g, "");
              this.childobj[process] = copyChildrenMenuItems;
            }
          })
          let copyParentrenMenuItems = [];
          copyParentrenMenuItems = [...this.parentMenuItems];
          if (deleteCount == ele.auth.length) {
            copyParentrenMenuItems[2].havePermission = 1;
          } else {
            copyParentrenMenuItems[2].havePermission = 0;
          }
          this.parentobj[ele.app] = copyParentrenMenuItems;
        };
        let treeObj = new TreeviewItem({
          text: ele.app, value: ele.app, collapsed: true, children: this.chilItem
        });
        this.item.push(treeObj);
      })
    }
  }
  getApplicationProcess() {
    this.endUserService.getApplicationAndProcess().subscribe(res => {
      if (res) {
        let data = res.json();
        if (data.length) {
          this.optionalService.getApplicationProcessOptionalValue(data);
        }
      }
    })
  }

  onTitleClick(item) {
    if (!item.children) {
      this.selectedApp = item.value;
      this.selectedPrcoess = item.text;
      const formData: FormData = new FormData();
      formData.append('FileInfo', JSON.stringify({
        File_Path: '/opt/tomcat/webapps/' + this.user.SRC_CD + '/' + item.value + '/',
        File_Name: item.text + '.bpnm'
      }));
      this.http.post(this.downloadUrl, formData, this.apiService.setHeadersForBlob())
        .subscribe(
          (res: any) => {
            console.log(res);
            this.modeler.importXML(res, this.handleError.bind(this));
            this.bpmnTemplate = res;
          },
          this.handleError.bind(this)
        );
      this.Execute_AP_PR();
    }
  }
  onParentMenuItemClick(actionValue, parentValue) {
    this.selectedApp = parentValue;
    switch (actionValue) {
      case 'Add': {
        this.newBpmn();
        this.generalId = "newProcess";
        break;
      }
      case 'Import': {
        let ele = document.getElementById('file');
        ele.click();
        break;
      }
      case 'Delete': {
        this.deleteApplication();
        break;
      }
      default: {
        break;
      }
    }
  }
  onChildMenuItemClick(actionValue, childValue) {
    this.selectedApp = childValue.value;
    this.selectedPrcoess = childValue.text;
    switch (actionValue) {
      case 'Run': {
        this.add();
        this.Execute_Now();
        break;
      }
      case 'Edit': {
        break;
      }
      case 'Delete': {
        break;
      }
      case 'Schedule': {
        break;
      }
      case 'Monitor': {
        break;
      }
      case 'Approve': {
        break;
      }
      case 'Resolve': {
        break;
      }
      case 'BPNM': {
        this.downloadBpmn(this.selectedPrcoess);
        break;
      }
      case 'SVG': {
        this.downloadSvgBpmn(this.selectedPrcoess);
        break;
      }
      default: {
        break;
      }
    }
  }
  add() {
    for (let i = 0; i <= this.k; i++) {
      if (this.resFormData[i].value != '' && this.resFormData[i].value != null) {
        this.ts[this.resFormData[i].name] = this.resFormData[i].value;
      }
    }
    this.StorageSessionService.setCookies('ts', this.ts);
  }
  Execute_Now() {
    if (this.processForm.valid) {
      const body = {
        'V_APP_CD': this.selectedApp,
        'V_PRCS_CD': this.selectedPrcoess,
        'V_SRVC_CD': 'START',
        'V_SRC_CD': this.user.SRC_CD,
        'V_USR_NM': this.user.USR_NM

      };
      Object.assign(body, this.ts);
      this.http.post(this.apiService.endPoints.secureProcessStart, body, this.apiService.setHeaders())
        .subscribe(res => {
          // console.log('start');
          this.executedata = { SL_APP_CD: this.selectedApp, SL_PRC_CD: this.selectedPrcoess };

          this.StorageSessionService.setCookies('executedata', this.executedata);
          this.Execute_res_data = res.json();
          this.StorageSessionService.setCookies('executeresdata', this.Execute_res_data);
          this.PFrame.display_page = true;
          this.GenerateReportTable();
        });
    }
  }
  // Added for property panel related tabs
  getAllTabs(selService: any) {

    this.endUserService.getAllTabs(this.selectedApp, this.selectedPrcoess, selService)
      .subscribe(res => {
        if (res) {
          this.propertyPanelAllTabsData = res.json();
        }
      });

    this.getAllExecutableTypes();
  }

  // Added for property panel related tabs
  getAllExecutableTypes() {
    this.endUserService.getAllExecutableTypes()
      .subscribe(res => {
        if (res) {
          this.executableTypesData = []; //clearning off old data if any
          res.json().forEach(element => {
            this.executableTypesData.push(element.EXE_TYP);
          });
        }
      });
  }

  getExecutablesForSelctedExecutableType() {
    this.endUserService.getExecutablesForSelctedExecutableType(this.selectedExecutableType)
      .subscribe(res => {
        if (res) {
          this.executablesData = []; //clearning off old data if any
          res.json().forEach(element => {
            this.executablesData.push(element.EXE_CD);
          });
        }
      });
  }

  getInputOutputForSelctedExecutable() {
    this.endUserService.getInputOutputForSelctedExecutable(this.selectedExecutableType, this.selectedExecutable)
      .subscribe(res => {
        if (res) {
          let result = res.json();
          this.executableOutput = result[0]["EXE_OUT_PARAMS"];
          this.executableDesc = result[0]["EXE_DSC"];
        }
      });
  }

  //selected executable type from UI
  updateselectedExecutableType(value: any) {
    this.selectedExecutableType = value;
    this.getExecutablesForSelctedExecutableType();
  }

  //selected executable type from UI
  updateselectedExecutable(value: string) {
    this.selectedExecutable = value;
    this.getInputOutputForSelctedExecutable();
  }

  serviceActiveSelected(value: Boolean) {
    this.isServiceActive = value;
  }

  GenerateReportTable() {
    if (!this.app.loadingCharts)
      this.app.loadingCharts = true;
    if (this.app.fromNonRepForm) {
      this.app.fromNonRepForm = false;
      this.Execute_res_data = this.StorageSessionService.getCookies('executeresdata');
    }
    const body = {
      V_SRC_ID: this.Execute_res_data['V_SRC_ID'],
      V_PRCS_TXN_ID: this.Execute_res_data['V_PRCS_TXN_ID'],
      V_USR_ID: JSON.parse(sessionStorage.getItem('u')).USR_ID,
      REST_Service: 'Report',
      Verb: 'POST'
    };
    this.http.post(this.apiService.endPoints.secureProcessReport, body, this.apiService.setHeaders())
      .subscribe(
        (res: any) => {
          if (res._body !== '{}') {
            this.globals.Report = JSON.parse(res._body)
            this.StorageSessionService.setCookies('report_table', res.json());
            this.check_data = res.json();
            this.app.loadingCharts = false;
            this.report = res.json();
            var timeout = res.json().RESULT.toString().substring(0, 7) == "TIMEOUT";
            if (timeout && this.ctrl_variables.call_repeat_on_TIMEOUT) {
              this.repeatCallTable(true);
            } else if (this.report.RESULT == 'TABLE') {

              this.router.navigateByUrl('/End_User/ReportTable', { skipLocationChange: true });
            } else if (this.report.RESULT[0] == 'INPUT_ARTFCT_TASK') {

              this.router.navigateByUrl('/End_User/InputArtForm', { skipLocationChange: true });

            } else if (CommonUtils.isValidValue(this.report.V_EXE_CD)) {

              if (this.report.RESULT[0] == 'NONREPEATABLE_MANUAL_TASK') {
                this.router.navigateByUrl('/End_User/NonRepeatForm', {
                  queryParams: { refresh: new Date().getTime() }, skipLocationChange: true
                });

              } else if (this.report.RESULT[0] == 'REPEATABLE_MANUAL_TASK') {
                this.router.navigateByUrl('/End_User/RepeatForm', { skipLocationChange: true });
              }

            } else {
              this.repeatCallTable(true);
            }
            this.StorageSessionService.setCookies('App_Prcs', { 'V_APP_CD': this.selectedApp, 'V_PRCS_CD': this.selectedPrcoess });
          } else {
            this.router.navigate(['End_User/Execute'], { queryParams: { page: 1 }, skipLocationChange: true });
          }
        }
      );
    if (!this.app.fromNonRepForm) {
      if (this.app.loadingCharts && CommonUtils.isValidValue(this.ctrl_variables) && this.ctrl_variables.show_ALL) {
        this.chart_JSON_call();
      }
    }
  }
  chart_JSON_call() {
    this.apiService.requestSecureApi(this.apiService.endPoints.secure + 'V_SRC_ID=' + this.Execute_res_data['V_SRC_ID'] + '&V_APP_ID=' + this.Execute_res_data['V_APP_ID'] + '&V_PRCS_ID=' + this.Execute_res_data['V_PRCS_ID'] + '&V_PRCS_TXN_ID=' + this.Execute_res_data['V_PRCS_TXN_ID'] + '&REST_Service=ProcessStatus&Verb=GET', 'get').subscribe(res => {
      (res);
      const start_time = [], end_time = [], Process = [];

      for (let i = 0; i < res['INS_DT_TM'].length; i++) {
        start_time[i] = res['INS_DT_TM'][i].substring(11);
        end_time[i] = res['LST_UPD_DT_TM'][i].substring(11);
        Process[i] = res['PRDCR_SRVC_CD'][i];
      }
      if (this.ctrl_variables.show_Gantt) {
        this.show_gantt_chart(Process, start_time, end_time);
      }
      if (this.ctrl_variables.show_PIE) {
        this.show_pie(Process, start_time, end_time);
      }
      if (this.ctrl_variables.show_BAR) {
        this.show_bar_chart(Process, start_time, end_time);
      }

      const exec = this;
      if (this.app.loadingCharts) {
        setTimeout(function () { exec.chart_JSON_call(); }, 500);
      }
    });
  }
  repeatCallTable(data: any): void {
    if (data && this.repeat < this.ctrl_variables.repeat_count) {
      this.repeat++;
      this.GenerateReportTable();
    } else {
      this.repeat = 0;
      this.router.navigate(["/End_User/Execute"], { queryParams: { page: 1 }, skipLocationChange: true });
    }
  }
  deleteApplication() {
    if (this.selectedApp !== '' || this.selectedApp !== null) {
      this.http.delete(this.url + 'V_APP_CD=' + this.selectedApp + '&V_SRC_CD=' + this.user.SRC_CD + '&V_USR_NM=' + this.user.USR_NM + '&REST_Service=Application&Verb=DELETE')
        .subscribe((res: any) => {
          let index = this.optionalService.applicationProcessArray.indexOf(this.selectedApp);
          this.optionalService.applicationProcessArray.splice(index, 1);
          this.optionalService.applicationProcessValue.next(this.optionalService.applicationProcessArray);
          this.selectedApp = '';
          this.selectedPrcoess = '';
        },
          this.handleError.bind(this))
    }
  }
  Execute_AP_PR() {
    this.resFormData = [];
    let FormData: any[];
    // secure
    this.apiService.requestSecureApi(this.apiService.endPoints.secure + 'V_APP_CD=' + this.selectedApp + '&V_PRCS_CD=' + this.selectedPrcoess + '&V_SRC_CD=' + this.user.SRC_CD + '&ResetOptimised=' + this.ResetOptimised + '&Lazyload=false' + '&REST_Service=ProcessParameters&Verb=GET', 'get').subscribe(
      res => {
        FormData = res.json();
        const ref = { disp_dyn_param: false };
        const got_res = this.data.exec_schd_restCall(FormData, ref);
        this.form_result = got_res.Result;
        this.resFormData = got_res.Data;
        this.k = got_res.K;
        this.fieldConfig = this.data.prepareAndGetFieldConfigurations(FormData);
        this.form_Data_Keys = [];
        this.form_Data_Values = [];
        this.form_Data_labels = [];
        this.labels_toShow();
        for (let i = 0; i < this.form_Data_Keys.length; i++) {
          if (this.resFormData[i].name === this.form_Data_labels[i] && this.resFormData[i].hasOptions && this.resFormData[i].hasOptions === 'Y') {
            this.getOptional_values(this.form_Data_Keys[i], this.form_Data_labels[i]);
          }
        }
      });
  }
  labels_toShow(): any {
    this.form_Data_Keys = Object.keys(this.form_result);
    for (let i = 0; i < this.form_Data_Keys.length; i++) {
      this.form_Data_Values.push(this.form_result[this.form_Data_Keys[i]]);
      this.form_Data_labels.push(this.form_Data_Keys[i]);
    }
  }

  getOptional_values(V_PARAM_NM, display_label) {
    const secureUrl = this.apiService.endPoints.secure + 'V_SRC_CD=' + this.user.SRC_CD + '&V_APP_CD=' + this.selectedApp + '&V_PRCS_CD=' + this.selectedPrcoess + '&V_PARAM_NM=' + V_PARAM_NM + '&V_SRVC_CD=' + this.selectedService + '&REST_Service=ProcessParametersOptions&Verb=GET';
    const secure_encoded_url = encodeURI(secureUrl);
    this.http.get(secure_encoded_url, this.apiService.setHeaders()).subscribe(
      res => {
        const resData = res.json();
        this.options[display_label] = resData[V_PARAM_NM];
      });
  }

  Update_value(v: any, n: any) { //v=value and n=paramter name
    this.FilterAutoValue = v;
    this.apiService.requestSecureApi(this.url + 'V_APP_CD=' + this.selectedApp + '&V_PRCS_CD=' + this.selectedPrcoess + '&V_SRC_CD=' + this.user.SRC_CD + '&V_USR_NM=' + this.user.USR_NM + '&V_PARAM_NM=' + n + '&V_PARAM_VAL=' + v + '&REST_Service=ProcessParameters&Verb=PATCH', 'get').subscribe(
      res => {
      }
    );
  }
  show_gantt_chart(Process, start_time, end_time) {
    let count = 0, flag = false, val1;
    const mydataset = [];
    for (let i = 0; i < Process.length; i++) {
      const R = Math.floor(Math.random() * 200);
      const G = Math.floor(Math.random() * 200);
      const B = Math.floor(Math.random() * 200);
      if (this.ColorGantt.length < i + 1) {
        this.ColorGantt[i] = 'rgba(' + R + ',' + G + ',' + B + ')';
      }
      //((this.time_to_sec(start_time[i]) - this.time_to_sec(start_time[0])));
      //((this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[0])));
      mydataset[Process.length - i - 1] = {
        backgroundColor: this.ColorGantt[i],
        borderColor: this.ColorGantt[i],
        fill: false,
        borderWidth: 20,
        pointRadius: 0,
        data: [
          {
            x: (this.time_to_sec(start_time[i]) - this.time_to_sec(start_time[0])),
            y: Process.length - i - 1
          }, {
            x: (this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[0])),
            y: Process.length - i - 1
          }
        ]
      };
    }
    const element = (<HTMLCanvasElement>document.getElementById('myGanttchart'));
    if (element != null) {
      const ctx = element.getContext('2d');
      const scatterChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: mydataset
        },
        options: {
          animation: {
            duration: 0
          },
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Processes',
                fontStyle: 'bold'
              },
              gridLines: {
                display: false,
              },
              ticks: {
                beginAtZero: true,
                callback: function (value, index, values) {
                  return Process[Process.length - value - 1];
                }
              }
            }],
            xAxes: [{
              type: 'linear',
              position: 'top',
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Time',
                fontStyle: 'bold'
              },
              ticks: {
                //beginAtZero :true,
                callback: function (value, index, values) {
                  if (value == Math.floor(value)) {
                    let beg_str = start_time[0].substring(0, 2);
                    let begstr = parseInt(beg_str);
                    let mid_str = (start_time[0][3] + start_time[0][4]);
                    let midstr = parseInt(mid_str);
                    let end_str = start_time[0].substring(6);
                    let endstr = parseInt(end_str);
                    endstr += value;
                    midstr += Math.floor(endstr / 60);
                    endstr = endstr - 60 * Math.floor(endstr / 60);
                    begstr += Math.floor(midstr / 60);
                    midstr = midstr - 60 * Math.floor(midstr / 60);
                    //(index);

                    if (midstr < 10) {
                      mid_str = '0' + midstr;
                    }
                    if (endstr < 10) {
                      end_str = '0' + endstr;
                    }
                    if (begstr < 10) {
                      beg_str = '0' + begstr;
                    }
                    //(count);
                    return beg_str + ':' + mid_str + ':' + end_str;
                  }
                  //return value/val1;
                  //return index;
                },
              }

            }],
          }
        }
      });
    }
  }
  show_pie(Process, start_time, end_time) {
    const mydata = [];
    const color = [], bcolor = [];
    const borderwidth_ = [];
    for (let i = 0; i < Process.length; i++) {
      const R = Math.floor(Math.random() * 200);
      const G = Math.floor(Math.random() * 200);
      const B = Math.floor(Math.random() * 200);
      if (this.Colorpie.length < i + 1) {
        this.Colorpie[i] = 'rgb(' + R + ',' + G + ',' + B + ',0.8)';
        this.Colorpie_boder[i] = 'rgb(' + Math.floor(R * 0.8) + ',' + Math.floor(G * 0.8) + ',' + Math.floor(B * 0.8) + ')';
      }
      const temp = (this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[i]));
      mydata[i] = temp;
      color[i] = this.Colorpie[i];
      bcolor[i] = this.Colorpie_boder[i];
      borderwidth_[i] = 1;
    }
    const data2 = {
      labels: Process,
      datasets: [
        {
          data: mydata,
          backgroundColor: color,
          borderColor: bcolor,
          borderWidth: borderwidth_
        }
      ]
    };
    const element = (<HTMLCanvasElement>document.getElementById('myPie'));
    if (element != null) {
      const ctx = element.getContext('2d');
      const chart1 = new Chart(ctx, {
        type: 'pie',
        data: data2,
        options: {
          animation: {
            duration: 0
          },
          responsive: true,
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                return data['labels'][tooltipItem[0]['index']];
              },
              label: function (tooltipItem, data) {
                //(tooltipItem);
                //(data['datasets'][0]['data'][tooltipItem['index']]);
                let ret = mydata[tooltipItem['index']];
                ret = Math.floor(ret * 100) / 100;
                return ret + ' sec';
              }
            },
            backgroundColor: '#FFF',
            titleFontSize: 16,
            titleFontColor: '#0066ff',
            bodyFontColor: '#000',
            bodyFontSize: 14,
            displayColors: false
          },
          title: {
            display: true,
            position: 'top',
            text: 'Current Processes',
            fontSize: 12,
            fontColor: '#111'
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              fontColor: '#333',
              fontSize: 10
            }
          }
        },
      });
    }
  }

  show_bar_chart(Process, start_time, end_time) {
    let val1, flag = false;
    const duration = [];
    const color = [];
    const bcolor = [];
    let temp_HH, temp_MM, temp_SS;
    for (let i = 0; i < Process.length; i++) {
      const len_temp = Process[i].length;
      Process[i] = Process[i].substring(0, 11);
      if (len_temp > Process[i].length) {
        Process[i] = Process[i] + '...';
      }
      const temp = this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[i]);
      duration[i] = temp;
      //(duration);
      const R = Math.floor(Math.random() * 200);
      const G = Math.floor(Math.random() * 200);
      const B = Math.floor(Math.random() * 200);
      if (this.ColorBar.length < i + 1) {
        this.ColorBar[i] = 'rgba(' + R + ',' + G + ',' + B + ',0.6)';
        this.ColorBar_border[i] = 'rgb(' + Math.floor(R * 0.8) + ',' + Math.floor(G * 0.8) + ',' + Math.floor(B * 0.8) + ')';
      }
      color[i] = this.ColorBar[i];
      bcolor[i] = this.ColorBar_border[i];
    }
    const element = (<HTMLCanvasElement>document.getElementById('myBarchart'));
    if (element != null) {
      const ctx = element.getContext('2d');
      const myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Process,
          datasets: [
            {
              data: duration,
              backgroundColor: color,
              borderColor: bcolor,
              borderWidth: 1
            }]
        },
        options: {
          animation: {
            duration: 0
          },
          responsive: true,
          legend: {
            display: false,
            position: 'bottom',
            labels: {
              fontColor: '#333',
              fontSize: 16
            }
          },
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                return data['labels'][tooltipItem[0]['index']];
              },
              label: function (tooltipItem, data) {
                //(tooltipItem);
                //(data['datasets'][0]['data'][tooltipItem['index']]);
                let ret = duration[tooltipItem['index']];
                ret = Math.floor(ret * 100) / 100;
                return ret + ' sec';
              }
            },
            backgroundColor: '#FFF',
            titleFontSize: 16,
            titleFontColor: '#0066ff',
            bodyFontColor: '#000',
            bodyFontSize: 14,
            displayColors: false
          },
          scales: {
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Duration',
                fontStyle: 'bold'
              },
              ticks: {
                min: 0,
                callback: function (value, index, values) {
                  if (value == Math.floor(value)) {
                    let begstr = 0;
                    let midstr = 0;

                    let endstr = value;
                    //(index*value);
                    midstr += Math.floor(endstr / 60);
                    endstr = endstr - 60 * Math.floor(endstr / 60);
                    begstr += Math.floor(midstr / 60);
                    midstr = midstr - 60 * Math.floor(midstr / 60);
                    //(index);
                    let beg_str = begstr.toString(), mid_str = midstr.toString(), end_str = endstr.toString();
                    if (midstr < 10) {
                      mid_str = '0' + midstr;
                    }
                    if (endstr < 10) {
                      end_str = '0' + endstr;
                    }
                    if (begstr < 10) {
                      beg_str = '0' + begstr;
                    }
                    //(min);
                    return beg_str + ':' + mid_str + ':' + end_str;
                  }
                  //return value;
                  //return index;
                },
              }
            }],
            xAxes: [{
              display: true,
              gridLines: {
                display: false,
              },
              scaleLabel: {
                display: true,
                labelString: 'Processes',
                fontStyle: 'bold'
              },
            }]
          }
        }
      });
    }
  }
  time_to_sec(time): any {
    return parseInt(time.substring(0, 2)) * 3600 + parseInt(time.substring(3, 5)) * 60 + (parseInt(time.substring(6)));
  }
}
