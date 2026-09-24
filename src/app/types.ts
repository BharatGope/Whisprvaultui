export type Note = {
  id: string;
  title: string;
  content: string;
  category: "Personal" | "Work" | "Password";
  createdAt: Date;
  links?: string[];
  attachments?: { name: string; url: string; type: string }[];
};
