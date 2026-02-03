
// types.ts: Core data structures for the Gym Tracker application

/**
 * Represents the primary muscle group or type of exercise.
 */
export type ExerciseCategory = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio' | 'Other';

/**
 * Definition of an exercise in the catalog.
 */
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
}

/**
 * A single set performed during an exercise, including weight and repetition count.
 */
export interface ExerciseSet {
  id: string;
  weight: number;
  reps: number;
  timestamp: number;
}

/**
 * A record of a completed exercise session within a workout.
 */
export interface WorkoutRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSet[];
  date: string; // Format: YYYY-MM-DD
}

/**
 * Represents a body measurement or statistic (e.g., body weight).
 */
export interface ProgressEntry {
  id: string;
  type: 'Weight' | 'Body Fat' | 'Measurement';
  value: number;
  unit: string;
  date: string;
}

/**
 * Root state structure for the application data.
 */
export interface AppState {
  exercises: Exercise[];
  history: WorkoutRecord[];
  measurements: ProgressEntry[];
}
