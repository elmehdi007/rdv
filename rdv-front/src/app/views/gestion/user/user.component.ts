import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_services/user.service';
import { EntrepriseService } from '../../../_services/entreprise.service';
import { CountryService } from '../../../_services/country.service';
import { StorageService } from '../../../_services/storage.service';
import { RoleService } from '../../../_services/role.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, PrimeNGConfig, LazyLoadEvent} from "primeng/api";
import { formatDate } from '@angular/common';
import { LoadingService } from '../../../_services/loading.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  totalRecords:number = 0;
  loading:boolean;
  users: any;

  formUser: FormGroup;
  formPassworUser: FormGroup;
  showUserFormDialog: boolean;
  showUserPasswordFormDialog: boolean;
  showUserRoleFormDialog:boolean;
  isNewUser: boolean;
  generatedPswrd: string = "";

  cities:any = [];
  countries:any = [];
  roles:any = [];
  idUserForAffectRole:number;

  showUserentreprise:boolean;
  user_client_entreprise:any[];
  user_prodvider_entreprise:any[];
  entreprise_client = [];
  entreprise_provider = [];
  entreprise = [];

  id_role:any;

  bodySearch:any={fname:'',lname:'',phone:'',email:''};


  constructor(private userService:UserService,
              private entrepriseService:EntrepriseService,
              private storageService:StorageService,
              private roleService:RoleService,
              private countryService:CountryService,
              private formBuilder: FormBuilder,
              private loadingService:LoadingService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private primengConfig: PrimeNGConfig,) {}

  ngOnInit(): void {
    this.searching();
    this.searchCountry();
    this.formUser = this.formBuilder.group({
        id_country: [null],
        email: [null, Validators.required],
        id_city: [null],
        lname: ['', Validators.required],
        fname: ['', Validators.required],
        phone: [null],
        id_entreprise: ["",Validators.required],
        address: [''],
        date_birth: [null],
        password: [''],
        id_user:[''],
    });

    this.formPassworUser = this.formBuilder.group({
        password: ['', Validators.required],
        id_user:['', Validators.required],
    });

    this.searchEntreprise();
  }

  searcRole(idsRolesActived = null){
    this.roleService.search({}).subscribe(
                 response => {
                   this.roles = response.data.rows;
                   this.loading = false;
                   console.log("this.roles"); console.log(this.roles);
                   this.roles.forEach(element => {
                      if( idsRolesActived.includes(element.id) ){
                        element.isActive = true
                        this.id_role=element
                        console.log(element.id);
                        
                      }
   
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

  searchCountry() {
      this.countryService.search({get_all_recorder:true}).subscribe(
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

  getCityByCountry(id_country:number) {
      this.countryService.getCityByCountry({id_country:id_country,get_all_recorder:true}).subscribe(
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

  onChangeConntry(id_country:number) {
      this.getCityByCountry(id_country);
  }

  searching(event: LazyLoadEvent=null) {
    if(event){
            this.bodySearch.skip =  event.first;
            this.bodySearch.take =  event.rows;
            this.bodySearch.sortBy =  event.sortField;
            this.bodySearch.sortDir =   (event.sortOrder>0)?"asc":"desc";
     }

      this.loading = true;
      this.userService.searching(this.bodySearch).subscribe(
                   response => {
                     this.users = response.data.rows;
                     this.totalRecords = response.data.total_without_filter;
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

  genererPswrd(){
      const generatedPswrd = this.storageService.generatePassword();
      this.formPassworUser.controls["password"].setValue(generatedPswrd);
      this.formUser.controls["password"].setValue(generatedPswrd);
  }

  onEdit(user = null){
    this.showUserFormDialog = true;

    if(user){
      this.isNewUser = false;
      console.log(user);
      
        this.formUser.setValue({
              id_country: user.id_country,
              id_city:  user.id_city,
              lname: user.lname,
              fname: user.fname,
              phone: user.phone,
              address: user.address,
              id_entreprise:user.id_entreprise,
              date_birth:  new Date(user.date_birth),
              password:null,
              email:user.email,
              id_user:user.id,
          });

        if(user.id_country)  this.getCityByCountry(user.id_country);
    }
    else {
      this.isNewUser = true;
      this.formUser.reset();
    }
  }

  onEditUserRole(user = null){
      this.showUserRoleFormDialog = true;
      this.idUserForAffectRole = user.id;
      let idsRolesActived = [];
      this.userService.getUserRoles({id_user:user.id}).subscribe(
                   response => {
                     this.loading = false;
                     response.data.rows.forEach(element => {
                        idsRolesActived.push(element.id)
                     });
                     this.searcRole(idsRolesActived);
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

  updateRole(){
    let body:any = {id_user:this.idUserForAffectRole, ids_roles:[this.id_role.id]};
    //this.roles.forEach(role => { if(role.isActive)  body.ids_roles.push(role.id)});

    this.roleService.addRolesToUser(body).subscribe(
                 response => {
                   this.messageService.add({
                      severity: "info",
                      summary: "Creation",
                      detail: response.message
                    });
                    this.loadingService.changeCurrentStateSideBare(false);
                 },

                 err => {
                   this.messageService.add({
                      severity: "warn",
                      summary: "Erreur",
                      detail: err.error.message
                    });
                    this.loadingService.changeCurrentStateSideBare(false);
                 }
      );
  }

  create(){
        const body = {
            id_city: this.formUser.controls["id_city"].value,
            lname: this.formUser.controls["lname"].value,
            fname:  this.formUser.controls["fname"].value,
            phone:  this.formUser.controls["phone"].value,
            address:  this.formUser.controls["address"].value,
            date_birth:   this.formUser.controls["date_birth"].value,
            email:  this.formUser.controls["email"].value,
            password:  this.formUser.controls["password"].value
        };

        if (this.formUser.invalid) {
            this.messageService.add({
               severity: "warn",
               summary: "Creation",
               detail: "Veuillez verifier les champs"
             });
        }

        else {
                this.userService.create(body).subscribe(
                         response => {
                             this.messageService.add({
                                severity: "info",
                                summary: "Creation",
                                detail: response.message
                              });
                              this.searching();
                              this.loadingService.changeCurrentStateSideBare(false);
                              this.formUser.reset();
                         },
                         err => {
                           this.messageService.add({
                              severity: "warn",
                              summary: "Creation",
                              detail: err.error.message
                            });
                            this.loadingService.changeCurrentStateSideBare(false);
                         }
              );
        }
  }

  update(){

    let body = {
      id_city: this.formUser.controls["id_city"].value,
      lname: this.formUser.controls["lname"].value,
      fname: this.formUser.controls["fname"].value,
      phone: this.formUser.controls["phone"].value,
      address: this.formUser.controls["address"].value,
      date_birth: this.formUser.controls["date_birth"].value ,
      email: this.formUser.controls["email"].value ,
      id: this.formUser.controls["id_user"].value ,
      id_entreprise: this.formUser.controls["id_entreprise"].value ,
    };

    if (this.formUser.invalid) {
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
                     this.loadingService.changeCurrentStateSideBare(false);
                     this.showUserFormDialog = false;
                     this.searching()
                   },
                   err => {
                     this.loading = false;
                     this.messageService.add({
                        severity: "warn",
                        summary: "Modification",
                        detail: err.error.message
                      });
                      this.loadingService.changeCurrentStateSideBare(false);
                   }
        );
    }
  }

  onEditPassword(user){
      this.showUserPasswordFormDialog = true;
            this.formPassworUser.setValue(  {
                  password:"",
                  id_user:user.id,
              });
  }

  updatePassword(){
      let body = {
        id: this.formPassworUser.controls["id_user"].value ,
        password:this.formPassworUser.controls["password"].value ,
      };

      if (this.formPassworUser.invalid) {
          this.messageService.add({
             severity: "warn",
             summary: "Creation",
             detail: "Veuillez verifier les champs"
           });
      }

      else{
        this.userService.updatePassword(body).subscribe(
                     response => {
                         this.messageService.add({
                            severity: "info",
                            summary: "Modification",
                            detail: response.message
                          });
                       this.loadingService.changeCurrentStateSideBare(false);
                       this.formPassworUser.reset();
                     },
                     err => {
                       this.messageService.add({
                          severity: "warn",
                          summary: "Modification",
                          detail: err.error.message
                        });
                        this.loadingService.changeCurrentStateSideBare(false);
                     }
          );
      }
  }

  onUserDelete(user){
       this.confirmationService.confirm({
          target: event.target,
          message: 'Veuillez vous vraiment lancer la suppression ?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
                this.userService.delete(user.id).subscribe(
                          response => {
                            this.loading = false;
                                this.messageService.add({
                                 severity: "info",
                                 summary: "Suppression",
                                 detail: response.message
                               });
                               this.searching();
                          },
                          err => {
                            console.log(err);
                            this.loading = false;
                            this.messageService.add({
                             severity: "warn",
                             summary: "Erreur",
                             detail:  err.error.message
                           });
                          }
               );

               this.loadingService.changeCurrentStateSideBare(false);
          },
          reject: () => {
                this.messageService.add({
                 severity: "info",
                 summary: "Annulation",
                 detail: "Suprission Annulé"
               });
          }
      });
  }

  getUserRoles(id_user) {
      this.userService.getUserRoles({id_user:id_user}).subscribe(
                   response => {
                     this.loading = false;
                     /*this.myRoles = response.data.rows;
                     this.myRoles.forEach(element => {
                         element.state = true;
                    });*/
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

  searchEntreprise(){
      this.entrepriseService.searching({}).subscribe(
        response => {
          this.entreprise = response.data.rows;
        },
        err => {
          this.messageService.add({
              severity: "warn",
              summary: "Erreur",
              detail: err.error.message
            });
        }
      ) ;
  }

  handleChange(e) {
    let isChecked = e.checked;
    console.log(e);
    
  }
}
