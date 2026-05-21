export interface ICourse {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  difficulty: string;
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  workouts: string[];
}

export interface IWorkout {
  _id: string;
  name: string;
  video: string;
  exercises: Array<{
    _id: string;
    name: string;
    quantity: number;
  }>;
}

export interface IUser {
  _id: string;
  email: string;
  selectedCourses: string[];
}

export interface IWorkoutProgressItem {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
}

export interface ICourseProgress {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: IWorkoutProgressItem[];
}

export interface IWorkoutProgress {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
}
