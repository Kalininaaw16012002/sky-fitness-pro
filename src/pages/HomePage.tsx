import CourseCard from '@/components/CourseCard/CourseCard';
import logo from '@/assets/images/logo.svg';
import flag from '@/assets/images/flag.svg';
import Yoga from '@/assets/images/Yoga.jpg';
import Stretching from '@/assets/images/Stretching.jpg';
import Fitness from '@/assets/images/Fitness.jpg';
import step from '@/assets/images/step.jpg';
import bodyflex from '@/assets/images/bodyflex.jpg';
import { Link } from 'react-router-dom';

// Моковые данные
const mockCourses = [
  {
    id: 1,
    title: 'Йога',
    image: Yoga,
    duration: '25 дней',
    timePerDay: '20-50 мин/день',
    difficulty: 'Сложность',
  },
  {
    id: 2,
    title: 'Стретчинг',
    image: Stretching,
    duration: '20 дней',
    timePerDay: '15-30 мин/день',
    difficulty: 'Сложность',
  },
  {
    id: 3,
    title: 'Фитнес',
    image: Fitness,
    duration: '30 дней',
    timePerDay: '30-60 мин/день',
    difficulty: 'Сложность',
  },
  {
    id: 4,
    title: 'Степ-аэробика',
    image: step,
    duration: '21 день',
    timePerDay: '25-45 мин/день',
    difficulty: 'Сложность',
  },
  {
    id: 5,
    title: 'Бодифлекс',
    image: bodyflex,
    duration: '15 дней',
    timePerDay: '15-20 мин/день',
    difficulty: 'Сложность',
  },
];

export default function HomePage() {
  return (
    <div>
      <header className="bg-white relative">
        <div className="container mx-auto px-4 pt-[50px] pb-[60px] flex items-center justify-between">
          <div className="flex flex-col gap-[15px] shrink-0">
            <Link to="/">
              <img src={logo} alt="логотип" className="w-[220px] h-[35px] object-contain" />
            </Link>
            <p
              className="text-gray-600 m-0 whitespace-nowrap"
              style={{
                fontWeight: 400,
                fontSize: '18px',
                lineHeight: '110%',
              }}
            >
              Онлайн-тренировки для занятий дома
            </p>
          </div>
          <button
            className="text-white font-medium transition-colors hover:opacity-90"
            style={{
              width: '103px',
              height: '52px',
              borderRadius: '46px',
              padding: '16px 26px',
              backgroundColor: '#BCEC30',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            Войти
          </button>
        </div>
      </header>

      <section className="container mx-auto pb-[50px] px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h1
              className="text-gray-900 m-0"
              style={{
                fontWeight: 500,
                fontSize: '60px',
                lineHeight: '100%',
              }}
            >
              Начните заниматься спортом и улучшите качество жизни
            </h1>
          </div>

          <div className="flex-shrink-0">
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
          {mockCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <div className="text-center mt-[34px] mb-12">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center justify-center gap-[8px]"
          style={{
            width: '127px',
            height: '52px',
            borderRadius: '46px',
            padding: '16px 26px',
            backgroundColor: '#BCEC30',
            color: '#000000',
            fontWeight: 500,
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Наверх ↑
        </button>
      </div>
    </div>
  );
}
