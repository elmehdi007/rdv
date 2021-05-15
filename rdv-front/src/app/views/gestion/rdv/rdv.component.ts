import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AppointmentService } from '../../../_services/appointment.service';
import { EntrepriseService } from '../../../_services/entreprise.service';
import { LoadingService } from '../../../_services/loading.service';
import { StorageService } from '../../../_services/storage.service';

@Component({
  selector: 'app-rdv',
  templateUrl: './rdv.component.html',
  styleUrls: ['./rdv.component.scss']
})
export class RdvComponent implements OnInit {

  loading: boolean;
  appoitements: any = [];
  totalRecords: number = 0;
  bodySearch: any = {};

  listClients: any = [];
  listProvider:any =[];
  listProviderAssocedToClient: any = [];
  statesRdv: any = [{ name: "ouvert", id: "open" }, { name: "fermé", id: "close" }];
  showAppoitmentFormDialog: boolean = false;
  formAppoitement: FormGroup;
  isNewAppoitement: boolean;


  constructor(private entrepriseService: EntrepriseService,
    private confirmationService: ConfirmationService,
    private AppoitementService: AppointmentService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private storageService:StorageService,
    ) { }


  ngOnInit(): void {
    this.formAppoitement = this.formBuilder.group({
      id_client: [""],
      id_provider: [""],
      title: [null],
      description: [null],
      date_appointment: [null],
      clef: [this.AppoitementService.makeClef()],
      id_user_created: [null],
      status: ["open"],
      id_appoitement:[null]
    });

    this.searching();
    this.getListClient();
    this.getListProvider();
  }

  searching(event: LazyLoadEvent = null) {
    if (event) {
      this.bodySearch.skip = event.first;
      this.bodySearch.take = event.rows;
      this.bodySearch.sortBy = event.sortField;
      this.bodySearch.sortDir = (event.sortOrder > 0) ? "asc" : "desc";
    }

    this.loading = true;
    this.AppoitementService.searching(this.bodySearch).subscribe(
      response => {
        this.appoitements = response.data.rows;
        console.log(this.appoitements);

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

  onEdit(appoitement) {
    this.showAppoitmentFormDialog = true;

    if (appoitement) {
      this.isNewAppoitement = false;
      console.log(appoitement);

      this.formAppoitement.setValue({
        id_client: appoitement.id_client,
        id_provider: appoitement.id_provider,
        title: appoitement.title,
        description: appoitement.description,
        date_appointment: new Date(appoitement.date_appointment),
        clef: appoitement.clef,
        id_user_created: appoitement.id_user_created,
        status: appoitement.status,
        id_appoitement: appoitement.id
      });
      console.log((appoitement.date_appointment));console.log(new Date(appoitement.date_appointment));
      
      this.getProviderAssociedClient(appoitement.id_client);
    }

    else {
      this.isNewAppoitement= true;
      console.log("this.isNewAppoitement"+this.isNewAppoitement);
      console.log(this.formAppoitement);
      this.formAppoitement.reset();
      this.formAppoitement.get('clef').setValue(this.AppoitementService.makeClef())
    }
  }

  getProviderAssociedClient(id_client){
    this.entrepriseService.getProviderAssociedClient({id_client:id_client,get_all_recorder:true}).subscribe(
      response => {
        console.log("loh: ");
        console.log(response.data.rows);
        this.listProviderAssocedToClient = response.data.rows;
        console.log("this.listProviderAssocedToClient");console.log(this.listProviderAssocedToClient);
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

  update(){

    let body = {
      id: this.formAppoitement.controls["id_appoitement"].value,
      id_client: this.formAppoitement.controls["id_client"].value,
      id_provider: this.formAppoitement.controls["id_provider"].value,
      title: this.formAppoitement.controls["title"].value,
      description: this.formAppoitement.controls["description"].value,
      date_appointment: this.formAppoitement.controls["date_appointment"].value,
      clef: this.formAppoitement.controls["clef"].value ,
      id_user_created: this.formAppoitement.controls["id_user_created"].value ,
      status: this.formAppoitement.controls["status"].value ,
    };

    if (this.formAppoitement.invalid) {
         this.messageService.add({
           severity: "warn",
           summary: "Modification",
           detail: "Veuillez verifier les champs"
         });
    }

    else{
      this.AppoitementService.update(body).subscribe(
                   response => {
                       this.messageService.add({
                          severity: "info",
                          summary: "Modification",
                          detail: response.message
                        });
                     this.loadingService.changeCurrentStateSideBare(false);
                     this.showAppoitmentFormDialog = false;
                     this.searching();
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

  
  create(){
    console.log  (this.storageService.getUser())
    let body = {
      id_client: this.formAppoitement.controls["id_client"].value,
      id_provider: this.formAppoitement.controls["id_provider"].value,
      title: this.formAppoitement.controls["title"].value,
      description: this.formAppoitement.controls["description"].value,
      date_appointment: this.formAppoitement.controls["date_appointment"].value,
      clef: this.formAppoitement.controls["clef"].value ,
      id_user_created: this.storageService.getUser().id_user ,
      status: this.formAppoitement.controls["status"].value ,
    };

    if (this.formAppoitement.invalid) {
         this.messageService.add({
           severity: "warn",
           summary: "Creation",
           detail: "Veuillez verifier les champs"
         });
    }

    else{
      this.AppoitementService.create(body).subscribe(
                   response => {
                       this.messageService.add({
                          severity: "info",
                          summary: "Creation",
                          detail: response.message
                        });
                     this.loadingService.changeCurrentStateSideBare(false);
                     this.showAppoitmentFormDialog = false;
                     this.searching();
                   },
                   err => {
                     this.loading = false;
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

  onAppoitmentDelete(appoitement){
    this.confirmationService.confirm({
       target: event.target,
       message: 'Veuillez vous vraiment lancer la suppression ?',
       icon: 'pi pi-exclamation-triangle',
       accept: () => {
             this.AppoitementService.delete(appoitement.id).subscribe(
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

  getListClient(){
    this.entrepriseService.search({type_entreprise:"client",get_all_recorder:true}).subscribe(
      response => {
        this.listClients = response.data.rows;
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

  getListProvider(){
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

  }
}
