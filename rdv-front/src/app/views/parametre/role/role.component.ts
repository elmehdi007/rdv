import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { RoleService } from '../../../_services/role.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, PrimeNGConfig } from "primeng/api";
import { LoadingService } from '../../../_services/loading.service';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})

export class RoleComponent implements OnInit {

  public roles: any = [];
  totalRecords: number = 0;
  loading: boolean = false;
  roleUpdateForm: FormGroup;
  formCreateRole: FormGroup;
  newRoleDialogueVisible:boolean;

  nameSearch: string = "";
  bodySearch:any={name:''};

  constructor(private roleService:RoleService,
              private formBuilder: FormBuilder,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private loadingService:LoadingService,
              private primengConfig: PrimeNGConfig) {}

  ngOnInit(): void {
        this.loading = true;

        this.roleUpdateForm = this.formBuilder.group({
             name: ['', Validators.required],
        });
        this.formCreateRole = this.formBuilder.group({
             name: ['', Validators.required],
        });
  }

  search(event: LazyLoadEvent=null) {

      if(event){
        this.bodySearch.skip =  event.first;
        this.bodySearch.take =  event.rows;
        this.bodySearch.sortBy =  event.sortField;
        this.bodySearch.sortDir =   (event.sortOrder>0)?"asc":"desc";
      }

      this.loading = true;
      this.roleService.search(this.bodySearch).subscribe(
                   response => {
                     this.roles = response.data.rows;
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

  create() {
    if (this.formCreateRole.invalid) {
        this.messageService.add({
           severity: "warn",
           summary: "Creation",
           detail: "Veuillez verifier les champs"
         });
    }
    else
    {
          this.roleService.create({name:this.formCreateRole.controls['name'].value}).subscribe(
                         response => {
                          this.loading = false;
                          this.messageService.add({
                           severity: "info",
                           summary: "Creation",
                           detail: response.message
                         });
                          this.search();
                          this.loadingService.changeCurrentStateSideBare(false);
                          this.formCreateRole.reset();
                         },
                         err => {
                           this.loading = false;
                           this.messageService.add({
                             severity: "warn",
                            summary: "Creation",
                            detail: err.error.message
                          });
                           this.loadingService.changeCurrentStateSideBare(false)
                        }
          );
    }
  }

  onRowEditInit(role=null){
      if(null != role)
        this.roleUpdateForm.setValue({
          name: role.name
        });
  }

  onRowEditSave(role){
      if (this.roleUpdateForm.invalid) {
            this.messageService.add({
               severity: "warn",
               summary: "Creation",
               detail: "Veuillez verifier les champs"
             });
      }

      else {
        this.roleService.update({id:role.id,name:this.roleUpdateForm.controls['name'].value}).subscribe(
                response => {
                 console.log(response);
                 this.loading = false;
                 this.messageService.add({
                  severity: "info",
                  summary: "Modification",
                  detail: response.message
                });
                 this.search();
                this.loadingService.changeCurrentStateSideBare(false);
                },
                err => {
                  this.loading = false;
                  this.messageService.add({
                   severity: "warn",
                   summary: "Suppression",
                   detail: err.error.message
                 });
                 this.loadingService.changeCurrentStateSideBare(false);
                }
     );
     }
  }

  onRowEditCancel(role, ri){
    console.log(role);console.log(ri);
  }

  onRoleDelete(role){
       this.confirmationService.confirm({
          target: event.target,
          message: 'Veuillez vous vraiment lancer la suppression ?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
                this.roleService.delete(role.id).subscribe(
                          response => {
                            this.loading = false;
                                this.messageService.add({
                                 severity: "info",
                                 summary: "Suppression",
                                 detail: response.message
                               });
                               this.search();
                               this.loadingService.changeCurrentStateSideBare(false);
                          },
                          err => {
                            console.log(err);
                            this.loading = false;
                            this.messageService.add({
                             severity: "warn",
                             summary: "Erreur",
                             detail:  err.error.message
                           });
                           this.loadingService.changeCurrentStateSideBare(false);
                          }
               );
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

  openNew(){
    this.newRoleDialogueVisible=true;
  }
}
