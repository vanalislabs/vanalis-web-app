import { SearchResults, ProjectSearchResult, DatasetSearchResult, UserSearchResult } from "@/types/search";
import projectImage from "@assets/dummy/Team_data_collection_illustration_dd59af91.png";
import datasetImage from "@assets/dummy/AI_dataset_visualization_thumbnail_8ab46a36.png";
import avatarImage from "@assets/dummy/Tech_professional_avatar_headshot_e62e7352.png";

// Mock data for projects
const mockProjects: ProjectSearchResult[] = [
  {
    id: "1",
    title: "Medical Image Dataset Collection",
    image: projectImage,
    status: "open",
    reward: "5,000 SUI",
    submissions: 245,
    curatorName: "Dr. Sarah Chen",
  },
  {
    id: "2",
    title: "Natural Language Processing Dataset",
    image: projectImage,
    status: "closing-soon",
    reward: "3,500 SUI",
    submissions: 890,
    curatorName: "Alex Johnson",
  },
  {
    id: "3",
    title: "Computer Vision Training Data",
    image: projectImage,
    status: "open",
    reward: "8,000 SUI",
    submissions: 120,
    curatorName: "Maria Garcia",
  },
  {
    id: "4",
    title: "Speech Recognition Audio Collection",
    image: projectImage,
    status: "completed",
    reward: "4,200 SUI",
    submissions: 1500,
    curatorName: "John Smith",
  },
  {
    id: "5",
    title: "Autonomous Driving Scenarios",
    image: projectImage,
    status: "open",
    reward: "10,000 SUI",
    submissions: 340,
    curatorName: "Emma Wilson",
  },
  {
    id: "6",
    title: "Financial Market Data Collection",
    image: projectImage,
    status: "closing-soon",
    reward: "6,500 SUI",
    submissions: 780,
    curatorName: "Robert Lee",
  },
  {
    id: "7",
    title: "CT Scan Medical Imaging Dataset",
    image: projectImage,
    status: "open",
    reward: "7,200 SUI",
    submissions: 156,
    curatorName: "Dr. Michael Brown",
  },
  {
    id: "8",
    title: "Multilingual Sentiment Analysis Corpus",
    image: projectImage,
    status: "open",
    reward: "4,800 SUI",
    submissions: 523,
    curatorName: "Ling Zhang",
  },
  {
    id: "9",
    title: "Object Detection Training Images",
    image: projectImage,
    status: "closing-soon",
    reward: "9,500 SUI",
    submissions: 234,
    curatorName: "David Kim",
  },
  {
    id: "10",
    title: "Music Genre Classification Audio",
    image: projectImage,
    status: "open",
    reward: "3,200 SUI",
    submissions: 678,
    curatorName: "Sophie Martinez",
  },
  {
    id: "11",
    title: "Cryptocurrency Trading Signals",
    image: projectImage,
    status: "open",
    reward: "12,000 SUI",
    submissions: 445,
    curatorName: "James Anderson",
  },
  {
    id: "12",
    title: "Self-Driving Car Sensor Data",
    image: projectImage,
    status: "open",
    reward: "15,000 SUI",
    submissions: 189,
    curatorName: "Dr. Lisa Wang",
  },
  {
    id: "13",
    title: "E-commerce Product Recommendation",
    image: projectImage,
    status: "closing-soon",
    reward: "6,800 SUI",
    submissions: 912,
    curatorName: "Tom Wilson",
  },
  {
    id: "14",
    title: "Agricultural Crop Monitoring",
    image: projectImage,
    status: "open",
    reward: "5,500 SUI",
    submissions: 267,
    curatorName: "Anna Thompson",
  },
  {
    id: "15",
    title: "Robotic Arm Movement Patterns",
    image: projectImage,
    status: "open",
    reward: "8,500 SUI",
    submissions: 134,
    curatorName: "Dr. Kevin Park",
  },
  {
    id: "16",
    title: "X-Ray Image Classification",
    image: projectImage,
    status: "completed",
    reward: "4,500 SUI",
    submissions: 2100,
    curatorName: "Dr. Sarah Chen",
  },
  {
    id: "17",
    title: "Named Entity Recognition Corpus",
    image: projectImage,
    status: "open",
    reward: "3,800 SUI",
    submissions: 456,
    curatorName: "Alex Johnson",
  },
  {
    id: "18",
    title: "Facial Recognition Training Set",
    image: projectImage,
    status: "closing-soon",
    reward: "11,200 SUI",
    submissions: 312,
    curatorName: "Maria Garcia",
  },
  {
    id: "19",
    title: "Voice Command Recognition",
    image: projectImage,
    status: "open",
    reward: "5,200 SUI",
    submissions: 589,
    curatorName: "John Smith",
  },
  {
    id: "20",
    title: "Stock Market Prediction Data",
    image: projectImage,
    status: "open",
    reward: "9,800 SUI",
    submissions: 623,
    curatorName: "Emma Wilson",
  },
];

// Mock data for datasets
const mockDatasets: DatasetSearchResult[] = [
  {
    id: "1",
    name: "Curated Medical Imaging - X-Ray Collection",
    image: datasetImage,
    price: "250",
    itemsCount: 5000,
    category: "Healthcare",
  },
  {
    id: "2",
    name: "Multilingual Text Dataset - 50 Languages",
    image: datasetImage,
    price: "180",
    itemsCount: 25000,
    category: "NLP",
  },
  {
    id: "3",
    name: "Autonomous Driving Scenarios",
    image: datasetImage,
    price: "420",
    itemsCount: 15000,
    category: "Computer Vision",
  },
  {
    id: "4",
    name: "Speech Recognition Audio Dataset",
    image: datasetImage,
    price: "300",
    itemsCount: 10000,
    category: "Audio",
  },
  {
    id: "5",
    name: "E-commerce Product Images",
    image: datasetImage,
    price: "150",
    itemsCount: 8000,
    category: "Computer Vision",
  },
  {
    id: "6",
    name: "Financial Time Series Data",
    image: datasetImage,
    price: "500",
    itemsCount: 20000,
    category: "Finance",
  },
  {
    id: "7",
    name: "CT Scan Medical Images Dataset",
    image: datasetImage,
    price: "320",
    itemsCount: 12000,
    category: "Healthcare",
  },
  {
    id: "8",
    name: "Sentiment Analysis Multilingual Corpus",
    image: datasetImage,
    price: "220",
    itemsCount: 35000,
    category: "NLP",
  },
  {
    id: "9",
    name: "Object Detection COCO Format",
    image: datasetImage,
    price: "480",
    itemsCount: 18000,
    category: "Computer Vision",
  },
  {
    id: "10",
    name: "Music Genre Classification Audio",
    image: datasetImage,
    price: "200",
    itemsCount: 15000,
    category: "Audio",
  },
  {
    id: "11",
    name: "Cryptocurrency Price History",
    image: datasetImage,
    price: "550",
    itemsCount: 45000,
    category: "Finance",
  },
  {
    id: "12",
    name: "LiDAR Point Cloud Data",
    image: datasetImage,
    price: "680",
    itemsCount: 22000,
    category: "Autonomous Driving",
  },
  {
    id: "13",
    name: "Product Recommendation Training Set",
    image: datasetImage,
    price: "280",
    itemsCount: 28000,
    category: "E-commerce",
  },
  {
    id: "14",
    name: "Crop Disease Detection Images",
    image: datasetImage,
    price: "350",
    itemsCount: 14000,
    category: "Agriculture",
  },
  {
    id: "15",
    name: "Robotic Manipulation Trajectories",
    image: datasetImage,
    price: "600",
    itemsCount: 9000,
    category: "Robotics",
  },
  {
    id: "16",
    name: "MRI Brain Scan Collection",
    image: datasetImage,
    price: "450",
    itemsCount: 16000,
    category: "Healthcare",
  },
  {
    id: "17",
    name: "Question Answering Dataset",
    image: datasetImage,
    price: "190",
    itemsCount: 40000,
    category: "NLP",
  },
  {
    id: "18",
    name: "Facial Recognition Training Images",
    image: datasetImage,
    price: "520",
    itemsCount: 25000,
    category: "Computer Vision",
  },
  {
    id: "19",
    name: "Voice Command Audio Samples",
    image: datasetImage,
    price: "240",
    itemsCount: 18000,
    category: "Audio",
  },
  {
    id: "20",
    name: "Stock Market Historical Data",
    image: datasetImage,
    price: "720",
    itemsCount: 50000,
    category: "Finance",
  },
];

// Mock data for users
const mockUsers: UserSearchResult[] = [
  {
    address: "0x7a3f...9d2e",
    username: "sarah.chen",
    avatar: avatarImage,
  },
  {
    address: "0x1234...5678",
    username: "alice.sui",
    avatar: avatarImage,
  },
  {
    address: "0x2345...6789",
    username: "bob.sui",
    avatar: avatarImage,
  },
  {
    address: "0x3456...7890",
    username: "alex.johnson",
    avatar: avatarImage,
  },
  {
    address: "0x4567...8901",
    username: "maria.garcia",
    avatar: avatarImage,
  },
  {
    address: "0x5678...9012",
    username: "john.smith",
    avatar: avatarImage,
  },
  {
    address: "0x6789...0123",
    username: "michael.brown",
    avatar: avatarImage,
  },
  {
    address: "0x7890...1234",
    username: "ling.zhang",
    avatar: avatarImage,
  },
  {
    address: "0x8901...2345",
    username: "david.kim",
    avatar: avatarImage,
  },
  {
    address: "0x9012...3456",
    username: "sophie.martinez",
    avatar: avatarImage,
  },
  {
    address: "0xa012...4567",
    username: "james.anderson",
    avatar: avatarImage,
  },
  {
    address: "0xb123...5678",
    username: "lisa.wang",
    avatar: avatarImage,
  },
  {
    address: "0xc234...6789",
    username: "tom.wilson",
    avatar: avatarImage,
  },
  {
    address: "0xd345...7890",
    username: "anna.thompson",
    avatar: avatarImage,
  },
  {
    address: "0xe456...8901",
    username: "kevin.park",
    avatar: avatarImage,
  },
  {
    address: "0xf567...9012",
    username: "emily.davis",
    avatar: avatarImage,
  },
  {
    address: "0x0678...a123",
    username: "ryan.taylor",
    avatar: avatarImage,
  },
  {
    address: "0x1789...b234",
    username: "olivia.white",
    avatar: avatarImage,
  },
  {
    address: "0x2890...c345",
    username: "chris.moore",
    avatar: avatarImage,
  },
  {
    address: "0x3901...d456",
    username: "isabella.jones",
    avatar: avatarImage,
  },
];

/**
 * Normalizes reward field for search by removing commas and " SUI" suffix
 * Example: "5,000 SUI" -> "5000"
 */
function normalizeRewardForSearch(reward: string): string {
  return reward
    .replace(/,/g, '') // Remove commas
    .replace(/\s+SUI/gi, '') // Remove " SUI" suffix (case-insensitive)
    .trim();
}

/**
 * Normalizes price field for search by adding " sui" suffix for consistency with UI
 * Example: "250" -> "250 sui"
 */
function normalizePriceForSearch(price: string): string {
  return `${price} sui`;
}

/**
 * Filters items based on query string (case-insensitive, multi-field search)
 * Includes normalization for reward and price fields for better matching
 */
function filterByQuery<T extends ProjectSearchResult | DatasetSearchResult | UserSearchResult>(
  items: T[],
  query: string
): T[] {
  if (!query || query.length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  // Normalize query by removing commas for better matching with reward field
  const normalizedQuery = lowerQuery.replace(/,/g, '');

  return items.filter((item) => {
    // Multi-field search based on type
    if ('title' in item) {
      // ProjectSearchResult
      const project = item as ProjectSearchResult;
      const normalizedReward = normalizeRewardForSearch(project.reward).toLowerCase();
      return (
        project.title.toLowerCase().includes(lowerQuery) ||
        project.curatorName.toLowerCase().includes(lowerQuery) ||
        project.status.toLowerCase().includes(lowerQuery) ||
        normalizedReward.includes(normalizedQuery) ||
        project.reward.toLowerCase().includes(lowerQuery) // Fallback for exact format match
      );
    } else if ('name' in item) {
      // DatasetSearchResult
      const dataset = item as DatasetSearchResult;
      const normalizedPrice = normalizePriceForSearch(dataset.price).toLowerCase();
      return (
        dataset.name.toLowerCase().includes(lowerQuery) ||
        dataset.category.toLowerCase().includes(lowerQuery) ||
        normalizedPrice.includes(lowerQuery) ||
        dataset.price.toLowerCase().includes(lowerQuery) // Fallback for numeric search
      );
    } else if ('username' in item) {
      // UserSearchResult
      const user = item as UserSearchResult;
      return (
        user.username.toLowerCase().includes(lowerQuery) ||
        user.address.toLowerCase().includes(lowerQuery)
      );
    }
    return false;
  });
}

/**
 * Mock search service that filters mock data based on query
 * Returns maximum 5-8 results per category for preview
 */
export async function search(query: string): Promise<SearchResults> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const filteredProjects = filterByQuery(mockProjects, query).slice(0, 5);
  const filteredDatasets = filterByQuery(mockDatasets, query).slice(0, 5);
  const filteredUsers = filterByQuery(mockUsers, query).slice(0, 5);

  return {
    projects: filteredProjects,
    datasets: filteredDatasets,
    users: filteredUsers,
  };
}

