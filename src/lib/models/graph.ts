/**
 * Graph data models for the Neo4j database
 * These interfaces represent the node types and their relationships in the graph
 */

// User node
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
}

// Group node
export interface Group {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Expense node
export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  createdAt: Date;
  category?: string;
  receiptImage?: string;
}

// Card node
export interface Card {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  createdAt: Date;
  isActive: boolean;
  isVirtual: boolean;
  stripeCardId?: string;
}

// Relationship types
export enum RelationshipTypes {
  MEMBER_OF = 'MEMBER_OF',
  BELONGS_TO = 'BELONGS_TO', 
  PAID = 'PAID',
  OWES = 'OWES',
  LINKED_TO = 'LINKED_TO',
  FRIENDS_WITH = 'FRIENDS_WITH'
}

// Relationship properties
export interface MemberOfRelationship {
  userId: string;
  groupId: string;
  joinedAt: Date;
  isAdmin: boolean;
}

export interface PaidRelationship {
  userId: string;
  expenseId: string;
  date: Date;
}

export interface OwesRelationship {
  userId: string;
  expenseId: string;
  amount: number;
  isPaid: boolean;
  settledAt?: Date;
}