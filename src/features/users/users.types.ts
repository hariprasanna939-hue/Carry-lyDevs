import { CarryUser, ActivePortal } from "../../types/user";

export type UpdateUserProfilePayload = Partial<Pick<CarryUser, "fullName" | "phone" | "activePortal">>;
