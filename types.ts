import React from 'react';

export enum Category {
  PERSONAL = 'PERSONAL',
  WORK = 'WORK',
  SHOPPING = 'SHOPPING',
}

export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: Category;
  dateTime: string;
  timerDuration: number; // in seconds
  priority: Priority;
}