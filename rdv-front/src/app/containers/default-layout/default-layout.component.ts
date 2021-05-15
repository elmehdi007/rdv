import { Component, OnInit } from '@angular/core';
import { navItems } from '../../_nav';
import { environment } from '../../../environments/environment';
import { StorageService } from '../../_services/storage.service';
import { LoadingService } from '../../_services/loading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems = navItems;
  urlMyAvatar:string = "";
  user:any;
  visibleSidebar5:boolean = false;

  constructor(private storageService:StorageService,private loadingService: LoadingService) {
               this.user = this.storageService.getUser();
               this.urlMyAvatar = environment.url_web+"user/imgage/"+this.user.id_user;
               console.log(this.urlMyAvatar);
  }

  ngOnInit(): void {}

  ngAfterViewInit(){this.loadingService.currentState.subscribe(state => this.visibleSidebar5 = state);}

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
}
