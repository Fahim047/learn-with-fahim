interface ErrorResponseType {
  success: boolean;
  error: string;
}

export enum CourseLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ServerActionResponse {
  success: boolean;
  message: string;
}
