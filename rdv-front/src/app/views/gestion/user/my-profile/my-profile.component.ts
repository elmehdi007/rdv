import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../_services/user.service';
import { CountryService } from '../../../../_services/country.service';
import { StorageService } from '../../../../_services/storage.service';
import { RoleService } from '../../../../_services/role.service';
import { ConfirmationService, MessageService, PrimeNGConfig, LazyLoadEvent} from "primeng/api";
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent implements OnInit {

  formUpdateUser: FormGroup;
  loading:boolean;
  cities:any = [];
  countries:any = [];
  user:any;
  myRoles:any = [];


  @ViewChild('avatarUpload') avatarUpload;

  constructor(private userService:UserService,
              private storageService:StorageService,
              private countryService:CountryService,
              private roleService:RoleService,
              private formBuilder: FormBuilder,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private primengConfig: PrimeNGConfig) {}

  ngOnInit(): void {
        this.formUpdateUser = this.formBuilder.group({
            id_user:[null],
            id_country: [null],
            email: [null],
            id_city: [null],
            lname: ['', Validators.required],
            fname: ['', Validators.required],
            phone: [null],
            address: [''],
            date_birth: [null],
            password: [''],
        });

        this.searchCountry();
        this.user = this.storageService.getUser();
        console.log(this.user);

        this.formUpdateUser.setValue({
              id_user: this.user.id_user,
              id_country: this.user.id_country,
              id_city: this.user.id_city,
              lname: this.user.lname,
              fname: this.user.fname,
              phone: this.user.phone,
              address: this.user.address,
              date_birth:  new Date(this.user.date_birth),
              password:null,
              email:this.user.email,
          });

          if(this.user.id_country)  this.getCityByCountry(this.user.id_country);
          this.getUserRoles(this.user.id_user);
  }

  searchCountry() {
      this.countryService.search({}).subscribe(
                   response => {
                     this.countries = response.data.rows;
                     this.loading = false;
                   },
                   err => {
                     this.loading = false;
                     this.messageService.add({
                        severity: "warn",
                        summary: "Erreur",
                        detail: err.error.message
                      });
                   }
        );
        console.log(event);
  }

  getCityByCountry(id_country) {
      this.countryService.getCityByCountry({id_country:id_country}).subscribe(
                   response => {
                     this.cities = response.data.rows;
                     this.loading = false;
                   },
                   err => {
                     this.loading = false;
                     this.messageService.add({
                        severity: "warn",
                        summary: "Erreur",
                        detail: err.error.message
                      });
                   }
        );
  }

  getUserRoles(id_user) {
      this.userService.getUserRoles({id_user:id_user}).subscribe(
                   response => {
                     this.loading = false;
                     this.myRoles = response.data.rows;
                     this.myRoles.forEach(element => {
                         element.state = true;
                    });
                   },
                   err => {
                     this.loading = false;
                     this.messageService.add({
                        severity: "warn",
                        summary: "Erreur",
                        detail: err.error.message
                      });
                   }
        );
  }

  onChangeConntry(id_country:number) {
      this.getCityByCountry(id_country);
  }

  update(){

      let body:any = {
        id_city: this.formUpdateUser.controls["id_city"].value,
        lname: this.formUpdateUser.controls["lname"].value,
        fname: this.formUpdateUser.controls["fname"].value,
        phone: this.formUpdateUser.controls["phone"].value,
        address: this.formUpdateUser.controls["address"].value,
        date_birth: this.formUpdateUser.controls["date_birth"].value ,
        email: this.formUpdateUser.controls["email"].value ,
        id: this.formUpdateUser.controls["id_user"].value ,
      };

      if (this.formUpdateUser.invalid) {
           this.messageService.add({
             severity: "warn",
             summary: "Creation",
             detail: "Veuillez verifier les champs"
           });
      }

      else{
            this.userService.update(body).subscribe(
                       response => {
                           this.messageService.add({
                              severity: "info",
                              summary: "Modification",
                              detail: response.message
                            });
                            this.user.id_city = this.formUpdateUser.controls["id_city"].value;
                            this.user.lname = this.formUpdateUser.controls["lname"].value;
                            this.user.fname = this.formUpdateUser.controls["fname"].value;
                            this.user.phone = this.formUpdateUser.controls["phone"].value;
                            this.user.address = this.formUpdateUser.controls["address"].value;
                            this.user.date_birth = this.formUpdateUser.controls["date_birth"].value;
                            this.user.email = this.formUpdateUser.controls["email"].value;
                            this.user.id_user = this.formUpdateUser.controls["id_user"].value;
                            this.storageService.saveUser(this.user);
                       },
                       err => {
                         this.loading = false;
                         this.messageService.add({
                            severity: "warn",
                            summary: "Modification",
                            detail: err.error.message
                          });
                       }
            );
      }
  }

  uploadMyAvatar(event){
    var formdata = new FormData();
    if(this.avatarUpload.files.length > 0){
        let file: File = this.avatarUpload.files[0];
        let formdata = new FormData();
        formdata.append("avatar_name", file.name);
        formdata.append("avatar", file);
        formdata.append("id", this.user.id_user);
        this.userService.updateFile(formdata).subscribe(
                   response => {
                       this.messageService.add({
                          severity: "info",
                          summary: "Modification",
                          detail: response.message
                        });
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                   },

                   err => {
                     this.loading = false;
                     this.messageService.add({
                        severity: "warn",
                        summary: "Modification",
                        detail: err.error.message
                      });
                   }
        );
    }

    else {
      this.messageService.add({
         severity: "warn",
         summary: "Modification",
         detail: "Veuillez specifier l'image"
       });
    }
  }

  beforeUpload(event){
    alert("sdqsdqs")
    console.log(event);
  }

}
