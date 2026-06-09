import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersApi, coursesApi } from '@/services/api';
import Header from '@/components/Header/Header';
import type { ICourse, ICourseProgress } from '@/types';
import Yoga from '@/assets/images/Yoga.jpg';
import Stretching from '@/assets/images/Stretching.jpg';
import Fitness from '@/assets/images/Fitness.jpg';
import step from '@/assets/images/step.jpg';
import bodyflex from '@/assets/images/bodyflex.jpg';
import profile from '@/assets/images/profile.svg';
import minus from '@/assets/images/minus.png';
import Calendar from '@/assets/images/Calendar.svg';
import Time from '@/assets/images/Time.svg';
import mingcute from '@/assets/images/mingcute.svg';
import WorkoutSelectionModal from '@/components/WorkoutSelectionModal/WorkoutSelectionModal';

const courseImages: Record<string, string> = {
  Йога: Yoga,
  Стретчинг: Stretching,
  Фитнес: Fitness,
  'Степ-аэробика': step,
  Бодифлекс: bodyflex,
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [myCourses, setMyCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({});
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);

  const loadUserCourses = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    usersApi
      .getMe()
      .then((userRes) => {
        const selectedCourseIds = userRes.data.user?.selectedCourses || [];
        setUserEmail(userRes.data.user?.email || localStorage.getItem('userEmail'));

        if (selectedCourseIds.length === 0) {
          setMyCourses([]);
          setCourseProgress({});
          setLoading(false);
          return;
        }

        const coursePromises = selectedCourseIds.map((id: string) =>
          coursesApi
            .getById(id)
            .then((res) => {
              return res.data;
            })
            .catch((err) => {
              console.error(`Ошибка загрузки курса ${id}:`, err);
              return null;
            }),
        );

        Promise.all(coursePromises).then((coursesData) => {
          const validCourses = coursesData.filter((c): c is ICourse => c !== null);

          setMyCourses(validCourses);
          setCourseProgress({});

          validCourses.forEach((course: ICourse) => {
            usersApi
              .getCourseProgress(course._id)
              .then((progressRes) => {
                const data = progressRes.data as ICourseProgress;
                let percent = 0;
                if (data.workoutsProgress && data.workoutsProgress.length > 0) {
                  const completedCount = data.workoutsProgress.filter(
                    (w) => w.workoutCompleted,
                  ).length;
                  const totalWorkouts = course.workouts?.length || 1;
                  percent = Math.round((completedCount / totalWorkouts) * 100);
                }
                setCourseProgress((prev) => ({ ...prev, [course._id]: percent }));
              })
              .catch((err) => {
                console.error(`Ошибка загрузки прогресса для ${course._id}:`, err);
              });
          });

          setLoading(false);
        });
      })
      .catch((err) => {
        console.error('Критическая ошибка при загрузке пользователя:', err);
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    loadUserCourses();
    const handleCourseUpdate = () => {
      loadUserCourses();
    };
    window.addEventListener('course-updated', handleCourseUpdate);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadUserCourses();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('course-updated', handleCourseUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadUserCourses]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  const handleRemoveCourse = (courseId: string) => {
    usersApi
      .removeCourse(courseId)
      .then(() => {
        window.dispatchEvent(new Event('course-updated'));
      })
      .catch((err) => alert(err.response?.data?.message || 'Ошибка удаления'));
  };

  const getButtonText = (courseId: string) => {
    const progress = courseProgress[courseId] || 0;
    if (progress === 0) return 'Начать тренировки';
    if (progress === 100) return 'Начать заново';
    return 'Продолжить';
  };

  const handleStartTrainingClick = (course: ICourse) => {
    setSelectedCourse(course);
    setIsWorkoutModalOpen(true);
  };

  if (loading) return <div className="text-center py-20">Загрузка...</div>;

  return (
    <div className="min-h-screen">
      <Header onOpenAuth={() => navigate('/')} />

      <main className="container mx-auto px-4 pb-20">
        <h1 className="font-[Roboto] font-semibold text-[24px] lg:text-[40px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] text-gray-900 mt-0 lg:mt-8 mb-[24px] lg:mb-[40px]">
          Профиль
        </h1>

        <div className="w-full mx-auto bg-white rounded-[30px] p-[30px] flex flex-col md:flex-row items-center md:items-start gap-[33px] mb-[60px] shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)]">
          <div className="w-[197px] h-[197px] bg-gray-100 rounded-[20px] overflow-hidden flex-shrink-0 flex items-center justify-center">
            <img
              src={profile}
              alt="Profile"
              className="w-full h-full object-cover opacity-50"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
          <div className="flex flex-col items-start md:pl-[0px] lg:pl-[0px] w-full md:w-auto">
            <h2 className="font-[Roboto] font-medium text-[24px] lg:text-[32px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] text-gray-900 mb-[20px] lg:mb-[30px]">
              {userEmail?.split('@')[0] || 'Пользователь'}
            </h2>

            <p className="font-[Roboto] font-normal text-[18px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] text-black mb-[20px] lg:mb-[44px]">
              Логин: {userEmail}
            </p>

            <button
              onClick={handleLogout}
              className="w-[192px] h-[52px] rounded-[46px] border border-black bg-white text-black font-[Roboto] font-normal text-[18px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              Выйти
            </button>
          </div>
        </div>

        <h2 className="font-[Roboto] font-semibold text-[24px] lg:text-[40px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] text-gray-900 mb-[24px] lg:mb-[40px]">
          Мои курсы
        </h2>

        {myCourses.length === 0 ? (
          <div className="text-center py-[24px] text-gray-500 font-[Roboto] text-[18px]">
            У вас пока нет добавленных курсов.{' '}
            <Link to="/" className="text-[#BCEC30] underline">
              Выбрать курс
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px] justify-items-center">
            {myCourses.map((course) => {
              const progress = courseProgress[course._id] || 0;
              return (
                <div
                  key={course._id}
                  className="w-full max-w-[360px]  bg-white shadow-md overflow-hidden flex flex-col  rounded-[30px] relative group"
                >
                  <div className="w-full h-[316px] relative">
                    <img
                      src={courseImages[course.nameRU] || Yoga}
                      alt={course.nameRU}
                      className="w-full h-full object-cover"
                    />

                    <button
                      onClick={() => handleRemoveCourse(course._id)}
                      className="absolute top-[22px] right-[22px] cursor-pointer flex items-center justify-center p-2"
                      title="Удалить курс"
                    >
                      <img src={minus} alt="Удалить" className="w-[32px] h-[32px] object-contain" />
                    </button>
                  </div>

                  <div className="flex flex-col flex-grow px-[30px] pt-[24px] pb-[24px] gap-[20px]">
                    <h3 className="text-gray-900 m-0 font-[Roboto] font-medium text-[24px] lg:text-[32px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums]">
                      {course.nameRU}
                    </h3>

                    <div className="flex flex-row flex-wrap gap-[6px]">
                      <div className="flex items-center justify-center w-[103px] h-[38px] rounded-[50px] bg-[#F7F7F7] gap-[6px]">
                        <img src={Calendar} alt="календарь" className="w-4 h-4" />
                        <span className="text-[#202020] font-[Roboto] font-normal text-[16px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] whitespace-nowrap">
                          {course.durationInDays} дней
                        </span>
                      </div>

                      <div className="flex items-center justify-center w-[163px] h-[38px] rounded-[50px] bg-[#F7F7F7] gap-[6px]">
                        <img src={Time} alt="время" className="w-4 h-4" />
                        <span className="text-[#202020] font-[Roboto] font-normal text-[16px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] whitespace-nowrap">
                          {course.dailyDurationInMinutes.from}-{course.dailyDurationInMinutes.to}{' '}
                          мин/день
                        </span>
                      </div>

                      <div className="flex items-center justify-center w-[129px] h-[38px] rounded-[50px] bg-[#F7F7F7] gap-[6px]">
                        <img src={mingcute} alt="сложность" className="w-4 h-4" />
                        <span className="text-[#202020] font-[Roboto] font-normal text-[16px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] whitespace-nowrap">
                          {course.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-baseline mb-[20px]">
                        <span className="font-[Roboto] font-normal text-[18px] leading-[110%] text-gray-900 mr-[5px]">
                          Прогресс
                        </span>
                        <span className="font-[Roboto] font-normal text-[18px] leading-[110%] text-gray-900">
                          {progress}%
                        </span>
                      </div>

                      <div className="w-full h-[6px] bg-gray-200 rounded-[50px] overflow-hidden mb-[40px]">
                        <div
                          className={`h-full rounded-[50px] transition-all duration-500 ${progress > 0 ? 'bg-[#2491D2]' : 'bg-transparent'}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <button
                        onClick={() => handleStartTrainingClick(course)}
                        className="block w-full h-[52px] rounded-[46px] bg-[#BCEC30] text-black font-[Roboto] font-normal text-[18px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] flex items-center justify-center hover:opacity-90 transition-opacity"
                      >
                        {getButtonText(course._id)}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="container mx-auto px-4 mt-[24px] lg:mt-[34px] mb-12 flex justify-end lg:justify-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#BCEC30] text-black rounded-[46px] border-none cursor-pointer flex items-center justify-center gap-[8px] w-[127px] h-[52px] p-[16px_26px] font-[Roboto] font-medium text-[16px] hover:opacity-90 transition-opacity"
          >
            Наверх ↑
          </button>
        </div>
      </main>

      <WorkoutSelectionModal
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
}
