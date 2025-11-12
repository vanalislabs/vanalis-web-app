export interface ProjectSearchResult {
  id: string;
  title: string;
  image: string;
  status: "open" | "closing-soon" | "completed";
  reward: string;
  submissions: number;
  curatorName: string;
}

export interface DatasetSearchResult {
  id: string;
  name: string;
  image: string;
  price: string;
  itemsCount: number;
  category: string;
}

export interface UserSearchResult {
  address: string;
  username: string;
  avatar?: string;
}

export interface SearchResults {
  projects: ProjectSearchResult[];
  datasets: DatasetSearchResult[];
  users: UserSearchResult[];
}

