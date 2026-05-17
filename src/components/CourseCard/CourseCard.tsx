import Calendar from '@/assets/images/Calendar.svg';
import Time from '@/assets/images/Time.svg';
import mingcute from '@/assets/images/mingcute.svg';
import plus from '@/assets/images/plus.png';
import minus from '@/assets/images/minus.png';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    image: string;
    duration: string;
    timePerDay: string;
    difficulty: string;
  };
  onClick?: () => void;
  isAdded?: boolean;
  onToggleCourse?: (e: React.MouseEvent, id: string) => void;
}

export default function CourseCard({
  course,
  onClick,
  isAdded = false,
  onToggleCourse,
}: CourseCardProps) {
  const handleToggleCourse = (e: React.MouseEvent) => {
    if (onToggleCourse) {
      onToggleCourse(e, course.id);
    }
  };

  const badgeTextClass =
    'text-[#202020] font-[Roboto] font-normal text-[16px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums] whitespace-nowrap';

  return (
    <div
      onClick={onClick}
      className="bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-[501px] rounded-[30px]"
    >
      <div className="w-full overflow-hidden rounded-[30px] relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-[316px] object-cover hover:scale-105 transition-transform duration-300"
        />

        <button
          onClick={handleToggleCourse}
          className="absolute top-[22px] right-[22px] cursor-pointer flex items-center justify-center p-2"
          title={isAdded ? 'Удалить курс' : 'Добавить курс'}
        >
          <img
            src={isAdded ? minus : plus}
            alt={isAdded ? 'Удалить' : 'Добавить'}
            className="w-[32px] h-[32px] object-contain"
          />
        </button>
      </div>

      <div className="flex flex-col flex-grow px-[30px] gap-[20px] pt-[24px] pb-[24px]">
        <h3 className=" text-gray-900 m-0 font-[Roboto] font-medium tracking-normal  text-[24px] leading-[110%] [font-variant-numeric:lining-nums_proportional-nums]  lg:text-[32px]">
          {course.title}
        </h3>

        <div className="flex flex-row flex-wrap w-[300px] gap-[6px]">
          <div className=" flex items-center justify-center  w-[103px] h-[38px] rounded-[50px] p-[10px]    bg-[#F7F7F7] gap-[6px] ">
            <img src={Calendar} alt="календарь" className="w-4 h-4" />
            <span className={badgeTextClass}>{course.duration}</span>
          </div>
          <div className=" flex items-center justify-center     w-[163px] h-[38px] rounded-[50px]     bg-[#F7F7F7] gap-[6px] ">
            <img src={Time} alt="время" className="w-4 h-4" />
            <span className={badgeTextClass}>{course.timePerDay}</span>
          </div>

          <div className=" flex items-center justify-center    w-[129px] h-[38px] rounded-[50px]      bg-[#F7F7F7] gap-[6px]     ">
            <img src={mingcute} alt="сложность" className="w-4 h-4" />
            <span className={badgeTextClass}>{course.difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
