import { Component, OnInit } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private _http: HttpService) {}
  test: String 

  ngOnInit() {
    let log_btn = document.getElementById("login_btn");
    log_btn.addEventListener("click",this.login_check);
    let signup_btn = document.getElementById("signup_btn");
    signup_btn.addEventListener("click",newUserDetails);
  }
//user login
    login_check =() => {

      let email = (document.getElementById("email") as HTMLInputElement).value;
      let password = (document.getElementById("password") as HTMLInputElement).value;
      let ev = email_validation(email);
      let pc =password_Check(password);
      if(ev && pc){
        let u = {email: email, password: password}
        let login_flag = false;
        this._http.user_login(u).subscribe(test =>{ //confirming if user exists in db or not
          if(test.login == "success"){
            login_flag = true;
            if(login_flag){
              document.getElementById("user_login").style.display = "none";
              document.getElementById("parts_logout").style.display = "block";
        
            }
          }
          else{
            window.alert("login failed! Make sure username and password is correct")
            }
      
          
        });
        
        
      }
  
  }

}
var login_flag = false//login flag 


function email_validation(email){
    //username sanitization
  var eregex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
  
    if (email!=="" && Boolean(email.match(eregex))){
      return true;
  }
    else{
      alert("You have entered an invalid email address!");
      return false;
  }
}

function password_Check (password){
  
  if(password == ""|| password.length<6){
    alert("Password should be atleast 6 characters");
    return false;
  }
  else{
    return true;
  }
}

function newUserDetails(){
  let w = document.getElementById("signup_pop");
  let btn = document.getElementById("signup_confirm");
  w.style.display="block";
  
  window.onclick = function(event) {
    if (event.target == w) {
      w.style.display = "none";
    }
  }
  btn.onclick= () => { 

    let nuemail = (document.getElementById("nuemail") as HTMLInputElement).value;
    let nupassword = (document.getElementById("nupassword") as HTMLInputElement).value;
    console.log(nuemail)

    let em = email_validation(nuemail);
    let pw = password_Check(nupassword);
    if(em && pw){
      document.getElementById("user_login").style.display = "none";
      document.getElementById("parts_logout").style.display = "block";
      w.style.display = "none";

    }
  }
}

