import { Component, OnInit } from '@angular/core';
//import { UserService } from '../../../../_services/user.service';
import { UserService } from '../../_services/user.service';
import { StorageService } from '../../_services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { LoadingService } from '../../_services/loading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent  implements OnInit{

  loading:boolean;
  formLogin: FormGroup;
  textErrorLogin = "";

  constructor(private userService:UserService,
              private storageService:StorageService,
              private formBuilder: FormBuilder,
              private loadingService:LoadingService,
              private router:Router
             ) {
               this.formLogin = this.formBuilder.group({
                    email: ['7770895@exemple.fr', Validators.required],
                    password: ['P@ssword123', Validators.required],
               });
             }

  ngOnInit(): void {}

  onLogin(){
    if (this.formLogin.invalid) {
        if(this.formLogin.controls["email"].value.trim() == "")
        this.textErrorLogin = "Veuillez saissir email";
        else
        this.textErrorLogin = "Veuillez mot de passe";
    }
    else {
          this.userService.login({email:this.formLogin.controls["email"].value, password:this.formLogin.controls["password"].value})
                            .subscribe(response =>
                                        {
                                          console.log(response);
                                            if(response.token && response.token.token_value){
                                              this.storageService.saveToken(response.token.token_value);
                                              this.storageService.saveUser(response.user_authenticated);
                                              console.log(response.user_authenticated);
                                              this.router.navigate(["/"]);
                                            }

                                            this.loadingService.changeCurrentStateSideBare(false);
                                            location.reload();
                                        },
                                        err =>
                                        {
                                                this.loading = false;
                                                this.textErrorLogin = err.error.message,
                                                this.loadingService.changeCurrentStateSideBare(false);
                                        }
                              );
        }
  }


 }
