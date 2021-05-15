import { INavData } from '@coreui/angular';
import { StorageService } from './_services/storage.service';
var storageService:StorageService = new StorageService();
const navAdminItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Paramètre'
  },

  {
    name: 'Rôles',
    url: '/parametre/role',
    icon: 'cil-contact'
  },

  {
    title: true,
    name: 'Gestion'
  },

  {
    name: 'Utilisateurs',
    url: '/gestion/user',
    icon: 'icon-user'
  },

  {
    divider: true
  },

  {
    name: 'Entreprises',
    url: '/list',
    icon: 'icon-star',
    children: [
      {
        name: 'List',
        url: '/gestion/entreprise/list',
        icon: 'icon-star'
      },
    ]
  },

  {
    name: 'Rendez-vous',
    url: '/list',
    icon: 'icon-star',
    children: [
      {
        name: 'List',
        url: '/gestion/rendez-vous/list',
        icon: 'icon-star'
      },
    ]
  },

  {
    name: 'Alert',
    url: '/list',
    icon: 'icon-star',
    children: [
      {
        name: 'List',
        url: '/gestion/alert/list',
        icon: 'icon-star'
      },
    ]
  },

  {
    name: 'Quality',
    url: '/list',
    icon: 'icon-star',
    children: [
      {
        name: 'List',
        url: '/gestion/quality/list',
        icon: 'icon-star'
      },
    ]
  },

  {
    title: true,
    name: 'Extras',
  },

  {
    name: 'Pages',
    url: '/pages',
    icon: 'icon-star',
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'icon-star'
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'icon-star'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'icon-star'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'icon-star'
      }
    ]
  },

  {
    name: 'Disabled',
    url: '/dashboard',
    icon: 'icon-ban',
    badge: {
      variant: 'secondary',
      text: 'NEW'
    },
    attributes: { disabled: true },
  },
];

const navClientItems =[
  {
    name: 'Rendez-vous',
    url: '/list',
    icon: 'icon-star',
    children: [
      {
        name: 'List',
        url: '/gestion/rendez-vous/list',
        icon: 'icon-star'
      },
    ]
  },

  {
    name: 'Alert',
    url: '/list',
    icon: 'icon-star',
    children: [
      {
        name: 'List',
        url: '/gestion/alert/list',
        icon: 'icon-star'
      },
    ]
  },

  {
    name: 'Quality',
    url: '/list',
    icon: 'icon-star',
    children: [
      {
        name: 'List',
        url: '/gestion/quality/list',
        icon: 'icon-star'
      },
    ]
  },
];


const navProviderItems =[
  {
    name: 'Rendez-vous',
    url: '/list',
    icon: 'icon-star',
    children: [
      {
        name: 'List',
        url: '/gestion/rendez-vous/list',
        icon: 'icon-star'
      },
    ]
  },

  {
    name: 'Quality',
    url: '/list',
    icon: 'icon-star',
    children: [
      {
        name: 'List',
        url: '/gestion/quality/list',
        icon: 'icon-star'
      },
    ]
  },
];

var navItems_: INavData[] = navProviderItems;
if(storageService.getUserIdsRoles().includes(1)) navItems_ = navAdminItems;
else if(storageService.getUserIdsRoles().includes(2)) navItems_ = navClientItems;
else if(storageService.getUserIdsRoles().includes(3)) navItems_ = navProviderItems;
else navItems_ = []

export const navItems: INavData[] = navItems_;