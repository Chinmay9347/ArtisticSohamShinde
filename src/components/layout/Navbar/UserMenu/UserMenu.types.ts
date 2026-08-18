import { User } from "firebase/auth";

export interface UserMenuProps {
  user: User;

  onLogout: () => Promise<void>;

  notificationCount?: number;
}

// import { User } from "firebase/auth";

// export interface UserMenuProps {
//   user: User;

//   onLogout: () => Promise<void>;
// }import { User } from "firebase/auth";

// export interface UserMenuProps {
//   user: User;

//   onLogout: () => Promise<void>;

//   notificationCount?: number;
// }