import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    companyId: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      companyId: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    companyId: string;
    role: string;
  }
}
