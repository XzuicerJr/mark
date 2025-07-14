export interface UserProps {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface HabitProps {
  id: string;
  name: string;
  description: string | null;
  startDate: Date;
  icon: string;
  color: "green" | "red" | "yellow" | "blue" | "purple" | "orange" | "pink";
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitLogProps {
  id: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitWithLogsProps extends HabitProps {
  logs: HabitLogProps[];
}
