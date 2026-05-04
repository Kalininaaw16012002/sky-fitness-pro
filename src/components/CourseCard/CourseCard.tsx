import Calendar from '@/assets/images/Calendar.svg';
import Time from '@/assets/images/Time.svg';
import mingcute from '@/assets/images/mingcute.svg';
import plus from '@/assets/images/plus.png';

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    image: string;
    duration: string;
    timePerDay: string;
    difficulty: string;
  };
}

const badgeTextStyle = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '110%',
  letterSpacing: '0px',
  verticalAlign: 'bottom',
  fontVariantNumeric: 'lining-nums proportional-nums',
  color: '#202020',
};

export default function CourseCard({ course }: CourseCardProps) {
  const handleAddCourse = () => {};
  return (
    <div
      className="bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-[501px]"
      style={{ borderRadius: '30px' }}
    >
      <div className="w-full overflow-hidden rounded-[30px] relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
          style={{ height: '316px' }}
        />

        <button
          onClick={handleAddCourse}
          className="absolute top-[22px] right-[22px] cursor-pointer flex items-center justify-center p-2"
        >
          <img src={plus} alt="Добавить" className="w-[24px] h-[24px] object-contain" />
        </button>
      </div>

      <div
        className="flex flex-col flex-grow px-[30px]"
        style={{ gap: '20px', paddingTop: '24px', paddingBottom: '24px' }}
      >
        <h3
          className="text-gray-900 m-0"
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            fontSize: '32px',
            lineHeight: '110%',
          }}
        >
          {course.title}
        </h3>

        <div className="flex flex-row flex-wrap" style={{ width: '300px', gap: '6px' }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: '103px',
              height: '38px',
              borderRadius: '50px',
              padding: '10px',
              backgroundColor: '#F7F7F7',
              gap: '6px',
            }}
          >
            <img src={Calendar} alt="календарь" className="w-4 h-4" />
            <span className="text-gray-600 whitespace-nowrap" style={badgeTextStyle}>
              {course.duration}
            </span>
          </div>

          <div
            className="flex items-center justify-center"
            style={{
              width: '163px',
              height: '38px',
              borderRadius: '50px',
              backgroundColor: '#F7F7F7',
              gap: '6px',
            }}
          >
            <img src={Time} alt="время" className="w-4 h-4" />
            <span className="text-gray-600 whitespace-nowrap" style={badgeTextStyle}>
              {course.timePerDay}
            </span>
          </div>

          <div
            className="flex items-center justify-center"
            style={{
              width: '129px',
              height: '38px',
              borderRadius: '50px',
              backgroundColor: '#F7F7F7',
              gap: '6px',
            }}
          >
            <img src={mingcute} alt="сложность" className="w-4 h-4" />
            <span className="text-gray-600 whitespace-nowrap" style={badgeTextStyle}>
              {course.difficulty}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
