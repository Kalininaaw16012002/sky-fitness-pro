import { describe, it, expect } from 'vitest';
import { calculateProgress } from './calculateProgress';

describe('calculateProgress Utility', () => {
  it('должен возвращать 0, если целевое значение 0', () => {
    expect(calculateProgress(10, 0)).toBe(0);
  });

  it('должен возвращать 50, если выполнено половина', () => {
    expect(calculateProgress(5, 10)).toBe(50);
  });

  it('должен возвращать 100, если выполнено больше нормы', () => {
    expect(calculateProgress(15, 10)).toBe(100);
  });

  it('должен возвращать 0, если ничего не сделано', () => {
    expect(calculateProgress(0, 10)).toBe(0);
  });
});