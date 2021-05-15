import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AlertService } from '../../../_services/alert.service';
import { AppointmentService } from '../../../_services/appointment.service';
import { EntrepriseService } from '../../../_services/entreprise.service';
import { LoadingService } from '../../../_services/loading.service';
import { StorageService } from '../../../_services/storage.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  bodySearch:any={};

  listClients: any = [];
  loading: boolean;
  alerts: any = [];
  totalRecords: number;

  showAlertFormDialog:boolean;
  isNewAlert: boolean;
  formAlert: FormGroup;
  
  constructor(private entrepriseService: EntrepriseService,
    private confirmationService: ConfirmationService,
    private AppoitementService: AppointmentService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private storageService:StorageService,
    private alertService:AlertService) { }


  ngOnInit(): void {
    this.formAlert = this.formBuilder.group({
      id: [null],
      id_client: [null,Validators.required],
      title:[null, Validators.required],
      description	: [null],
      date_alert: [null,Validators.required],
    });
    this.getListClient();
    this.searching();
  }

  searching(event: LazyLoadEvent=null) {
    if(event){
            this.bodySearch.skip =  event.first;
            this.bodySearch.take =  event.rows;
            this.bodySearch.sortBy =  event.sortField;
            this.bodySearch.sortDir =   (event.sortOrder>0)?"asc":"desc";
     }

      this.loading = true;
      this.alertService.searching(this.bodySearch).subscribe(
                   response => {
                     this.alerts = response.data.rows;
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

  onAlertDelete(alert){
    
    this.confirmationService.confirm({
      target: event.target,
      message: 'Veuillez vous vraiment lancer la suppression ?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: "No,",
      accept: () => {
            this.alertService.delete(alert.id).subscribe(
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
        this.listClients.push({name:"Tous les clients",id:""});
        this.listClients =[...response.data.rows];
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

  onEdit(alert) {
    this.showAlertFormDialog = true;

    if (alert) {
      this.isNewAlert = false;

      this.formAlert.setValue({
        id: alert.id,
        id_client: alert.id_client,
        title: alert.title,
        description	: alert.description	,
        date_alert: new Date(alert.date_alert),
      });
    }

    else {
      this.isNewAlert= true;
      this.formAlert.reset();
    }
  }

  update(){

    let body = {
      id: this.formAlert.controls["id"].value,
      id_client: this.formAlert.controls["id_client"].value,
      title: this.formAlert.controls["title"].value,
      description	:this.formAlert.controls["description"].value	,
      date_alert: this.formAlert.controls["date_alert"].value	,
    };

    if (this.formAlert.invalid) {
         this.messageService.add({
           severity: "warn",
           summary: "Modification",
           detail: "Veuillez verifier les champs"
         });
    }

    else{
      this.alertService.update(body).subscribe(
                   response => {
                       this.messageService.add({
                          severity: "info",
                          summary: "Modification",
                          detail: response.message
                        });
                     this.loadingService.changeCurrentStateSideBare(false);
                     this.showAlertFormDialog = false;
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

    let body = {
      id_client: this.formAlert.controls["id_client"].value,
      title: this.formAlert.controls["title"].value,
      description: this.formAlert.controls["description"].value,
      date_appointment: this.formAlert.controls["date_alert"].value,
    };

    if (this.formAlert.invalid) {
         this.messageService.add({
           severity: "warn",
           summary: "Creation",
           detail: "Veuillez verifier les champs"
         });
    }

    else{
      this.alertService.create(body).subscribe(
                   response => {
                       this.messageService.add({
                          severity: "info",
                          summary: "Creation",
                          detail: response.message
                        });
                     this.loadingService.changeCurrentStateSideBare(false);
                     this.showAlertFormDialog = false;
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

}
