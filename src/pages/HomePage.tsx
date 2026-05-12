import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '@/components/CourseCard/CourseCard';
import AuthModal from '@/components/AuthModal';
import api from '@/services/api';
import logo from '@/assets/images/logo.svg';
import flag from '@/assets/images/flag.svg';
import Yoga from '@/assets/images/Yoga.jpg';
import Stretching from '@/assets/images/Stretching.jpg';
import Fitness from '@/assets/images/Fitness.jpg';
import step from '@/assets/images/step.jpg';
import bodyflex from '@/assets/images/bodyflex.jpg';
import type { ICourse } from '@/types';

const courseImages: Record<string, string> = {
  Йога: Yoga,
  Стретчинг: Stretching,
  Фитнес: Fitness,
  'Степ-аэробика': step,
  Бодифлекс: bodyflex,
};

export default function HomePage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  useEffect(() => {
    api
      .get('/courses')
      .then((response) => {
        const desiredOrder = ['Йога', 'Стретчинг', 'Фитнес', 'Степ-аэробика', 'Бодифлекс'];
        const sorted = response.data.sort(
          (a: ICourse, b: ICourse) =>
            desiredOrder.indexOf(a.nameRU) - desiredOrder.indexOf(b.nameRU),
        );
        setCourses(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Не удалось загрузить курсы:', err);
        setError('Ошибка загрузки курсов');
        setLoading(false);
      });
  }, []);

  const handleAuthSuccess = (token: string, email: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    setUserEmail(email);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    setIsProfileMenuOpen(false);
    window.location.href = '/';
  };

  if (loading) return <div className="text-center py-20">Загрузка...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className="relative">
      <header className="bg-white relative">
        <div className="container mx-auto px-4 pt-[50px] pb-[40px] lg:pb-[60px] flex items-center justify-between">
          <div className="flex flex-col gap-[15px] shrink-0">
            <Link to="/">
              <img src={logo} alt="логотип" className="w-[220px] h-[35px] object-contain" />
            </Link>
            <p className="hidden lg:block text-gray-600 m-0 whitespace-nowrap font-normal text-[18px] leading-[110%] font-[Roboto]">
              Онлайн-тренировки для занятий дома
            </p>
          </div>
          <div className="relative" ref={menuRef}>
            {!isAuthenticated ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-[#BCEC30] text-black rounded-[46px] border-none flex items-center justify-center gap-[8px] w-[83px] h-[36px] p-[8px_16px] text-[18px] leading-[110%] lg:w-[103px] lg:h-[52px] lg:p-[16px_26px] hover:opacity-90 transition-opacity font-[Roboto] font-normal [font-variant-numeric:lining-nums_proportional-nums]"
              >
                Войти
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-[40px] h-[40px] rounded-full bg-[#BCEC30] flex items-center justify-center text-black font-[Roboto] font-medium text-[16px] hover:opacity-90 transition-opacity"
                >
                  {userEmail?.charAt(0).toUpperCase() || 'U'}
                </button>
                <span
                  className="font-[Roboto]  text-[24px] text-black-700 hidden sm:block cursor-pointer"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  {userEmail?.split('@')[0] || 'Пользователь'}
                </span>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ▼
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-[50px] w-[250px] bg-white rounded-[20px] shadow-xl border border-gray-100 p-[30px] z-50 flex flex-col items-center">
                    <div className="mb-8 text-center">
                      <p className="font-[Roboto]  text-gray-800 text-[18px]">
                        {userEmail?.split('@')[0] || 'Пользователь'}
                      </p>
                      <p className="text-sm text-gray-500 font-[Roboto] truncate max-w-[200px]">
                        {userEmail}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full items-center">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="w-full max-w-[180px] bg-[#BCEC30] text-black rounded-[46px] py-2 px-4 font-[Roboto]  text-[14px] text-center hover:opacity-90 transition-opacity"
                      >
                        Мой профиль
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full max-w-[180px] bg-white-100 text-black-700 border border-black rounded-[46px] py-2 px-4 font-[Roboto]  text-[14px] text-center hover:bg-gray-200 transition-colors"
                      >
                        Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="container mx-auto pb-[34px] lg:pb-[50px] px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-gray-900 m-0 font-[Roboto] font-medium tracking-normal text-[32px] leading-[110%] [font-variant-numeric:lining-nums_proportional-nums] lg:text-[60px] lg:leading-[100%]">
              Начните заниматься спортом и улучшите качество жизни
            </h1>
          </div>
          <div className="flex-shrink-0 hidden lg:block">
            <img src={flag} alt="Fitness" className="w-[288px] h-[120.17px] object-contain" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px] justify-between">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={{
                id: course._id,
                title: course.nameRU,
                image: courseImages[course.nameRU] || Yoga,
                duration: `${course.durationInDays} дней`,
                timePerDay: `${course.dailyDurationInMinutes.from}-${course.dailyDurationInMinutes.to} мин/день`,
                difficulty: course.difficulty,
              }}
            />
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 mt-[34px] mb-12 flex justify-end lg:justify-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-[#BCEC30] text-black rounded-[46px] border-none cursor-pointer flex items-center justify-center gap-[8px] w-[127px] h-[52px] p-[16px_26px] font-[Roboto] font-medium text-[16px] hover:opacity-90 transition-opacity"
        >
          Наверх ↑
        </button>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
