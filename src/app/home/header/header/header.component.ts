import { Component, OnInit } from '@angular/core';

import { Router,ActivatedRoute } from "@angular/router";
import { UserService } from 'src/app/core/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  // styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  options:any=[];
  showprofilebtn:boolean=true;
  public userName:string = '';
  public agency:string = '';
  public index:any;
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private userService:UserService
  ) {
     this.index = this.userName.indexOf('@');
     this.userName = this.userName.substring(0,this.index).toUpperCase();
    if(this.userName == undefined){
      this.router.navigate(['']);
    }
  }
  switchprofile(){
    this.router.navigate(['Profile']);
  }
  ngOnInit() {
    this.userName = this.userService.getDetailFromStorage(). SRC_CD;
    this.agency = this.userService.getDetailFromStorage(). SRC_CD;
    if(this.options)this.options.length==0 ? this.showprofilebtn=false:this.showprofilebtn=true;

  }

  logout(){
    this.userService.clear();
    this.router.navigate(['/auth/login']);
  }

}