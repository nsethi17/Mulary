import { Component, OnInit } from '@angular/core';
import { EmailValidator } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let log_btn = document.getElementById("login_btn");
    log_btn.addEventListener("click",login_check);
  }

}
var login_flag = false//login flag 

function login_check(params:any) {
  let ev = email_validation();
  let pc =password_Check();
  if(ev && pc){
    document.getElementById("user_login").style.display = "none";
    document.getElementById("parts_logout").style.display = "block";
    login_flag = true;

  }

}

function email_validation(){
    //username sanitization
  var eregex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
  let email = (document.getElementById("email") as HTMLInputElement).value;
    if (email!=="" && Boolean(email.match(eregex))){
      return true;
  }
    else{
      alert("You have entered an invalid email address!");
      return false;
  }
}

function password_Check (){
  let password = (document.getElementById("password") as HTMLInputElement).value;
  if(password == ""|| password.length<6){
    alert("Password should be atleast 6 characters");
    return false;
  }
  else{
    return true;
  }
}

