import promptsData from './prompts.json';

export type Prompt = {
  id: string;
  text: string;
  category: string;
};

export type Category = {
  id: string;
  title: string;
  icon: string; // We can use lucide-react icon names or similar
  description: string;
};

export const categories: Category[] = [
  { id: "copywriting", title: "Copywriting", icon: "PenTool", description: "Craft persuasive text to drive action and engagement." },
  { id: "email-marketing", title: "Email Marketing", icon: "Mail", description: "Write emails that get opened, read, and clicked." },
  { id: "blog-writing", title: "Blog Writing", icon: "FileText", description: "Create compelling blog posts that rank and resonate." },
  { id: "influencer-marketing", title: "Influencer Marketing", icon: "Users", description: "Collaborate with influencers to expand your reach." },
  { id: "youtube-ads", title: "YouTube Ads Scripts", icon: "Video", description: "Script video ads that capture attention and convert." },
  { id: "youtube-ideas", title: "YouTube Video Ideas", icon: "Youtube", description: "Generate viral video concepts and outlines." },
  { id: "facebook-ads", title: "Facebook Ads Copy", icon: "Facebook", description: "Write high-converting ad copy for social feeds." },
  { id: "instagram-stories", title: "Instagram Story Ideas", icon: "Instagram", description: "Engage your followers with creative story concepts." },
  { id: "twitter-threads", title: "Twitter Threads", icon: "Twitter", description: "Compose viral threads that grow your following." },
  { id: "cold-dm", title: "Cold DM Ideas", icon: "MessageCircle", description: "Start conversations that lead to opportunities." },
  { id: "cold-email", title: "Cold Email Ideas", icon: "Send", description: "Break the ice with emails that get responses." },
  { id: "growth-hacking", title: "Growth Hacking Frameworks", icon: "TrendingUp", description: "Apply proven frameworks to scale your growth." },
  { id: "content-creation", title: "Content Creation Frameworks", icon: "Layers", description: "Structure your content for maximum impact." },
  { id: "psychological", title: "Psychological Frameworks", icon: "Brain", description: "Leverage psychology to influence behavior." },
  { id: "marketing-copy", title: "Marketing Copy", icon: "Megaphone", description: "General marketing copy for various channels." },
  { id: "sales-copy", title: "Sales Copy", icon: "DollarSign", description: "Persuade prospects to make a purchase." },
  { id: "google-ads", title: "Google Ads", icon: "Search", description: "Create effective search and display ads." },
  { id: "productivity", title: "Productivity", icon: "Clock", description: "Optimize your workflow and get more done." },
  { id: "business", title: "Profitable Business", icon: "Briefcase", description: "Strategies to increase profitability and success." },
  { id: "learning", title: "Accelerate Learning", icon: "Zap", description: "Master new skills and topics faster." },
  { id: "career", title: "Get You A Job", icon: "UserCheck", description: "Boost your career and land your dream job." },
  { id: "self-help", title: "Self Help", icon: "Heart", description: "Personal development and well-being strategies." },
];

export const prompts: Prompt[] = promptsData as Prompt[];
