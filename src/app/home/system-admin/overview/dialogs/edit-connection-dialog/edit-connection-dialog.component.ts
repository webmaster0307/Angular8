import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ConfigServiceService } from '../../../../../services/config-service.service';

@Component({
  selector: 'app-edit-connection-dialog',
  templateUrl: './edit-connection-dialog.component.html',
  styleUrls: ['./edit-connection-dialog.component.scss']
})
export class EditConnectionDialogComponent implements OnInit {
  public connectionTypes;
  public V_SRC_CD:string;
  public V_CXN_CD;
  public V_CXN_DSC;
  public V_CXN_TYP;
  public DATA;
  PLF_CD:string = "Amazon";
  PLF_DSC:string = 'Apache Tomcat Web Server';
  PLF_TYPE=[];
  PLF_DATA;

  constructor(public dialogRef: MatDialogRef<EditConnectionDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private http:HttpClient, private config:ConfigServiceService) { }

  ngOnInit() {
    this.config.getPlatformType().subscribe(res=>{this.PLF_TYPE=res.json();
      (this.PLF_TYPE);
      // this.PLF_CD=this.PLF_TYPE['SERVER_CD'];
    });
    this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.http.get('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_SRC_CD='+ this.V_SRC_CD +'&V_CXN_TYP='+ this.data.cnxData.V_CXN_TYP +'&REST_Service=Params_of_CXN_Type&Verb=GET').subscribe(res => {
      this.DATA = res;
    })
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  platformDescription(){

    this.config.getPlatformDescription(this.PLF_CD).subscribe(
      res=>{
        this.PLF_DATA=res.json();
        (this.PLF_DATA);
        this.PLF_DSC=this.PLF_DATA['SERVER_DSC'];
      });
  }

  onBtnEditClick(connectionData) {
    let V_PARAM_N = '';
    let V_PARAM_V = '';
    Object.keys(connectionData).forEach((key, index) => {
      if(key == "V_CXN_CD" || key == "V_CXN_DSC" || key == "V_CXN_TYP" || key == "PLF_CD" || key == "PLF_DSC") {

      } else {
        V_PARAM_N += key + "|";
        V_PARAM_V += connectionData[key] + "|"
      }
    })

    var data = {
      "V_CXN_CD":connectionData.V_CXN_CD,
      "V_CXN_TYPE":connectionData.V_CXN_TYP,
      "V_SRC_CD":this.V_SRC_CD,
      "V_PARAM_N":V_PARAM_N,
      "V_PARAM_V":V_PARAM_V,
      "V_PLATFORM_CD":this.PLF_CD,
      "V_PLATFORM_DCS":this.PLF_DSC,
      "REST_Service":["CXN"],
      "Verb":["PUT"]
    }
    // this.http.put('https://enablement.us/Enablement/rest/v1/securedJSON?', data).subscribe(res => {
    //   this.dialogRef.close(true);
    // }, err => {

    // })
  }

}
