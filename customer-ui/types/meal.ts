export interface Meal {
    id?: string;
    title: string;
    summary: string;
    instructions: string;
    image: File | string;
    creator: string;
    creator_email: string;
    slug?: string;
  }