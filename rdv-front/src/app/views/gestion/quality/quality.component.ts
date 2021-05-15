import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AlertService } from '../../../_services/alert.service';
import { AppointmentService } from '../../../_services/appointment.service';
import { EntrepriseService } from '../../../_services/entreprise.service';
import { LoadingService } from '../../../_services/loading.service';
import { QualityService } from '../../../_services/quality.service';
import { StorageService } from '../../../_services/storage.service';

@Component({
  selector: 'app-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.scss']
})
export class QualityComponent implements OnInit {

  bodySearch:any={};
  listClients: any = [];

  qualities:any=[];
  loading: boolean;
  totalRecords: any;

  showQualityFormDialog:boolean;
  formQuality:FormGroup;
  isNewQuality: boolean;

  constructor(private entrepriseService: EntrepriseService,
    private confirmationService: ConfirmationService,
    private qualityService: QualityService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private storageService:StorageService,) { }

  ngOnInit(): void {
    this.formQuality = this.formBuilder.group({
      id_qualite: [null],
      id_client: [null,Validators.required],
      title: [null,Validators.required],
      description: [null],
    });

    this.getListClient();
    this.searching()
  }

  searching(event: LazyLoadEvent = null) {
    if (event) {
      this.bodySearch.skip = event.first;
      this.bodySearch.take = event.rows;
      this.bodySearch.sortBy = event.sortField;
      this.bodySearch.sortDir = (event.sortOrder > 0) ? "asc" : "desc";
    }

    this.loading = true;
    this.qualityService.searching(this.bodySearch).subscribe(
      response => {
        this.qualities = response.data.rows;

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

  onEdit(quality) {
    this.showQualityFormDialog = true;

    if (quality) {
      this.isNewQuality = false;
      console.log(quality);
      this.formQuality.setValue({
        id_qualite: quality.id,
        id_client: quality.id_client,
        title: quality.title,
        description: quality.description,
      });
      console.log( quality);
      console.log( this.formQuality);
      
    }

    else {
      this.isNewQuality= true;
      console.log(this.formQuality);
      this.formQuality.reset();
    }
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

  update(){

    let body = {
      id: this.formQuality.controls["id_qualite"].value,
      id_client: this.formQuality.controls["id_client"].value,
      title: this.formQuality.controls["title"].value,
      description: this.formQuality.controls["description"].value,
    };

    if (this.formQuality.invalid) {
         this.messageService.add({
           severity: "warn",
           summary: "Modification",
           detail: "Veuillez verifier les champs"
         });
    }

    else{
      this.qualityService.update(body).subscribe(
                   response => {
                       this.messageService.add({
                          severity: "info",
                          summary: "Modification",
                          detail: response.message
                        });
                     this.loadingService.changeCurrentStateSideBare(false);
                     this.showQualityFormDialog = false;
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
      id_client: this.formQuality.controls["id_client"].value,
      title: this.formQuality.controls["title"].value,
      description: this.formQuality.controls["description"].value,
    };

    if (this.formQuality.invalid) {
         this.messageService.add({
           severity: "warn",
           summary: "Creation",
           detail: "Veuillez verifier les champs"
         });
    }

    else{
      this.qualityService.create(body).subscribe(
                   response => {
                       this.messageService.add({
                          severity: "info",
                          summary: "Creation",
                          detail: response.message
                        });
                     this.loadingService.changeCurrentStateSideBare(false);
                     this.showQualityFormDialog = false;
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

  onQualityDelete(quality){
    this.confirmationService.confirm({
       target: event.target,
       message: 'Veuillez vous vraiment lancer la suppression ?',
       icon: 'pi pi-exclamation-triangle',
       accept: () => {
             this.qualityService.delete(quality.id).subscribe(
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
}
