export interface UserProps {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;

  createdAt: Date;
  updatedAt: Date;
}
