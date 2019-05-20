import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd, Event } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { Globals } from 'src/app/services/globals';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  //   styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  
  public selectedProfile = '';

  constructor(private router: Router, private StorageSessionService: StorageSessionService, private globals: Globals,
    public toastr: ToastrService,

    private http: HttpClient
  ) {


  }
  domain_name = this.globals.domain_name;
  options = [];
  optionSelected: string = "";
  chooworkingProfile() {
    const data = {
      agency : JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM
    };
    this.http.get<data>("https://" + this.domain_name + "/rest/v1/secured?V_SRC_CD=" + data.agency + "&V_USR_NM=" + data.V_USR_NM + "&REST_Service=UserRoles&Verb=GET").subscribe(
      data => {
        // (data);
        if (data.ROLE_CD) {
          for (let i = 0; i < data.ROLE_CD.length; i++) {
            // (data.ROLE_CD[i]);
            if (data.ROLE_CD[i] == "Developer Role") {
              this.options.push("Developer");
            } else if (data.ROLE_CD[i] == "End User Role") {
              this.options.push("End_User");
            } else if (data.ROLE_CD[i] == 'System Admin Role') {
              this.options.push("System_Admin");
            } else if (data.ROLE_CD[i] == 'Finance Role') {
              this.options.push("Cost");
            }
            else if (data.ROLE_CD[i] == 'IT Asset Role') {
              this.options.push("Assets");
            } else if (data.ROLE_CD[i] == 'User Admin Role') {
              this.options.push("User_Admin");
            }

          }
        }
      });
  }

  //Selected option in the profile section
  optionSelecteds(e: any) {
     //console.log(e);
     this.selectedProfile = e;
    //if(e.split(" ") > 0)
    // this.toastr.info("your profile "+e+"profile");
    this.router.navigateByUrl(e.replace(" ", "_"), { skipLocationChange: true });
    //this.router.navigateByUrl(e);
  }
  ngOnInit() {
    this.chooworkingProfile();
    // let url:string="user";
    // this.router.navigateByUrl(url);
    if(this.router.url == "/End_User/Execute") {
      this.selectedProfile = "End_User";
    } else if(this.router.url == "/User_Admin/Adminuser") {
      this.selectedProfile = "User_Admin";
    } else if(this.router.url == "/Developer") {
      this.selectedProfile = "Devloper";
    } else if(this.router.url == "/System_Admin/AppDeploy") {
      this.selectedProfile = "System_Admin";
    }
  }

}

export interface data {
  ROLE_CD: string[];
}

