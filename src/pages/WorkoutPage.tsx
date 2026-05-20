import { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { workoutsApi, usersApi, coursesApi } from '@/services/api';
import Header from '@/components/Header';
import type { ICourse } from '@/types';
import ProgressInputModal from '@/components/ProgressInputModal'; 
import SuccessModal from '@/components/SuccessModal';

interface Exercise {
  _id: string;
  name: string;
  quantity: number;
}

interface Workout {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
}

export default function WorkoutPage() {
  const { id: workoutId } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [course, setCourse] = useState<ICourse | null>(null);
  const [progressData, setProgressData] = useState<number[]>([]);
  const [savedProgress, setSavedProgress] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [workoutNumber, setWorkoutNumber] = useState<number>(1);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const courseId = new URLSearchParams(window.location.search).get('courseId');

    if (!workoutId || !courseId) {
      setError('Неверные параметры');
      setLoading(false);
      return;
    }

    Promise.all([
      workoutsApi.getById(workoutId),
      coursesApi.getById(courseId),
      coursesApi.getWorkouts(courseId),
      token
        ? usersApi.getWorkoutProgress(courseId, workoutId).catch(() => null)
        : Promise.resolve(null),
    ])
      .then(([workoutRes, courseRes, workoutsListRes, progressRes]) => {
        setWorkout(workoutRes.data);
        setCourse(courseRes.data);

        const workouts = workoutsListRes.data;
        const workoutIndex = workouts.findIndex((w: any) => w._id === workoutId);
        const calculatedNumber = workoutIndex >= 0 ? workoutIndex + 1 : 1;

        setWorkoutNumber(calculatedNumber);

        if (progressRes?.data?.progressData) {
          setProgressData(progressRes.data.progressData);
          setSavedProgress([...progressRes.data.progressData]);
        } else {
          const initial = new Array(workoutRes.data.exercises?.length || 0).fill(0);
          setProgressData(initial);
          setSavedProgress(initial);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Не удалось загрузить тренировку');
        setLoading(false);
      });
  }, [workoutId]);

  const handleProgressChange = (index: number, value: string) => {
    const num = parseInt(value) || 0;
    const newData = [...progressData];
    newData[index] = num;
    setProgressData(newData);
  };

  const handleSaveProgress = () => {
    const token = localStorage.getItem('token');
    const courseId = new URLSearchParams(window.location.search).get('courseId');

    if (!token || !courseId || !workoutId) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsProgressModalOpen(true);
  };

  const submitProgressToServer = (data: number[]) => {
    const token = localStorage.getItem('token');
    const courseId = new URLSearchParams(window.location.search).get('courseId');

    if (!token || !courseId || !workoutId || !workout) {
      alert('Ошибка: не хватает данных для сохранения');
      setIsProgressModalOpen(false);
      return;
    }
    if (data.length !== workout.exercises.length) {
      console.error('Длина progressData не совпадает с количеством упражнений');
      const fixedData = new Array(workout.exercises.length).fill(0);
      data.forEach((val, idx) => {
        if (idx < fixedData.length) fixedData[idx] = val;
      });
      data = fixedData;
    }

    const progressData = data.map((val) => {
      const num = typeof val === 'number' ? val : parseInt(val) || 0;
      return Math.max(0, num); 
    });

    usersApi
      .saveWorkoutProgress(courseId, workoutId, progressData)
      .then(() => {
        setProgressData(progressData);
        setSavedProgress([...progressData]);
        setIsProgressModalOpen(false);
        setIsSuccessModalOpen(true);
        window.dispatchEvent(new Event('course-updated'));
      })
      .catch((err) => {
        console.error('Ошибка сохранения прогресса:', err);
        const message =
          err.response?.data?.message || err.message || 'Не удалось сохранить прогресс';
        alert(message);
        setIsProgressModalOpen(false);
      });
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  };

  if (loading) return <div className="text-center py-20">Загрузка...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!workout || !course) return <div className="text-center py-20">Тренировка не найдена</div>;

  const hasSavedProgress = savedProgress.some((val) => val > 0);

  const submitButtonText = hasSavedProgress ? 'Обновить свой прогресс' : 'Заполнить свой прогресс';

  return (
    <div className="min-h-screen">
      <Header onOpenAuth={() => setIsAuthModalOpen(true)} />

      <main className="container mx-auto px-4 pb-20">
        <div className="w-full">
          <h1 className="font-[Roboto] font-semibold text-[24px] lg:text-[60px] leading-[110%] text-gray-900">
            {course.nameRU}
          </h1>
        </div>

        <div className="w-full mt-[40px]">
          <div className="relative w-full pb-[56.25%] rounded-[20px] overflow-hidden bg-black">
            <iframe
              src={workout.video}
              title={workout.name}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="w-full mt-[40px] bg-white rounded-[30px] p-[40px] shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)]">
          <h2 className="font-[Roboto] font-normal text-[32px] leading-[110%] text-gray-900 mb-[40px]">
            Упражнения тренировки {workoutNumber}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[60px] gap-y-[20px] mb-[40px]">
            {workout.exercises.map((exercise, index) => {
              const cleanExerciseName = exercise.name.split(' (')[0];
              const current = progressData[index] || 0;
              const target = exercise.quantity;
              const percent = calculateProgress(current, target);
              const isSaved = savedProgress[index] === current;

              return (
                <div key={exercise._id} className="flex flex-col">
                  <div className="flex justify-between items-baseline">
                    <span className="font-[Roboto] font-normal text-[18px] leading-[110%] text-gray-900">
                      {cleanExerciseName}
                    </span>
                    <span className="font-[Roboto] font-normal text-[16px] leading-[110%] text-gray-500">
                      {percent}%
                    </span>
                  </div>

                  <div className="mt-[10px]">
                    <div className="w-full h-[6px] bg-gray-200 rounded-[50px] overflow-hidden">
                      <div
                        className={`h-full rounded-[50px] transition-all duration-500 ${percent > 0 ? 'bg-[#2491D2]' : 'bg-transparent'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-start">
            <button
              onClick={handleSaveProgress}
              className="w-[320px] h-[52px] rounded-[46px] bg-[#BCEC30] text-black font-[Roboto] font-normal text-[18px] leading-[110%] hover:opacity-90 transition-opacity flex items-center justify-center"
            >
               {submitButtonText} 
            </button>
          </div>
        </div>
      </main>

      <ProgressInputModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        onSave={submitProgressToServer}
        exercises={workout.exercises}
        initialData={progressData}
      />

      <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} />
    </div>
  );
}
