

export enum SelectedPage {
  Home = "home",
  Benefits = "benefits",
  Leaderboard = "leaderboard",
  ContactUs = "contactus",
  AddWorkout = "addworkout",
  RecentWorkouts = "recentworkouts",
  Connect = "connect",
}

export interface BenefitType {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface ClassType {
  name: string;
  description?: string;
  image: string;
}