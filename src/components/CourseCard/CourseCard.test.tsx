import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest'; 
import CourseCard from './CourseCard';

const mockCourse = {
  id: '1',
  title: 'Йога для начинающих',
  image: 'yoga.jpg',
  duration: '20 дней',
  timePerDay: '20-40 мин/день',
  difficulty: 'легкий',
};

describe('CourseCard Component', () => {
  it('должен корректно отображать название курса', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('Йога для начинающих')).toBeInTheDocument();
  });

  it('должен отображать длительность и сложность', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('20 дней')).toBeInTheDocument();
    expect(screen.getByText('легкий')).toBeInTheDocument();
  });

  it('должен вызывать onClick при клике на карточку', () => {
    const handleClick = vi.fn();
    render(<CourseCard course={mockCourse} onClick={handleClick} />);
    screen.getByText('Йога для начинающих').parentElement?.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});