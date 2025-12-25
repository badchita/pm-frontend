export interface NavItem {
  title: string;
  icon: string;
  route: string;
  child?: NavItem[];
}
