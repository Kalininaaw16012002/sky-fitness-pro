import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesApi, usersApi } from '@/services/api';
import type { ICourse } from '@/types';

interface WorkoutSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: ICourse | null;
}

interface Workout {
  _id: string;
  name: string;
  video: string;
  exercises: Array<{ name: string; quantity: number; _id: string }>;
}

export default function WorkoutSelectionModal({
  isOpen,
  onClose,
  course,
}: WorkoutSelectionModalProps) {
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<string[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && course) {
      setLoading(true);
      setSelectedWorkoutId(null);

      Promise.all([
        coursesApi.getWorkouts(course._id),
        usersApi.getCourseProgress(course._id).catch(() => ({ data: { workoutsProgress: [] } })),
      ])
        .then(([workoutsRes, progressRes]) => {
          setWorkouts(workoutsRes.data);

          const completed =
            progressRes.data.workoutsProgress
              ?.filter((w: any) => w.workoutCompleted)
              .map((w: any) => w.workoutId) || [];

          setCompletedWorkouts(completed);
        })
        .catch((err) => console.error('Ошибка загрузки:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, course]);

  if (!isOpen || !course) return null;

  const handleSelectWorkout = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
  };

  const handleStart = () => {
    if (selectedWorkoutId) {
      navigate(`/workout/${selectedWorkoutId}?courseId=${course._id}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[30px] shadow-xl w-full max-w-[460px] h-auto max-h-[80vh] p-6 lg:p-[40px] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:top-[30px] lg:right-[30px] text-gray-400 hover:text-gray-600 text-3xl leading-none z-10"
        >
          &times;
        </button>

        <h3 className="font-[Roboto] font-normal text-[24px] lg:text-[32px] leading-[110%] text-gray-900 text-center mb-6 lg:mb-[48px] mt-2">
          Выберите тренировку
        </h3>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 min-h-0">
          {loading ? (
            <p className="text-center text-gray-500 py-10">Загрузка...</p>
          ) : workouts.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Тренировок пока нет</p>
          ) : (
            <div className="flex flex-col">
              {workouts.map((workout, index) => {
                const isSelected = selectedWorkoutId === workout._id;
                const isCompleted = completedWorkouts.includes(workout._id);
                const parts = workout.name.split('/').map((part) => part.trim());
                const workoutTitle = parts[0];
                const coursePart = parts[1] || course.nameRU;

                return (
                  <div
                    key={workout._id}
                    onClick={() => handleSelectWorkout(workout._id)}
                    className="flex items-center py-4 lg:py-5 border-b border-[#C4C4C4] cursor-pointer last:border-0 transition-colors"
                  >
                    <div className="flex-shrink-0 mr-3 lg:mr-4">
                      {isCompleted ? (
                        <div className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] rounded-full bg-[#BCEC30] flex items-center justify-center">
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 12 10"
                            fill="none"
                            className="lg:w-3 lg:h-2.5"
                          >
                            <path
                              d="M1 5L4 8L11 1"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      ) : isSelected ? (
                        <div className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] rounded-full bg-[#BCEC30] flex items-center justify-center">
                          <div className="w-[6px] h-[6px] lg:w-[8px] lg:h-[8px] rounded-full bg-white"></div>
                        </div>
                      ) : (
                        <div className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] rounded-full border-2 border-gray-300 bg-white"></div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 lg:gap-[4px] flex-1 min-w-0">
                      <span className="font-[Roboto] font-normal text-[18px] lg:text-[24px] leading-[110%] text-gray-900 truncate">
                        {workoutTitle}
                      </span>
                      <span className="font-[Roboto] font-normal text-[14px] lg:text-[16px] leading-[110%] text-gray-500 truncate">
                        {coursePart} / {index + 1} день
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={handleStart}
          disabled={!selectedWorkoutId}
          className={`
            w-full h-[48px] mt-[34px] lg:h-[52px] rounded-[46px] font-[Roboto] font-normal text-[16px] lg:text-[18px] leading-[110%] transition-all flex-shrink-0
            ${
              selectedWorkoutId
                ? 'bg-[#BCEC30] text-black cursor-pointer hover:opacity-90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Начать
        </button>
      </div>
    </div>
  );
}
