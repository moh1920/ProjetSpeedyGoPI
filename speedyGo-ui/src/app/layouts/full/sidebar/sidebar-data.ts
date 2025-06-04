import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard',
  },
  {
    displayName: 'Analytical',
    iconName: 'aperture',
    route: '*',
    chip: true,
    external: true,


  },
  {
    displayName: 'eCommerce',
    iconName: 'shopping-cart',
    route: '*',
    chip: true,
    external: true,


  },

  {
    navCap: 'Apps',
  },
  {
    displayName: 'Chat',
    iconName: 'message-dots',
    route: '*',
    chip: true,
    external: true,


  },
  {
    displayName: 'Calendar',
    iconName: 'calendar',
    route: '*',
    chip: true,
    external: true,


  },
  {
    displayName: 'Email',
    iconName: 'mail',
    route: '*',
    chip: true,
    external: true,


  },
  {
    displayName: 'Kanban',
    iconName: 'checklist',
    route: '*',
    chip: true,
    external: true,


  },
  {
    displayName: 'Contacts',
    iconName: 'phone',
    route: '*',
    chip: true,
    external: true,


  },
  {
    displayName: 'Contact List',
    iconName: 'list-details',
    route: '*',
    chip: true,
    external: true,


  },
  {
    displayName: 'Courses',
    iconName: 'certificate',
    route: '*',
    chip: true,
    external: true,


  },
  {
    displayName: 'Employee',
    iconName: 'brand-ctemplar',
    route: '*',
    chip: true,
    external: true,

  },
  {
    displayName: 'Notes',
    iconName: 'note',
    route: '*',
    chip: true,
    external: true,


  },
  {
    displayName: 'Tickets',
    iconName: 'ticket',
    route: '*',
    chip: true,
    external: true,


  },
  {
    displayName: 'ToDo',
    iconName: 'edit',
    route: '*',
    external: true,
    chip: true,


  },
  {
    displayName: 'Invoice',
    iconName: 'file-invoice',
    chip: true,

    route: '',
    children: [
      {
        displayName: 'List',
        iconName: 'point',
        external: true,
        chip: true,

        route: '*',
      },
      {
        displayName: 'Detail',
        iconName: 'point',
        external: true,
        chip: true,

        route:
          '*',
      },
      {
        displayName: 'Create',
        iconName: 'point',
        external: true,
        chip: true,


        route: '*',
      },
      {
        displayName: 'Edit',
        iconName: 'point',
        external: true,
        chip: true,


        route:
          '*',
      },
    ],
  },

  {
    displayName: 'Blog',
    iconName: 'chart-donut-3',
    chip: true,


    route: 'apps/blog',
    children: [
      {
        displayName: 'Post',
        iconName: 'point',
        external: true,
        chip: true,


        route: '*',
      },
      {
        displayName: 'Detail',
        iconName: 'point',
        external: true,
        chip: true,

        route:
          '*',
      },
    ],
  },

  {
    navCap: 'Ui Components',
  },
  {
    displayName: 'Badge',
    iconName: 'archive',
    route: '/ui-components/badge',
  },
  {
    displayName: 'Chips',
    iconName: 'info-circle',
    route: '/ui-components/chips',
  },
  {
    displayName: 'Lists',
    iconName: 'list-details',
    route: '/ui-components/lists',
  },
  {
    displayName: 'Menu',
    iconName: 'file-text',
    route: '/ui-components/menu',
  },
  {
    displayName: 'Tooltips',
    iconName: 'file-text-ai',
    route: '/ui-components/tooltips',
  },
  {
    displayName: 'Forms',
    iconName: 'clipboard-text',
    route: '/ui-components/forms',
  },
  {
    displayName: 'Tables',
    iconName: 'table',
    route: '/ui-components/tables',
  },
  {
    displayName: 'Expansion Panel',
    iconName: 'layout-bottombar-inactive',
    route: '*',
    external: true,
    chip: true,

  },
  {
    displayName: 'Dialog',
    iconName: 'diabolo',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Divider',
    iconName: 'separator',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Paginator',
    iconName: 'text-wrap',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Progress Bar',
    iconName: 'progress',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Progress Spinner',
    iconName: 'rotate-2',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Ripples',
    iconName: 'ripple',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Slide Toggle',
    iconName: 'toggle-left',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Slider',
    iconName: 'adjustments-alt',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Snackbar',
    iconName: 'stack-backward',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Tabs',
    iconName: 'border-all',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Toolbar',
    iconName: 'tools-kitchen',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Tooltips',
    iconName: 'tooltip',
    route: '*',
    external: true,
    chip: true,
  },

  {
    navCap: 'Pages',
  },
  {
    displayName: 'Roll Base Access',
    iconName: 'lock-access',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Treeview',
    iconName: 'git-merge',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Promotion and Event',
    iconName: 'currency-dollar',
    route: 'pv',
    external: true,
    chip: true,
  },
  {
    displayName: 'Account Setting',
    iconName: 'user-circle',
    route:
      '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'FAQ',
    iconName: 'help',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Landingpage',
    iconName: 'app-window',
    route: '*',
    external: true,
    chip: true,
  },
  {
    displayName: 'Widgets',
    iconName: 'layout',
    route: 'widgets',
    chip: true,
    children: [
      {
        displayName: 'Cards',
        iconName: 'point',
        route: '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Banners',
        iconName: 'point',
        route: '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Charts',
        iconName: 'point',
        route: '*',
        external: true,
        chip: true,

      },
    ],
  },
  {
    navCap: 'Extra',
  },
  {
    displayName: 'Icons',
    iconName: 'mood-smile',
    route: '/extra/icons',
  },
  {
    displayName: 'Sample Page',
    iconName: 'brand-dribbble',
    route: '/extra/sample-page',
  },
  {
    navCap: 'Forms',
  },
  {
    displayName: 'Elements',
    iconName: 'apps',
    chip: true,

    route: 'forms/forms-elements',
    children: [
      {
        displayName: 'Autocomplete',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Button',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Checkbox',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Radio',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Datepicker',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
    ],
  },
  {
    displayName: 'Form Layouts',
    iconName: 'file-description',
    route: '*',
    external: true,
    chip: true,

  },
  {
    displayName: 'Form Horizontal',
    iconName: 'box-align-bottom',
    route: '*',
    external: true,
    chip: true,

  },
  {
    displayName: 'Form Vertical',
    iconName: 'box-align-left',
    route: '*',
    external: true,
    chip: true,

  },
  {
    displayName: 'Form Wizard',
    iconName: 'files',
    route: '*',
    external: true,
    chip: true,

  },
  {
    displayName: 'Toastr',
    iconName: 'notification',
    route: '*',
    external: true,
    chip: true,

  },

  {
    navCap: 'Tables',
  },
  {
    displayName: 'Tables',
    iconName: 'layout',
    route: 'tables',
    chip: true,

    children: [
      {
        displayName: 'Basic Table',
        iconName: 'point',
        route: '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Dynamic Table',
        iconName: 'point',
        route: '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Expand Table',
        iconName: 'point',
        route: '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Filterable Table',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Footer Row Table',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'HTTP Table',
        iconName: 'point',
        route: '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Mix Table',
        iconName: 'point',
        route: '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Multi Header Footer',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Pagination Table',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Row Context Table',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Selection Table',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Sortable Table',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Sticky Column',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
      {
        displayName: 'Sticky Header Footer',
        iconName: 'point',
        route:
          '*',
        external: true,
        chip: true,

      },
    ],
  },
  {
    displayName: 'Data table',
    iconName: 'border-outer',
    route: '*',
    external: true,
    chip: true,

  },
  {
    navCap: 'Chart',
  },
  {
    displayName: 'Line',
    iconName: 'chart-line',
    route: '*',
    external: true,
    chip: true,

  },
  {
    displayName: 'Gredient',
    iconName: 'chart-arcs',
    route: '*',
    external: true,
    chip: true,

  },
  {
    displayName: 'Area',
    iconName: 'chart-area',
    route: '*',
    external: true,
    chip: true,

  },
  {
    displayName: 'Candlestick',
    iconName: 'chart-candle',
    route: '*',
    external: true,
    chip: true,

  },
  {
    displayName: 'Column',
    iconName: 'chart-dots',
    route: '*',
    external: true,
    chip: true,

  },
  {
    displayName: 'Doughnut & Pie',
    iconName: 'chart-donut-3',
    route: '*',
    external: true,
    chip: true,

  },
  {
    displayName: 'Radialbar & Radar',
    iconName: 'chart-radar',
    route: '*',
    external: true,
    chip: true,

  },

  {
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'login',
    route: '/authentication',
    children: [
      {
        displayName: 'Login',
        iconName: 'point',
        route: '/authentication/login',
      },
      {
        displayName: 'Side Login',
        iconName: 'point',
        external: true,
        chip: true,

        route: '*',
      },
    ],
  },
  {
    displayName: 'Register',
    iconName: 'user-plus',
    route: '/authentication',
    children: [
      {
        displayName: 'Register',
        iconName: 'point',
        route: '/authentication/register',
      },
      {
        displayName: 'Side Register',
        iconName: 'point',
        external: true,
        chip: true,

        route: '*',
      },
    ],
  },
  {
    displayName: 'Forgot Pwd',
    iconName: 'rotate',
    chip: true,
    route: '/authentication',
    children: [
      {
        displayName: 'Side Forgot Pwd',
        iconName: 'point',
        external: true,
        chip: true,
        route: '*',
      },
      {
        displayName: 'Boxed Forgot Pwd',
        iconName: 'point',
        external: true,
        chip: true,

        route: '*',
      },
    ],
  },
  {
    displayName: 'Two Steps',
    iconName: 'zoom-code',
    chip: true,

    route: '/authentication',
    children: [
      {
        displayName: 'Side Two Steps',
        iconName: 'point',
        external: true,
        chip: true,

        route: '*',
      },
      {
        displayName: 'Boxed Two Steps',
        iconName: 'point',
        external: true,
        chip: true,

        route: '*',
      },
    ],
  },
  {
    displayName: 'Error',
    iconName: 'alert-circle',
    route: '*',
    external: true,
    chip: true,

  },
  {
    displayName: 'Maintenance',
    iconName: 'settings',
    route: '*',
    external: true,
    chip: true,

  },
];
