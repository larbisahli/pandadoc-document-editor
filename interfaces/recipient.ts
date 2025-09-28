import { RecipientId } from "./common";
import { RecipientRoles } from "./enum";

export interface RecipientType {
  id: RecipientId;
  email?: string;
  number?: string;
  firstName: string;
  lastName: string;
  color: string;
  role?: RecipientRoles;
  order?: number;
}
