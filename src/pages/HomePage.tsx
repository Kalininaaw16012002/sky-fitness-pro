import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '@/components/CourseCard/CourseCard';
import AuthModal from '@/components/AuthModal';
import Header from '@/components/Header';
import api from '@/services/api';
import flag from '@/assets/images/flag.svg';
import Yoga from '@/assets/images/Yoga.jpg';
import Stretching from '@/assets/images/Stretching.jpg';
import Fitness from '@/assets/images/Fitness.jpg';
import step from '@/assets/images/step.jpg';
import bodyflex from '@/assets/images/bodyflex.jpg';
import type { ICourse } from '@/types';
import { usersApi } from '@/services/api';

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
  const [userCourseIds, setUserCourseIds] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    Promise.all([
      api.get('/courses'),
      token ? api.get('/users/me').catch(() => null) : Promise.resolve(null),
    ])
      .then(([coursesRes, userRes]) => {
        const desiredOrder = ['Йога', 'Стретчинг', 'Фитнес', 'Степ-аэробика', 'Бодифлекс'];
        const sorted = coursesRes.data.sort(
          (a: ICourse, b: ICourse) =>
            desiredOrder.indexOf(a.nameRU) - desiredOrder.indexOf(b.nameRU),
        );
        setCourses(sorted);

        if (userRes?.data?.user?.selectedCourses) {
          setUserCourseIds(userRes.data.user.selectedCourses);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Не удалось загрузить курсы:', err);
        setError('Ошибка загрузки курсов');
        setLoading(false);
      });
  }, []);

  const handleToggleCourse = (e: React.MouseEvent, courseId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    const isAdded = userCourseIds.includes(courseId);

    if (isAdded) {
      usersApi
        .removeCourse(courseId)
        .then(() => {
          setUserCourseIds((prev) => prev.filter((id) => id !== courseId));
          window.dispatchEvent(new Event('auth-change'));
          window.dispatchEvent(new Event('course-updated'));
        })
        .catch((err) => alert(err.response?.data?.message || 'Ошибка удаления'));
    } else {
      usersApi
        .addCourse(courseId)
        .then(() => {
          setUserCourseIds((prev) => [...prev, courseId]);
          window.dispatchEvent(new Event('auth-change'));
          window.dispatchEvent(new Event('course-updated'));
        })
        .catch((err: any) => alert(err.message || 'Ошибка добавления'));
    }
  };
  const handleAuthSuccess = (token: string, email: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    window.dispatchEvent(new Event('auth-change'));
    api
      .get('/users/me')
      .then((res) => setUserCourseIds(res.data.user?.selectedCourses || []))
      .catch(() => {});
  };

  if (loading) return <div className="text-center py-20">Загрузка...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="relative">
      <Header onOpenAuth={() => setIsAuthModalOpen(true)} />

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
            <Link
              to={`/courses/${course._id}`}
              key={course._id}
              className="flex justify-center relative"
            >
              <CourseCard
                course={{
                  id: course._id,
                  title: course.nameRU,
                  image: courseImages[course.nameRU] || Yoga,
                  duration: `${course.durationInDays} дней`,
                  timePerDay: `${course.dailyDurationInMinutes.from}-${course.dailyDurationInMinutes.to} мин/день`,
                  difficulty: course.difficulty,
                }}
                isAdded={userCourseIds.includes(course._id)}
                onToggleCourse={(e) => handleToggleCourse(e, course._id)}
              />
            </Link>
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
