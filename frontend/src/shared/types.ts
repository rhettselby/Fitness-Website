import React, { ReactNode } from "react";

export enum SelectedPage {
  Home = "home",
  Benefits = "benefits",
  Leaderboard = "leaderboard",
  ContactUs = "contactus",
  AddWorkout = "addworkout",
  RecentWorkouts = "recentworkouts",
  Connect = "connect",
  Group="group",
}

export interface BenefitType {
  icon: ReactNode;
  title: string;
  description: string;
  linkTo?: SelectedPage | string;
}

export interface ClassType {
  name: string;
  description?: string;
  image: string;
}