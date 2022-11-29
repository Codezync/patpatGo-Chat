import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatSharedService } from 'src/app/chat/services/chat-shared.service';
import { GlobalService } from 'src/app/common/global.service';

import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AuthResponse, UserInfo, loginUser } from '../_models/signin.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = `${environment.baseUrl}`;
  permission: boolean = false;
  agentRole: string;

  private currentUserSubject: BehaviorSubject<AuthResponse>;
  public currentUser: Observable<AuthResponse>;

  private userInformation!: UserInfo;
  loginUser: any;

  client_id: string ='patpatApi';
  client_secret: string = '8G5TvcMWW7kyCYUWXvaf4Q8NpPCChDut8Z7n';
  grant_type: string = 'password';


  constructor(
    private http: HttpClient,
    private router: Router,
    private chatSharedService: ChatSharedService,
    private globalService: GlobalService
  ) {
      this.currentUserSubject = new BehaviorSubject<any>(null);
      this.currentUser = this.currentUserSubject.asObservable();
  }


  public get currentUserValue(): AuthResponse {
    return this.currentUserSubject.value;
  }


  login(loginUser: loginUser){
    this.loginUser = loginUser;

    const myheader = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    let body = new URLSearchParams();

    body.set('client_id',this.client_id );
    body.set('client_secret',this.client_secret);
    body.set('grant_type',this.grant_type);
    body.set('Username',loginUser.Username);
    body.set('Password',loginUser.Password);

    return this.http.post<AuthResponse>(this.baseUrl+'connect/token',  body.toString(), {
        headers: myheader})
        .pipe(map(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.setAgentDetails(loginUser.Username);
          return user;
    }))
  }


  setAgentDetails(agentId: string){
    localStorage.setItem('agentId', agentId)
  }


  logout(){
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }


  userInfo(){
    return new Promise((resolve, reject) => {
      let token = JSON.parse(localStorage.getItem('currentUser')!);

      const header = new HttpHeaders().set(
          "Authorization", `Bearer ${token.access_token}`
      );

      this.http.post<any>(this.baseUrl+'connect/userInfo', null, {headers: header})
        .subscribe(res =>{
          this.userInformation = res;
          this.setUserInfo();
        }), (error: any) => {
          //console.log(error);
      }
      return resolve(true);
   });
  }


  setUserInfo(){
    this.permission = false;
    localStorage.setItem('agentName', this.userInformation.name);
    const roleType = typeof(this.userInformation.role);
    const role = this.userInformation.role

    if(roleType === 'string'){
      if(role == 'Operations'){
        localStorage.setItem('role', 'Operations');
        this.agentRole = 'Operations';
        this.permission = true;
      }else if(role == 'CallCenter'){
        localStorage.setItem('role', 'CallCenter');
        this.agentRole = 'CallCenter';
        this.permission = true;
      }else{
        Swal.fire({
          icon: 'error',
          text: 'You do not have permission!',
        })
      }

    }else{
      if(role.includes('CallCenter')){
        localStorage.setItem('role', 'CallCenter');
        this.agentRole = 'CallCenter';
        this.permission = true;
      }else if(role.includes('Operations')){
        localStorage.setItem('role', 'Operations');
        this.agentRole = 'Operations';
        this.permission = true;
      }
     else{
        Swal.fire({
          icon: 'error',
          text: 'You do not have permission!',
        })
      }
    }

    if(this.permission == true){
      this.globalService.setAgentRole(this.agentRole)
      this.router.navigate(['/home']);
    }

  }


  refreshToken() {
    let token = JSON.parse(localStorage.getItem('currentUser')!);
    const myheader = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    let body = new URLSearchParams();

    let refreshtoken = token !=null ? token.refresh_token : "";

    body.set('client_id',this.client_id );
    body.set('client_secret',this.client_secret);
    body.set('grant_type','refresh_token');
    body.set('refresh_token',refreshtoken);

    return this.http.post<AuthResponse>(this.baseUrl+'connect/token',  body.toString(), {
      headers: myheader})
        .pipe(map((user) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          //this.setDetails(loginUser.Username)
          // this.startRefreshTokenTimer();
          return user;
        }));
  }


  getUsermail(){
    return this.userInformation.email;
  }


  getUsername(){
    return this.userInformation.name;
  }
}
