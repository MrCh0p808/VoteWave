export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  author: string;
  createdAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  createdAt: string;
}

export interface Booth {
  name: string;
  visibility: string;
  start: string;
  end: string;
  poll?: any;
  description?: string; 
}
