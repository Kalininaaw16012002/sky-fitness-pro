import { describe, it, expect } from 'vitest';
import { usersApi, coursesApi } from './api';

describe('API Services Structure', () => {
  it('usersApi должен иметь метод getMe', () => {
    expect(usersApi.getMe).toBeDefined();
    expect(typeof usersApi.getMe).toBe('function');
  });

  it('coursesApi должен иметь метод getAll', () => {
    expect(coursesApi.getAll).toBeDefined();
    expect(typeof coursesApi.getAll).toBe('function');
  });
});