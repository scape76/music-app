import { Icons } from "~/components/Icons";

export interface NavItem {
  title: string;
  to?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}
