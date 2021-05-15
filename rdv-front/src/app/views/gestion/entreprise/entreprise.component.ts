import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { CountryService } from '../../../_services/country.service';
import { EntrepriseService } from '../../../_services/entreprise.service';
import { LoadingService } from '../../../_services/loading.service';

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.scss']
})
export class EntrepriseComponent implements OnInit {

  constructor(private entrepriseService:EntrepriseService,
             private confirmationService: ConfirmationService,
             private messageService: MessageService,
             private loadingService:LoadingService,
             private formBuilder:FormBuilder,
             private countryService:CountryService) { }

  isNewEntreprise: boolean;

  bodySearch:any={type_entreprise:""};

  entreprises:any;
  totalRecords:0;
  loading:boolean;

  showEntrepriseFormDialog:boolean;
  
  formEntreprise: FormGroup;
  cities:any = [];
  countries:any = [];

  showAssocierCLientToProviderDialog:boolean;
  listProvider:any=[];
  formClientProvder: FormGroup;

  entrepriseTypes = [{name:"provider",id:"provider"},{name:"client",id:"client"}];
  entrepriseForms = [{name:"SA",id:"SA"},{name:"SARL",id:"SARL"},{name:"AU",id:"AU"},{name:"AA",id:"AA"},];

  ngOnInit(): void {
    this.formEntreprise = this.formBuilder.group({
      id_country:[""],
      email: [null, Validators.required],
      address: [null],
      phone: ['', Validators.required],
      id_city: [null],
      rc: [null],
      type_entreprise: [null],
      form_juridique: [null],
      name: ["",Validators.required],
      id_entreprise: [null],
    });

    this.formClientProvder = this.formBuilder.group({
      ids_providers: [[], Validators.required],
      id_client:[null, Validators.required]
    });
    
    this.searching();
    this.searchCountry();
  }

  searching(event: LazyLoadEvent=null) {
    if(event){
            this.bodySearch.skip =  event.first;
            this.bodySearch.take =  event.rows;
            this.bodySearch.sortBy =  event.sortField;
            this.bodySearch.sortDir =   (event.sortOrder>0)?"asc":"desc";
     }

     this.loading = true;
      this.entrepriseService.searching(this.bodySearch).subscribe(
                   response => {
                     this.entreprises = response.data.rows;
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

  onEntrepriseDelete(user){
    this.confirmationService.confirm({
       target: event.target,
       message: 'Veuillez vous vraiment lancer la suppression ?',
       icon: 'pi pi-exclamation-triangle',
       accept: () => {
             this.entrepriseService.delete(user.id).subscribe(
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
  
  onEdit(entreprise = null){
    this.showEntrepriseFormDialog = true;

    if(entreprise){
      this.isNewEntreprise = false;
      this.formEntreprise.setValue({
                id_country:entreprise.id_country,
                email:entreprise.email,
                address: entreprise.address,
                phone: entreprise.phone,
                id_city: entreprise.id_city,
                rc:entreprise.rc,
                type_entreprise: entreprise.type_entreprise,
                form_juridique:entreprise.form_juridique,
                name: entreprise.name,
                id_entreprise: entreprise.id,
          });

        if(entreprise.id_country)  this.getCityByCountry(entreprise.id_country);
    }

    else {
      this.isNewEntreprise = true;
      this.formEntreprise.reset();
    }
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

  onChangeConntry(id_country:number) {
    this.getCityByCountry(id_country);
  }

  onEditClientProviderAssocier(client){
    console.log(client);
    
      this.showAssocierCLientToProviderDialog = true;
      this.entrepriseService.search({type_entreprise:"provider",get_all_recorder:true}).subscribe(
        response => {
          this.listProvider = response.data.rows;
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
      this.entrepriseService.getProviderAssociedClient({id_client:client.id,get_all_recorder:true}).subscribe(
        response => {
          console.log("loh: ");
          console.log(response.data.rows);
          let ids_client_provider = [];
          response.data.rows.forEach(element => {
            ids_client_provider.push(element.id_entreprise)
          });

          this.formClientProvder.setValue({
            ids_providers:ids_client_provider,
            id_client:client.id
          });
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

  associateProvider(){
    const body = {
      ids_providers: this.formClientProvder.controls["ids_providers"].value,
      id_client: this.formClientProvder.controls["id_client"].value
    };

     this.entrepriseService.associateProvider(body).subscribe(
          response => {
              this.messageService.add({
                severity: "info",
                summary: "Creation",
                detail: response.message
              });
              this.searching();
              this.loadingService.changeCurrentStateSideBare(false);
            },
          err => {
            this.loading = false;
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
        id_city: this.formEntreprise.controls["id_city"].value,
        id_country: this.formEntreprise.controls["id_country"].value,
        email: this.formEntreprise.controls["email"].value,
        address: this.formEntreprise.controls["address"].value,
        phone: this.formEntreprise.controls["phone"].value,
        rc: this.formEntreprise.controls["rc"].value,
        type_entreprise: this.formEntreprise.controls["type_entreprise"].value,
        form_juridique: this.formEntreprise.controls["form_juridique"].value,
        name:this.formEntreprise.controls["name"].value,
    };

    if (this.formEntreprise.invalid) {
        this.messageService.add({
           severity: "warn",
           summary: "Creation",
           detail: "Veuillez verifier les champs"
         });
    }

    else {
            this.entrepriseService.create(body).subscribe(
                     response => {
                         this.messageService.add({
                            severity: "info",
                            summary: "Creation",
                            detail: response.message
                          });
                          this.searching();
                          this.loadingService.changeCurrentStateSideBare(false);
                          this.formEntreprise.reset();
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
    id_city: this.formEntreprise.controls["id_city"].value,
    id_country: this.formEntreprise.controls["id_country"].value,
    email: this.formEntreprise.controls["email"].value,
    address: this.formEntreprise.controls["address"].value,
    phone: this.formEntreprise.controls["phone"].value,
    rc: this.formEntreprise.controls["rc"].value,
    type_entreprise: this.formEntreprise.controls["type_entreprise"].value,
    form_juridique: this.formEntreprise.controls["form_juridique"].value,
    name:this.formEntreprise.controls["name"].value,
    id:this.formEntreprise.controls["id_entreprise"].value,
  };
  console.log(this.formEntreprise);

  if (this.formEntreprise.invalid) {
      this.messageService.add({
        severity: "warn",
        summary: "Creation",
        detail: "Veuillez verifier les champs"
      });
  }

  else{
    this.entrepriseService.update(body).subscribe(
                response => {
                    this.messageService.add({
                        severity: "info",
                        summary: "Modification",
                        detail: response.message
                      });
                  this.loadingService.changeCurrentStateSideBare(false);
                  this.showEntrepriseFormDialog = false
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

}
