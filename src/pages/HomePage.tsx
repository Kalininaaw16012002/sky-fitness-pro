import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '@/components/CourseCard/CourseCard';
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

  useEffect(() => {
    api
      .get('/courses')
      .then((response) => {
        const desiredOrder = ['Йога', 'Стретчинг', 'Фитнес', 'Степ-аэробика', 'Бодифлекс'];
        const sortedCourses = response.data.sort((a: ICourse, b: ICourse) => {
          return desiredOrder.indexOf(a.nameRU) - desiredOrder.indexOf(b.nameRU);
        });

        setCourses(sortedCourses);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Не удалось загрузить курсы:', err);
        setError('Ошибка загрузки курсов');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-20">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div>
      <header className="bg-white relative">
        <div className="container mx-auto px-4 pt-[50px] pb-[40px] lg:pb-[60px] flex items-center justify-between">
          <div className="flex flex-col gap-[15px] shrink-0">
            <Link to="/">
              <img src={logo} alt="логотип" className="w-[220px] h-[35px] object-contain" />
            </Link>
            <p className="hidden lg:block text-gray-600 m-0 whitespace-nowrap font-normal text-[18px] leading-[110%]">
              Онлайн-тренировки для занятий дома
            </p>
          </div>
          <Link to="/login">
            <button className=" bg-[#BCEC30] text-black rounded-[46px] border-none flex items-center justify-center gap-[8px] w-[83px] h-[36px] p-[8px_16px] text-[18px] leading-[110%] lg:w-[103px] lg:h-[52px] lg:p-[16px_26px]  hover:opacity-90 transition-opacity font-[Roboto] font-normal [font-variant-numeric:lining-nums_proportional-nums]">
              Войти
            </button>
          </Link>
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
            <img
              src={flag}
              alt="Fitness illustration"
              className="w-[288px] h-[120.17px] object-contain"
            />
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
          className="bg-[#BCEC30] text-black rounded-[46px] border-none cursor-pointer flex items-center justify-center gap-[8px] w-[127px] h-[52px] p-[16px_26px] font-medium text-[16px] hover:opacity-90 transition-opacity"
        >
          Наверх ↑
        </button>
      </div>
    </div>
  );
}
