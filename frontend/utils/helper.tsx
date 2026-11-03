export const DEPARTMENTS = [
  "Data Science",
  "Cybersecurity",
  "Software Development",
  "Information Management",
  "Computer Science",
];

export type ProfileType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  department: string;
  role?: string | null | undefined;
};
