import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private _http: HttpService) {}
  test: any
  
  ngOnInit() {
    let log_btn = document.getElementById("login_btn");
    log_btn.addEventListener("click",this.login_check);
    let signup_btn = document.getElementById("signup_btn");
    signup_btn.addEventListener("click",this.newUserDetails);
    this.display();
   
  }

  display(){ 
    if(sessionStorage.getItem('login_flag')=='true'){
      document.getElementById("user_login").style.display = "none";
      document.getElementById("parts_logout").style.display = "block";     
    }

  }
//user login
    login_check =() => {
      let email = (document.getElementById("email") as HTMLInputElement).value;
      let password = (document.getElementById("password") as HTMLInputElement).value;
      let ev = email_validation(email);
      let pc =password_Check(password);
      if(ev && pc){
        let u = {email: email, password: password}
        this._http.user_login(u).subscribe(test =>{ //confirming if user exists in db or not
          if(test.login == "success"){
             sessionStorage.setItem("login_flag","true");
            if(sessionStorage.getItem("login_flag") =="true" && test.status =="active"){
              sessionStorage.setItem("access-token",test.token);
              this.display()
        
            }
            else{
              window.alert('Please verify your email')
              this.display()
            }
          }
          else{
            window.alert("login failed! Make sure username and password is correct")
            }
      
          
        });
        
        
      }
  
  }

  //New User Signup
  newUserDetails = () => {
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
      let u = {email:nuemail, password:nupassword, status:"inactive"}
      let em = email_validation(nuemail);
      let pw = password_Check(nupassword);
      if(em && pw){
        

        this._http.user_signup(u).subscribe(test =>{ 
          if(test.result == "success"){
            sessionStorage.setItem("loginflag","true")
            if(sessionStorage.getItem("login_flag")=="true"){
              window.alert("A link has been sent to your email, please verify!")
              document.getElementById("user_login").style.display = "none";
              document.getElementById("parts_logout").style.display = "block";
              w.style.display = "none";
        
            }
          }
          else{
            window.alert("User already exists")
            }
      
          
        });
  
      }
    }
  }

}

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
