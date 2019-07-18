interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navItems: NavData[] = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: "icon-speedometer"
  },

  {
    name: "Students",
    url: "/students",
    icon: "icon-user"
  },
  {
    name: "Teachers",
    url: "/theme/typography",
    icon: "icon-user-female"
  },
  {
    title: true,
    name: "Components"
  },

  {
    name: "DropDown",
    url: "/buttons",
    icon: "icon-cursor",
    children: [
      {
        name: "Buttons",
        url: "/buttons/buttons",
        icon: "icon-cursor"
      },
      {
        name: "Dropdowns",
        url: "/buttons/dropdowns",
        icon: "icon-cursor"
      },
      {
        name: "Brand Buttons",
        url: "/buttons/brand-buttons",
        icon: "icon-cursor"
      }
    ]
  },
  {
    name: "User",
    url: "/users",
    icon: "icon-people"
  }
];
