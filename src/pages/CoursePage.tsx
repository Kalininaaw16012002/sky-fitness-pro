import { useParams } from 'react-router-dom';

export default function CoursePage() {
  const { id } = useParams(); 

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold">Страница курса</h1>
      <p>ID курса: {id}</p>
      <p>Здесь будет описание и видео...</p>
    </div>
  );
}