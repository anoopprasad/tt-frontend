// Type definitions for the application

export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface Client {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  clientId: number;
  client?: Client;
  isBillable: boolean;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  color?: string;
}

export interface Attachment {
  id: number;
  fileName: string;
  fileSize: number;
  contentType: string;
  url: string;
  uploadedAt: string;
}

export interface TimeEntry {
  id: number;
  description: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in seconds
  date: string;
  projectId?: number;
  project?: Project;
  clientId?: number;
  client?: Client;
  tagIds?: number[];
  tags?: Tag[];
  teamIds?: number[];
  teams?: Team[];
  isBillable: boolean;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  todayHours: number;
  weekHours: number;
  monthHours: number;
  billableHours: number;
  nonBillableHours: number;
}

export interface ReportData {
  entries: TimeEntry[];
  summary: {
    totalHours: number;
    billableHours: number;
    byProject: Record<number, number>;
    byTag: Record<number, number>;
    byTeam: Record<number, number>;
  };
}

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  error: {
    message: string;
    code: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
