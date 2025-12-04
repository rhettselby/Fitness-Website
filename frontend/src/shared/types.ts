import React from "react";

export enum SelectedPage {
  Home = "home",
  Benefits = "benefits",
  Leaderboard = "leaderboard",
  ContactUs = "contactus",
  AddWorkout = "addworkout",
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