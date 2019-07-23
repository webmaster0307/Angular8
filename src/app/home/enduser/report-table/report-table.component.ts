import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router'
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { DialogChartsComponent } from './dialog-charts/dialog-charts.component';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { Globals } from 'src/app/services/globals';
import { Globals2 } from 'src/app/service/globals';
import { EndUserService } from 'src/app/services/EndUser-service';
import { ApiService } from 'src/app/service/api/api.service';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { BaseChartDirective } from 'ng2-charts-x';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatSnackBar} from '@angular/material/snack-bar';
import 'chartjs-plugin-zoom';
@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReportTableComponent implements OnInit, AfterViewInit {

  removable = true;

  hiddencols: string[] = [];

  // myControl = new FormControl();
  columnsToDisplayKeys: string[];
  domain_name = this.globals.domain_name;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(BaseChartDirective, { }) chart: BaseChartDirective;

  constructor(private dataStored: StorageSessionService,
    private https: Http,
    private route: Router,
    private data: ConfigServiceService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private globals: Globals,
    private globalUser: Globals2,
    private endUserService: EndUserService,
    private apiService: ApiService,
    private _snackBar: MatSnackBar
  ) { }

  remove(item: string): void {
    const index = this.hiddencols.indexOf(item);
    if (index >= 0) {
      this.hiddencols.splice(index, 1);
      this.columnsToDisplay.splice(0, 0, item);
    }
    this.settablepreferences();
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedchart, event.previousIndex, event.currentIndex);
  }
  pointer = 0;
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  Exe_data = this.dataStored.getCookies("executedata");
  iddata: any[] = [];
  Table_of_Data: any[];
  Table_of_Data1: any[];
  Table_of_Data2: any[] = [];
  Table_of_Data3: any[] = [];
  Table_of_Data4: any[] = [];
  APP_ID = "";
  PRCS_ID = "";
  SRC_ID = "";
  SRVC_ID = "";
  SRVC_CD = "";
  PRCS_TXN_ID = "";
  F1: any[];
  ArraData: any = [];
  hiddencolsflag: any =[];
  Table_of_Data5: any;
  helpertext = {};
  tabledata = {};
  dispchart: boolean;
  disptable: boolean;
  Select_show_option: any = ["Table", "Charts", "Both"];
  show_choice = "Table";
  selectedchart = [];
  selectedcustomize = "";
  myobj ={mychartType:"",myxaxisdata:"",myyaxisdata:"",myUoM:"",mySoM:""}
  PersonalTableCols: any = ["Chart type","x-axis data","y-axis data","Unit of measure","Scale of measure"];
  personalizationtable:any =[];
  linearray:any =[];
  bararray:any =[];
  piearray:any =[];
  doughnutarray: any=[];

  updatecustoms(){
    var test = 0;
    console.log(this.myobj.mychartType);
    
    if(this.personalizationtable != undefined && (this.myobj.mychartType != "" || this.myobj.myxaxisdata != "" || this.myobj.myyaxisdata != "")){    
    for(let i=0; i< this.personalizationtable.length; i++){
      if((this.myobj.mychartType != this.personalizationtable[i].chartType || 
        this.myobj.myxaxisdata != this.personalizationtable[i].xaxisdata ||
        this.myobj.myyaxisdata != this.personalizationtable[i].yaxisdata))
        {
        test=0;
      }
      else{
        test = 1;
      }
    }
    }
    else{
      test = 1;
    }
    if(test==0){
      var obj={
        chartType:this.myobj.mychartType,
        xaxisdata:this.myobj.myxaxisdata,
        yaxisdata:this.myobj.myyaxisdata,
        UoM:this.myobj.myUoM,
        SoM:this.myobj.mySoM,
      }
    this.personalizationtable.push(obj);
      switch(obj.chartType){
            case "linechart":
            this.linearray.push(obj);
            console.log(this.linearray);
            this._yaxis_sel_line.push(obj.yaxisdata);
            this._xaxis_sel_line = obj.xaxisdata ;
            this.updateLineChart();
            break;
            case "barchart":
            this.bararray.push(obj);
            this._yaxis_sel_bar.push(obj.yaxisdata);
            this._xaxis_sel_bar = obj.xaxisdata ;
            this.updateBarChart();
            break;
            case "piechart":
            this.piearray.push(obj);
            this._yaxis_sel_pie.push(obj.yaxisdata);
            this._xaxis_sel_pie = obj.xaxisdata ;
            this.updatePieChart();
            break;
            case "doughnutchart":
            this.doughnutarray.push(obj);
            this._yaxis_sel_doughnut.push(obj.yaxisdata);
            this._xaxis_sel_doughnut = obj.xaxisdata ;
            this.updateDoughnutChart();
            break;
      }
    }
    else
    {
      this._snackBar.open("Data already exist in table",'Ok',{
        duration: 2000
      });
    }
  }
  deleterow(row){
    console.log(row);
    var index = this.personalizationtable.indexOf(row);
    this.personalizationtable.splice(index,1);
    switch(row.chartType){
      case "linechart":
          this.linearray.splice(index,1);
          console.log(row.yaxisdata.toString());
          var abc = this._yaxis_sel_line.indexOf(row.yaxisdata);
          this._yaxis_sel_line.splice(abc,1);
          this.updateLineChart();
      break;
      case "barchart":
          this.bararray.splice(index,1);
          this._yaxis_sel_bar =  this._yaxis_sel_bar.filter(function(e) { return e != row.yaxisdata.toString() });
          this.updateBarChart();
      break;
      case "piechart":
          this.piearray.splice(index,1);
          this._yaxis_sel_pie =  this._yaxis_sel_pie.filter(function(e) { return e != row.yaxisdata.toString() });
          this.updatePieChart();
      break;
      case "doughnutchart":
          this.doughnutarray.splice(index,1);
          this._yaxis_sel_doughnut =  this._yaxis_sel_doughnut.filter(function(e) { return e != row.yaxisdata.toString() });
          this.updateDoughnutChart();
      break;
    }
  }
  getReportData() {

    this.Table_of_Data = this.dataStored.getCookies('report_table')['RESULT'];

    this.SRVC_CD = this.dataStored.getCookies('report_table')['SRVC_CD'][0];
    // this.SRVC_ID = this.dataStored.getCookies('report_table')['SRVC_ID'][0];
    this.Table_of_Data1 = this.dataStored.getCookies('report_table')['LOG_VAL'];
    this.iddata.push(this.dataStored.getCookies('iddata'));
    this.PRCS_TXN_ID = this.dataStored.getCookies('executeresdata')['V_PRCS_TXN_ID'];
    this.APP_ID = this.dataStored.getCookies('report_table')['APP_ID'][0];
    this.PRCS_ID = this.dataStored.getCookies('report_table')['PRCS_ID'][0];
    this.SRC_ID = this.dataStored.getCookies('report_table')['SRC_ID'][0];

    //(JSON.parse(this.Table_of_Data1[0]));
    this.columnsToDisplay = Object.keys(JSON.parse(this.Table_of_Data1[0]));

    this.hiddencolsflag = this.dataStored.getCookies('report_table')['HIDDEN'];
    var a = this.hiddencolsflag[0];
    var outputstr= a.replace(/'/g,'');
    outputstr.replace(/\s+/g, '-');
    this.hiddencolsflag = outputstr.split(",");
    for(let i=0;i< this.hiddencolsflag.length;i++){
      this.hiddencolsflag[i]= this.hiddencolsflag[i].toString().trim();
    }
    for(let j=0;j<this.columnsToDisplay.length;j++){
      if(this.hiddencolsflag[j] != undefined && this.hiddencolsflag[j].toString().trim() == "Y"){
        this.columnsToDisplay.splice(j,1);
      }
    }
  }
  dataSource = new MatTableDataSource(this.Table_of_Data4);
  columnsToDisplay = [];
  ngAfterViewInit() {

    this.dataSource.sort = this.sort;
    this.cd.detectChanges();

  }
  showhide(abc) {
    switch (abc) {
      case 'Table':
        this.disptable = true;
        this.dispchart = false;
        break;
      case 'Charts':
        this.disptable = false;
        this.dispchart = true;
        this.getchartpreferences();
        break;
      case 'Both':
        this.disptable = true;
        this.dispchart = true;
        break;
    }
    this.settablepreferences();
  }
  //___________________________Chart configuration ______________________________________
  yaxiscallbacks = ['$', '£', '€', '₹', 'm', 'km', 'k', 'gm', 'kg', 's'];
  V_PRF_NM = [];
  V_PRF_VAL = [];
  userprefs = {};
  hiddencolsconfig = {};
  _yaxisstepSize = null;
  _yaxisAutoskip: boolean = false;
  _xaxis_sel_line = "";
  _yaxis_sel_line = [];
  _yaxisCB_line = '';
  yaxis_data_line = [];
  _xaxis_sel_bar = "";
  _yaxis_sel_bar = [];
  _yaxisCB_bar = '';
  yaxis_data_bar = [];
  _xaxis_sel_pie = "";
  _yaxis_sel_pie = [];
  _yaxisCB_pie = '';
  yaxis_data_pie = [];
  _xaxis_sel_doughnut = "";
  _yaxis_sel_doughnut = [];
  _yaxisCB_doughnut = '';
  yaxis_data_doughnut = [];
  
  _backgroundColor = "rgba(34,181,306,0.2)";
  _borderColor = "rgba(44,191,206,1)";
  _fill: boolean = false;
  _borderdash = [];
  _gridlinedash = [];
  _pointstyle = "rectRot";
  _linetension = "none";
  _animations = "easeInOutQuad";
  _pointradius = "normal";
  _linestyle = "solid";
  _gridlinedash_= true;
  lineten: number = 0;
  pointrad: number = 8;
  chartlabels = ["Test 1","Test 2","Test 3","Test 4","Test 5"];
  _gridborder: boolean = false;
  _gridlinewidth: number = 1;
  chartcolors = [{
    backgroundColor: this._backgroundColor,
    borderColor: this._borderColor,
    pointBackgroundColor: this._borderColor,
    pointBorderColor: '#fff',
    pointHoverBorderColor: this._borderColor,
    pointHoverBackgroundColor: '#fff',
  },
  {
    backgroundColor: "rgba(154,67,208,0.48)",
    borderColor: "violet",
    pointBackgroundColor: "rgba(154,67,208,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "violet",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(255,0,0,0.48)",
    borderColor: "red",
    pointBackgroundColor: "rgba(255,0,0,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "red",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(255,255,0,0.48)",
    borderColor: "yellow",
    pointBackgroundColor: "rgba(255,255,0,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "yellow",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(0,128,0,0.48)",
    borderColor: "green",
    pointBackgroundColor: "rgba(0,128,0,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "green",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(255,165,0,0.48)",
    borderColor: "orange",
    pointBackgroundColor: "rgba(255,165,0,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "orange",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(255,127,80,0.48)",
    borderColor: "coral",
    pointBackgroundColor: "rgba(255,127,80,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "coral",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(112, 128, 144,0.48)",
    borderColor: "slategrey",
    pointBackgroundColor: "rgba(112, 128, 144,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "slategrey",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(106,90,205,0.48)",
    borderColor: "slateblue",
    pointBackgroundColor: "rgba(106,90,205,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "slateblue",
    pointHoverBackgroundColor: '#fff'
  }];
  linedata = [{ 
  data: [10,25,31,19,42], 
  label: ["Sample Dataset"],
  fill: this._fill,
  borderDash: this._borderdash,
  pointRadius: this.pointrad,
  pointStyle: this._pointstyle,
  yAxisID: "y-1" }];
  bardata = [{ data: [10,20,30,40,50], label: ["Sample Dataset"] }];
  piedata = [{ data: [10,20,30,40,50], labels: ["Sample Dataset"] }];
  doughnutdata = [{ data: [10,20,30,40,50], labels: ["Sample Dataset"] }];
  // Line Chart Configuration
  public lineChartColors = this.chartcolors;
  public lineChartData: Array<any> = this.linedata;
  public lineChartLabels: Array<any> = this.chartlabels;
  public lineChartType: string = 'line';
  public lineChartOptions: any;
  public lineChartPlugins = [pluginAnnotations];
  // Bar Chart Configuration
  public barChartOptions: any;
  public barChartLabels: string[] = this.chartlabels;
  public barChartType: string = 'bar';
  public barChartData: Array<any> = this.bardata;
  public barChartColors = this.chartcolors;
    
  // Pie Chart Configuration
  public pieChartLabels: string[] = this.chartlabels;
  public pieChartData: Array<any> = this.piedata;
  public pieChartType: string = 'pie';

  // Doughnut Chart Configuration
  public doughnutChartLabels: string[] = this.chartlabels;
  public doughnutChartData: Array<any> = this.doughnutdata;
  public doughnutChartType: string = 'doughnut';

  //_________________________CHART FUNCTIONS________________________________________
  updateLineChart() {
    var unit = this._yaxisCB_line;
    // this.lineChartData = [];
    // this.lineChartLabels = [];
    this.yaxis_data_line = [];
    this.lineChartOptions = null;

    switch (this._linetension) {
      case 'none': this.lineten = 0;
        break;
      case 'mild': this.lineten = 0.2;
        break;
      case 'full': this.lineten = 0.5;
        break;
      default: this.lineten = 0;
        break;
    }
    switch (this._pointradius) {
      case 'small': this.pointrad = 6;
        break;
      case 'normal': this.pointrad = 8;
        break;
      case 'large': this.pointrad = 10;
        break;
      default: this.pointrad = 6;
        break;
    }
    this._linestyle == "dashed" ? this._borderdash = [5, 5] : this._borderdash = [];
    this._gridborder == true ? this._gridlinedash = [10, 10] : this._gridlinedash = [];
    this._xaxis_sel_line != "" ? this.lineChartLabels = this.Table_of_Data5[this._xaxis_sel_line]
    :this.lineChartLabels=this.chartlabels;

    if (this._yaxis_sel_line != [] && this._yaxis_sel_line != undefined) {
      // this.yaxis_data = this.Table_of_Data5[this._yaxis1_sel].map(Number);
      for (let i = 0; i < this._yaxis_sel_line.length; i++) {
        this.yaxis_data_line[i] = this.Table_of_Data5[this._yaxis_sel_line[i]].map(Number);
        this.lineChartData[i] = {
          label: this._yaxis_sel_line[i],
          fill: this._fill,
          borderDash: this._borderdash,
          pointRadius: this.pointrad,
          pointStyle: this._pointstyle,
          data: this.yaxis_data_line[i],
          yAxisID: "y-".concat((i + 1).toString())
        }
      }
    }
    else{
      this.lineChartData = this.linedata;
    }
    // if (this._yaxismax == null || this._yaxismax == undefined || this._yaxismax == -Infinity) {
    //   this._yaxismax = Math.max.apply(null, this.yaxis_data[0]);
    // }
    this.lineChartOptions = {
      responsive: true,
      stacked: false,
      hoverMode: 'index',
      // plugins:{
        annotation: {
          drawTime: 'afterDatasetsDraw',
          annotations: [{
              type: 'line',
              drawTime: 'afterDraw',
              mode: 'vertical',
              scaleID: 'x-1',
              value: '10',
              borderColor: 'green',
              borderWidth: 1,
              label: {
                  enabled: true,
                  position: "center",
                  content: "Hey"
              }
          }]
      }
      // }
    ,
      legend: {
        display: true,
        labels: {
          usePointStyle: true
        }
      },
      elements:
      {
      point: {
          pointStyle: this._pointstyle
        },
      line: { tension: this.lineten },
      animation: {
          duration: 4000,
          easing: this._animations
        }
      },

      tooltips: {
        callbacks: {
          label: function (tooltipItems) {
            if(unit == "₹" ||unit == "$" ||unit == "€" ||unit == "£")
            return (unit + " " + tooltipItems.yLabel.toString());
            else
            return (tooltipItems.yLabel.toString()+" "+ unit);
          }
        },
        mode: 'index',
        intersect: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false
          },
          id: 'x-1',
          scaleLabel: {
            display: true,
            labelString: this._xaxis_sel_line
          },
          display: true
        }],
        yAxes: Array<any>()
      },
      pan: {
        enabled: true,
        mode: 'x',     
      },
      zoom: {
        enabled: true,         
        mode: 'xy',  
        speed: 0.1   
      }
    };
    for (let i = 0; i < this.lineChartData.length; i++) {
      if (i == 0) {
        this.lineChartOptions.scales.yAxes[i] = {
          position: 'left',
          type: 'linear',
          display: true,
          id: 'y-1',
          scaleLabel: {
            display: true,
            labelString: this._yaxis_sel_line[i],
            fontColor: this.lineChartColors[i].borderColor
          },
          gridLines: {
            drawOnChartAdrawBorder: false,
            borderDash: this._gridlinedash,
            lineWidth: this._gridlinewidth
          },
          ticks: {
            fontColor: this.lineChartColors[i].borderColor,
            // min: this._yaxismin,
            // max: this._yaxismax,
            stepSize: this._yaxisstepSize,
            autoSkip: this._yaxisAutoskip,
            beginAtZero: true,
            callback: function (label) {
              if (label > 1000) {
                return unit + " " + label/1000 + " k";
              }
              else {
                return unit + " " + label;
              }
            }
          }
        };
      }
      if (i > 0) {
        this.lineChartOptions.scales.yAxes.push({
          position: 'right',
          type: 'linear',
          display: true,
          id: "y-".concat((i + 1).toString()),
          scaleLabel: {
            display: true,
            labelString: this._yaxis_sel_line[i],
            fontColor: this.lineChartColors[i].borderColor
          },
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            fontColor: this.lineChartColors[i].borderColor,
            // min: this._yaxismin,
            // max: this._yaxismax,
            stepSize: this._yaxisstepSize,
            autoSkip: this._yaxisAutoskip,
            beginAtZero: true,
            callback: function (label) {
              if (label > 1000) {
                return unit + " " + label/1000 + " k";
              }
              else {
                return unit + " " + label;
              }
            }
          }
        });
      }
    }
  }
  updateBarChart() {
    var unit = this._yaxisCB_bar;
    // this.barChartData = [];
    // this.barChartLabels = [];
    this.barChartOptions = null;

    if (this._yaxis_sel_bar != [] && this._yaxis_sel_bar != undefined) {
      for (let i = 0; i < this._yaxis_sel_bar.length; i++) {
        this.yaxis_data_bar[i] = this.Table_of_Data5[this._yaxis_sel_bar[i]].map(Number);
        this.barChartData[i] = {
          label: "",
          data: Array<any>()
        }
        this.barChartData[i].data = this.yaxis_data_bar[i];
        this.barChartData[i].label = this._yaxis_sel_bar[i];
      }
    }
    else{
      this.barChartData = this.bardata;
    }
    this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      legend: {
        display: true,
        labels: {
          usePointStyle: true
        }
      },
      elements:
      {
        animation: {
          duration: 3000,
          easing: this._animations
        }
      },

      tooltips: {
        callbacks: {
          label: function (tooltipItems) {
            if(unit == "₹" ||unit == "$" ||unit == "€" ||unit == "£")
            return (unit + " " + tooltipItems.yLabel.toString());
            else
            return (tooltipItems.yLabel.toString()+" "+ unit);
          }
        },
        mode: 'index',
        intersect: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false
          },
          scaleLabel: {
            display: true,
            labelString: this._xaxis_sel_bar
          },
          display: true
        }],
        yAxes: Array<any>()
      },
      pan: {
        enabled: true,
        mode: 'x',     
      },
      zoom: {
        enabled: true,         
        mode: 'xy',     
      }
    };
    for (let i = 0; i < this.barChartData.length; i++) {
      if (i == 0) {
        this.barChartOptions.scales.yAxes[0] = {
          position: 'left',
          type: 'linear',
          display: true,
          id: 'y-1',
          gridLines: {
            drawOnChartAdrawBorder: false,
            borderDash: this._gridlinedash,
            lineWidth: this._gridlinewidth
          },
          ticks: {
            // min: this._yaxismin,
            // max: this._yaxismax,
            stepSize: this._yaxisstepSize,
            autoSkip: this._yaxisAutoskip,
            fontColor: this.barChartColors[0].borderColor,
            beginAtZero: true,
            callback: function (label) {
              if (label > 1000) {
                return unit + " " + label/1000 + " k";
              }
              else {
                return unit + " " + label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: this._yaxis_sel_bar[0],
            fontColor: this.barChartColors[0].borderColor
          }
        };
      }
      if (i > 0) {
        this.barChartOptions.scales.yAxes[i] = {
          position: 'right',
          type: 'linear',
          display: true,
          id: "y-".concat((i + 1).toString()),
          gridLines: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
          ticks: {
            // min: this._yaxismin,
            // max: this._yaxismax,
            // stepSize: this._yaxisstepSize,
            // autoSkip: this._yaxisAutoskip,
            fontColor: this.barChartColors[i].borderColor,
            beginAtZero: true,
            callback: function (label) {
              if (label > 1000) {
                return unit + " " + label/1000 + " k";
              }
              else {
                return unit + " " + label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: this._yaxis_sel_bar[i],
            fontColor: this.barChartColors[i].borderColor
          }
        };
      }
    }
    this._xaxis_sel_bar != "" ? this.barChartLabels = this.Table_of_Data5[this._xaxis_sel_bar]
    :this.barChartLabels=this.chartlabels;
  }
  updatePieChart() {
    // this.pieChartData = [];
    // this.pieChartLabels = [];

    if (this._yaxis_sel_pie != [] && this._yaxis_sel_pie != undefined) {
      for (let i = 0; i < this._yaxis_sel_pie.length; i++) {
        this.yaxis_data_pie[i] = this.Table_of_Data5[this._yaxis_sel_pie[i]].map(Number);
        this.pieChartData.push({
          labels: this._yaxis_sel_pie[i],
          data: this.yaxis_data_pie[i]
        })
      }
    }
    this._xaxis_sel_pie != "" ? this.pieChartLabels = this.Table_of_Data5[this._xaxis_sel_pie]
    :this.pieChartLabels=this.chartlabels;
  }
  updateDoughnutChart() {
    // this.doughnutChartData = [];
    // this.doughnutChartLabels = [];

    if (this._yaxis_sel_doughnut != [] && this._yaxis_sel_doughnut != undefined) {
      for (let i = 0; i < this._yaxis_sel_doughnut.length; i++) {
        this.yaxis_data_doughnut[i] = this.Table_of_Data5[this._yaxis_sel_doughnut[i]].map(Number);
        this.doughnutChartData.push({
          labels: this._yaxis_sel_doughnut[i],
          data: this.yaxis_data_doughnut[i]
        })
      }
    }
    this._xaxis_sel_doughnut != "" ? this.doughnutChartLabels = this.Table_of_Data5[this._xaxis_sel_doughnut]
    :this.doughnutChartLabels=this.chartlabels;
  }
  updatechart() {
    this.updateLineChart();
    this.updateBarChart();
    this.updatePieChart();
    this.updateDoughnutChart();
  }

  //__________________________Set Preferences_________________________________
  setchartpreferences() {
    this.userprefs['backgroundcolor'] = this._backgroundColor;
    this.userprefs['bordercolor'] = this._borderColor;
    this.userprefs['fill'] = this._fill.toString().toLocaleUpperCase();
    this.userprefs['pointstyle'] = this._pointstyle;
    this.userprefs['linetension'] = this._linetension;
    this.userprefs['animations'] = this._animations;
    this.userprefs['pointradius'] = this._pointradius;
    this.userprefs['linestyle'] = this._linestyle;
    this.userprefs['gridlinedashed'] = this._gridborder.toString().toLocaleUpperCase();
    this.userprefs['linewidth'] = this._gridlinewidth;
    this.userprefs['yautoskip'] = this._yaxisAutoskip.toString().toLocaleUpperCase();
    this.userprefs['linexaxis'] = this._xaxis_sel_line;
    this.userprefs['lineyaxis'] = this._yaxis_sel_line;
    this.userprefs['barxaxis'] = this._xaxis_sel_bar;
    this.userprefs['baryaxis'] = this._yaxis_sel_bar;
    this.userprefs['piexaxis'] = this._xaxis_sel_pie;
    this.userprefs['pieyaxis'] = this._yaxis_sel_pie;
    this.userprefs['doughnutxaxis'] = this._xaxis_sel_doughnut;
    this.userprefs['doughnutyaxis'] = this._yaxis_sel_doughnut;
    this.userprefs['selectedchart'] = this.selectedchart;
    console.log(this.userprefs);
    this.V_PRF_NM = Object.keys(this.userprefs);
    this.V_PRF_VAL = Object.values(this.userprefs);
    for (let j = 0; j < this.V_PRF_NM.length; j++) {
      this.data.setchartstyling(this.APP_ID, this.PRCS_ID, this.SRC_ID, this.V_PRF_NM[j], this.V_PRF_VAL[j]).subscribe(
        () => {

        });
    }

    
  }
  settablepreferences(){
    if(this.hiddencols.length > -1){
      var abc = this.hiddencols.toString();
      this.userprefs['hiddencolname'] = abc;
    }
    this.userprefs['displaychoice'] = this.show_choice;
      this.V_PRF_NM = Object.keys(this.userprefs);
      this.V_PRF_VAL = Object.values(this.userprefs);
      for (let j = 0; j < this.V_PRF_NM.length; j++) {
        this.data.setchartstyling(this.APP_ID, this.PRCS_ID, this.SRC_ID, this.V_PRF_NM[j], this.V_PRF_VAL[j]).subscribe(
          () => {
            //(res);
          });
        }
  }

  //__________________________Get Preferences________________________________
  getchartpreferences() {
        if(this.userprefs['backgroundcolor']!=undefined)
        this._backgroundColor = this.userprefs['backgroundcolor'];
        if(this.userprefs['bordercolor']!=undefined)
        this._borderColor = this.userprefs['bordercolor'];
        if(this.userprefs['fill']!=undefined)
        this._fill = this.userprefs['fill'];
        if(this.userprefs['pointstyle']!=undefined)
        this._pointstyle = this.userprefs['pointstyle'];
        if(this.userprefs['linetension']!=undefined)
        this._linetension = this.userprefs['linetension'];
        if(this.userprefs['animations']!=undefined)
        this._animations = this.userprefs['animations'];
        if(this.userprefs['pointradius']!=undefined)
        this._pointradius = this.userprefs['pointradius'];
        if(this.userprefs['linestyle']!=undefined)
        this._linestyle = this.userprefs['linestyle'];
        if(this.userprefs['gridlinedashed']!=undefined)
        this._gridborder = this.userprefs['gridlinedashed'];

        this._fill.toString().toUpperCase() == "TRUE" ? this._fill = true : this._fill = false;
        this._linestyle == "dashed" ? this._borderdash = [5, 5] : this._borderdash = [];
        this._gridborder.toString().toUpperCase()=="TRUE" ? this._gridborder = true : this._gridborder = false;
        this._gridlinewidth = this.userprefs['linewidth'];
        this._yaxisAutoskip.toString().toUpperCase() == "TRUE" ? this._yaxisAutoskip = true : this._yaxisAutoskip = false;
        if(this.userprefs['linexaxis']!= undefined && this.userprefs['linexaxis']!="")
        this._xaxis_sel_line = this.userprefs['linexaxis'];
        if(this.userprefs['lineyaxis']!= undefined && this.userprefs['lineyaxis']!="")
        this._yaxis_sel_line = this.userprefs['lineyaxis'].toString().split(',');
        if(this.userprefs['barxaxis']!= undefined && this.userprefs['barxaxis']!="")
        this._xaxis_sel_bar = this.userprefs['barxaxis'];
        if(this.userprefs['baryaxis']!= undefined && this.userprefs['baryaxis']!="")
        this._yaxis_sel_bar = this.userprefs['baryaxis'].toString().split(',');
        if(this.userprefs['piexaxis']!= undefined && this.userprefs['piexaxis']!="")
        this._xaxis_sel_pie = this.userprefs['piexaxis'];
        if(this.userprefs['pieyaxis']!= undefined && this.userprefs['pieyaxis']!="")
        this._yaxis_sel_pie = this.userprefs['pieyaxis'].toString().split(',');
        if(this.userprefs['doughnutxaxis']!= undefined && this.userprefs['doughnutxaxis']!="")
        this._xaxis_sel_doughnut = this.userprefs['doughnutxaxis'];
        if(this.userprefs['doughnutyaxis']!= undefined && this.userprefs['doughnutyaxis']!="")
        this._yaxis_sel_doughnut = this.userprefs['doughnutyaxis'].toString().split(',');

        if(this.userprefs['selectedchart']!=undefined && this.userprefs['selectedchart']!="")
        this.selectedchart = this.userprefs['selectedchart'].toString().split(',');

        this.updatechart();
  }
  gettablepreferences(){
    if(this.userprefs['displaychoice']!=undefined){
    this.show_choice = this.userprefs['displaychoice'];
    this.showhide(this.userprefs['displaychoice']) 
    }
        if(this.userprefs['hiddencolname']!=undefined){
        var a = this.userprefs['hiddencolname'].toString();
        this.hiddencols = a.split(',');
        for(let i=0;i<this.hiddencols.length;i++){
          if(this.hiddencols.includes("")){
            var emptyindex = this.columnsToDisplay.indexOf(this.hiddencols[""]);
            this.hiddencols.splice(emptyindex,1);
          }
        var index = this.columnsToDisplay.indexOf(this.hiddencols[i]);
        if (index > -1) {
          this.columnsToDisplay.splice(index, 1);
        }
      }
    }
  }
  getpreferences(){
    this.data.getchartstyling(this.APP_ID, this.PRCS_ID, this.SRC_ID).subscribe(
      res => {
        (res.json());
        var result = res.json();
        console.log(result);
        
        var name = result.PRF_NM;
        var value = result.PRF_VAL;
        this.V_PRF_NM = name;
        this.V_PRF_VAL = value;
        for (let i = 0; i < name.length; i++) {
          this.userprefs[name[i]] = value[i];
        }
        this.gettablepreferences();
        this.getchartpreferences();
        console.log(this.userprefs);
      });
  }

  ngOnInit() {
    this.getReportData();
    this.Table_of_Data3 = this.Table_of_Data2[0];

    this.Table_of_Data5 = JSON.parse(this.Table_of_Data1[0]);
    //(this.Table_of_Data5);
    var keyy = [];
    keyy = Object.keys(this.Table_of_Data5);
    var vals = [];
    vals = Object.values(this.Table_of_Data5);
    //(keyy);
    //(vals);

    for (let j = 0; j < vals.length; j++) {
      while (vals[j].indexOf(" ") != -1) {
        vals[j].splice(vals[j].indexOf(" "), 1, "----");
      }
      while (vals[j].indexOf("") != -1) {
        vals[j].splice(vals[j].indexOf(""), 1, "----");
      }
    }
    for (let i = 0; i < keyy.length; i++) {
      this.tabledata[keyy[i]] = vals[i];
    }
    //(vals);
    this.Table_of_Data5 = this.tabledata;
    //(this.Table_of_Data5);
    //(this.Table_of_Data5['PIID']);
    this.F1 = this.Table_of_Data5[this.columnsToDisplay[0]];
    for (let i = 0; i < this.F1.length; i++) {
      let rowData = {};
      for (let j = 0; j < this.columnsToDisplay.length; j++) {

        let key = this.columnsToDisplay[j];
        rowData[key + ""] = this.Table_of_Data5[key + ""][i];
      }
      this.Table_of_Data4[i] = rowData;
      //(this.Table_of_Data4);
    }

    for (let j = 0; j <= this.columnsToDisplay.length; j++) {
      this.https.get(this.apiService.endPoints.secure + "FieldName=" + this.columnsToDisplay[j] + "&REST_Service=Field_Description&Verb=GET", this.apiService.setHeaders())
        .subscribe(res => {
          var data: data = res.json();
          var name = data.Field_Name;
          var tip = data.Description_Text;
          var i;
          for (i = 0; i < tip.length; i++) {
            this.helpertext[name[i]] = tip[i];
          }
        })

    }
this.getpreferences();
  }

  ExecuteAgain() {
    this.Execute_Now();

  }
  Redirect_to_user() {
    //   var timezone = new Date();

    //   var Intermediatetimezone = timezone.toString()
    //   let body = {
    //     "V_USR_NM":this.V_USR_NM,
    //     "V_PRCS_TXN_ID":this.PRCS_TXN_ID,
    //     "V_SRC_ID":this.SRC_ID,
    //     "V_APP_ID":this.APP_ID,
    //     "V_PRCS_ID":this.PRCS_ID,
    //     "V_SRVC_ID":this.SRVC_ID,
    //     "V_RELEASE_RSN":"Cancelled Navigation "+this.SRVC_CD,
    //     "V_OPERATION":"MANUALDELETE",
    //     "TimeZone":Intermediatetimezone,
    //     "REST_Service":"Form_Report",
    //     "Verb":"PUT"
    //   };
    //   //(body);
    //    this.https.put("https://"+this.domain_name+"/rest/Process/Submit/FormSubmit", body).subscribe(
    //     res => {
    //       //(res);

    //  });
    // console.log('exitbtn_click');
    this.endUserService.processCancel(this.SRVC_ID, this.PRCS_TXN_ID, this.globals.Report.TEMP_UNIQUE_ID[0]).subscribe(
      () => {
        // console.log('Response:\n', res);
        this.route.navigateByUrl('End_User', { skipLocationChange: true });
      });
  }

  showhidecol(col) {

    if (this.columnsToDisplay.includes(col)) {
      this.hiddencols.push(col);
      var index = this.columnsToDisplay.indexOf(col);
      if (index > -1) {
        this.columnsToDisplay.splice(index, 1);
      }
    }
    this.settablepreferences();
  }
  //__________________________________________________________
  Execute_res_data: any[];
  // progress: boolean = false;
  Execute_Now() {
    // this.progress = true;
    let body = {
      "V_APP_CD": this.Exe_data['SL_APP_CD'].toString(),
      "V_PRCS_CD": this.Exe_data['SL_PRC_CD'].toString(),
      "V_SRVC_CD": 'START',
      "V_SRC_CD": this.V_SRC_CD,
      "V_USR_NM": this.V_USR_NM

    };

    this.https.post(this.apiService.endPoints.secureProcessReport, body, this.apiService.setHeaders()).subscribe(
      res => {
        this.Execute_res_data = res.json();
        this.route.navigateByUrl('End_User', { skipLocationChange: true });
      }
    );
  }
  GenerateReportTable() {
    let body = {
      V_SRC_ID: this.Execute_res_data['V_SRC_ID'],
      // 10th April
      // V_UNIQUE_ID: this.Execute_res_data['V_UNIQUE_ID'],
      // V_APP_ID: this.Execute_res_data['V_APP_ID'],
      // V_PRCS_ID: this.Execute_res_data['V_PRCS_ID'],
      V_PRCS_TXN_ID: this.Execute_res_data['V_PRCS_TXN_ID'],
      // V_NAV_DIRECTION: this.Execute_res_data['V_NAV_DIRECTION'],
      V_USR_ID: this.globalUser.currentUser.USR_ID,
      // V_DSPLY_WAIT_SEC: 100,
      // V_MNL_WAIT_SEC: 180,
      REST_Service: 'Report',
      Verb: 'POST'
    }
    // insecure
    // this.https.post(this.apiService.endPoints.insecureProcessReport, body)
    //   .subscribe(
    //     res => {
    //       //(res.json());
    //       this.dataStored.setCookies("report_table", res.json());

    //     }
    //   );

    // secure

    this.https.post(this.apiService.endPoints.secureProcessReport, body, this.apiService.setHeaders())
      .subscribe(
        res => {
          //(res.json());
          this.dataStored.setCookies("report_table", res.json());

        }
      );
    // this.progress = false;
    this.getReportData();
  }
  dialogOpen = false;
  dialogRef: any;
  ganttChart() {
    ("Gantt Chart");
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      this.dialogRef = this.dialog.open(DialogChartsComponent, {
        panelClass: 'custom-dialog-container',
        width: '60%',
        data: { Execute_res_data: { V_APP_ID: this.APP_ID, V_SRC_ID: this.SRC_ID, V_PRCS_ID: this.PRCS_ID, V_PRCS_TXN_ID: this.PRCS_TXN_ID }, type: 'gantt' }
      });
      this.dialogRef.afterClosed().subscribe(() => {
        this.dialogOpen = false;
      });

    }

  }

  barChart() {
    ("Bar Chart");
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      this.dialogRef = this.dialog.open(DialogChartsComponent, {
        panelClass: 'custom-dialog-container',
        width: '60%',
        data: { Execute_res_data: { V_APP_ID: this.APP_ID, V_SRC_ID: this.SRC_ID, V_PRCS_ID: this.PRCS_ID, V_PRCS_TXN_ID: this.PRCS_TXN_ID }, type: 'bar' }
      });
      this.dialogRef.afterClosed().subscribe(() => {
        this.dialogOpen = false;
      });

    }
  }

  pieChart() {
    ("Pie Chart");
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      this.dialogRef = this.dialog.open(DialogChartsComponent, {
        panelClass: 'custom-dialog-container',
        width: '60%',
        data: { Execute_res_data: { V_APP_ID: this.APP_ID, V_SRC_ID: this.SRC_ID, V_PRCS_ID: this.PRCS_ID, V_PRCS_TXN_ID: this.PRCS_TXN_ID }, type: 'pie' }
      });
      this.dialogRef.afterClosed().subscribe(() => {
        this.dialogOpen = false;
      });

    }
  }
  //currency = 'USD';
  //price: number;
}

export interface data {
  Field_Name: string[];
  Description_Text: string[];

}