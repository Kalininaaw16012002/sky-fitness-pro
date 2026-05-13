import { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import api from '@/services/api';
import AuthModal from '@/components/AuthModal';
import type { ICourse } from '@/types';
import Yoga from '@/assets/images/Yoga.jpg';
import Stretching from '@/assets/images/Stretching.jpg';
import Fitness from '@/assets/images/Fitness.jpg';
import step from '@/assets/images/step.jpg';
import bodyflex from '@/assets/images/bodyflex.jpg';
import runner from '@/assets/images/runner.svg';
import runnermv from '@/assets/images/runnermv.svg';
import Vector1 from '@/assets/images/Vector1.svg';
import Vector2 from '@/assets/images/Vector2.svg';
import Header from '@/components/Header';

const courseImages: Record<string, string> = {
  Йога: Yoga,
  Стретчинг: Stretching,
  Фитнес: Fitness,
  'Степ-аэробика': step,
  Бодифлекс: bodyflex,
};

const courseColors: Record<string, string> = {
  Йога: '#FFC700',
  Стретчинг: '#2491D2',
  Фитнес: '#F7A012',
  'Степ-аэробика': '#FF7E65',
  Бодифлекс: '#7D458C',
};

export default function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [userCourses, setUserCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('token');

    Promise.all([api.get(`/courses/${id}`), token ? api.get('/users/me') : Promise.resolve(null)])
      .then(([courseRes, userRes]) => {
        setCourse(courseRes.data);
        if (userRes?.data?.selectedCourses) {
          setUserCourses(userRes.data.selectedCourses);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Не удалось загрузить курс');
        setLoading(false);
      });
  }, [id]);

  const handleAuthSuccess = (token: string, email: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    setIsAuthModalOpen(false);
    window.dispatchEvent(new Event('auth-change'));
  };

  const handleAddCourseClick = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    api
      .post('/users/me/courses', { courseId: id })
      .then(() => {
        setUserCourses((prev) => [...prev, id!]);
      })
      .catch((err: any) => {
        alert(err.response?.data?.message || 'Ошибка при добавлении курса');
      });
  };

  if (loading) return <div className="text-center py-20">Загрузка...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!course) return <div className="text-center py-20">Курс не найден</div>;

  const courseImage = courseImages[course.nameRU] || Yoga;
  const token = localStorage.getItem('token');
  const isAdded = token && userCourses.includes(id!);
  const titleClass =
    'absolute top-[40px] left-[40px] w-[300px] font-[Roboto] font-medium text-[40px] md:text-[50px] lg:text-[60px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] text-white z-20 hidden lg:block';

  return (
    <div className="min-h-screen">
      <Header onOpenAuth={() => setIsAuthModalOpen(true)} />

      <section className="container mx-auto px-4 mb-[40px] lg:mb-[60px]">
        <div className="lg:hidden w-full rounded-[30px] overflow-hidden shadow-md">
          <img src={courseImage} alt={course.nameRU} className="w-full h-[389px] object-cover" />
        </div>

        <div
          className="hidden lg:block relative w-full h-[400px] rounded-[30px] overflow-hidden"
          style={{ backgroundColor: courseColors[course.nameRU] || '#FFC700' }}
        >
          <h1 className={titleClass}>{course.nameRU}</h1>
          <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
            <img
              src={courseImages[course.nameRU] || Yoga}
              alt={course.nameRU}
              className="h-full w-auto object-contain max-w-[50%] md:max-w-[60%] lg:max-w-[800px] z-10"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mb-[40px] lg:mb-[60px]">
        <h2 className="font-[Roboto] font-medium text-[24px] lg:text-[32px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] text-gray-900 mb-[24px] lg:mb-[40px]">
          Подойдет для вас, если:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(course.fitting || []).map((item: string, idx: number) => (
            <div
              key={idx}
              className="rounded-[20px] p-6 flex items-start gap-4"
              style={{
                background: 'linear-gradient(115.81deg, #151720 34.98%, #1E212E 91.5%)',
              }}
            >
              <span className="flex-shrink-0 font-[Roboto] font-medium text-[75px] lg:text-[75px] leading-[100%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] text-[#BCEC30]">
                {idx + 1}
              </span>
              <p className="font-[Roboto] font-normal text-[18px] lg:text-[24px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] text-white">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 mb-8 lg:mb-[100px] relative z-10">
        <h2 className="text-[24px] md:text-[32px] font-[Roboto] font-medium text-gray-900 mb-[24px] lg:mb-[40px]">
          Направления
        </h2>
        <div className="w-full rounded-[28px] bg-[#BCEC30] p-6 md:p-8 flex flex-wrap gap-4 md:gap-x-[60px] md:gap-y-[20px]">
          {(course.directions || []).map((dir: string, idx: number) => (
            <span
              key={idx}
              className="w-full md:w-[calc(50%-30px)] lg:w-[calc(33.333%-40px)] text-black text-[16px] md:text-[24px] font-[Roboto] flex items-center gap-2"
            >
              <span>✦</span> {dir}
            </span>
          ))}
        </div>
      </section>

      <div className="lg:hidden relative h-[450px] -mt-[165px] mb-[-165px] z-20 flex justify-center pointer-events-none">
        <img
          src={runnermv}
          alt="runner mobile"
          className="h-[450px] w-auto object-contain drop-shadow-lg"
        />
      </div>

      <section className="relative container mx-auto px-4 mb-12 lg:mb-16 overflow-visible z-30">
        <div className="relative w-full rounded-[30px] bg-white shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)] p-6 md:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-[437px] flex flex-col gap-6 lg:gap-7 z-20 relative">
              <h2 className="text-black text-[28px] sm:text-[36px] lg:text-[60px] font-[Roboto] font-medium leading-[110%]">
                Начните путь <br className="hidden sm:inline" />к новому телу
              </h2>

              <ul className="list-disc list-outside pl-5 text-black/70 text-[14px] sm:text-[16px] lg:text-[18px] leading-[130%] space-y-2 font-[Roboto]">
                <li>проработка всех групп мышц</li>
                <li>тренировка суставов</li>
                <li>улучшение циркуляции крови</li>
                <li>упражнения заряжают бодростью</li>
                <li>помогают противостоять стрессам</li>
              </ul>

              {!token ? (
                <button
                  onClick={handleAddCourseClick}
                  className="w-full sm:w-[380px] h-[50px] lg:h-[52px] rounded-[46px] bg-[#BCEC30] text-black text-[14px] lg:text-[16px] font-[Roboto] font-medium cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Войдите, чтобы добавить курс
                </button>
              ) : isAdded ? (
                <button
                  disabled
                  className="w-full sm:w-[380px] h-[50px] lg:h-[52px] rounded-[46px] bg-[#F7F7F7] text-gray-400 text-[14px] lg:text-[16px] font-[Roboto] font-medium cursor-not-allowed"
                >
                  Курс добавлен
                </button>
              ) : (
                <button
                  onClick={handleAddCourseClick}
                  className="w-full sm:w-[380px] h-[50px] lg:h-[52px] rounded-[46px] bg-[#BCEC30] text-black text-[14px] lg:text-[16px] font-[Roboto] font-medium cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Добавить курс
                </button>
              )}
            </div>

            <div className="hidden lg:block absolute right-[80px] top-[-100px] w-[500px] h-[600px] z-0 pointer-events-none">
              <img
                src={Vector2}
                alt="decor back"
                className="absolute top-[200px] w-[670px] h-[390px] object-contain z-0"
                style={{ transform: 'rotate(12.38deg)' }}
              />
              <img
                src={runner}
                alt="athlete"
                className="absolute top-[0px] left-[0px] object-contain z-10 drop-shadow-xl"
              />
              <img
                src={Vector1}
                alt="decor front"
                className="absolute top-[130px] right-[350px] w-[50px] h-[42px] object-contain z-20"
              />
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
