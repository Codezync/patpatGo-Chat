import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  role: string;

  constructor() { }

  setAgentRole(role: string){
    localStorage.setItem('role', role)
  }

  getAgentRole(){
    this.role = localStorage.getItem('role')
    return this.role;
  }
}
