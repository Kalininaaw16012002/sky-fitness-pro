import { useState } from 'react';
import { authApi } from '@/services/api';
import logo from '@/assets/images/logo.svg';

const btnText =
  'font-[Roboto] font-normal text-[18px] leading-[110%] tracking-normal [font-variant-numeric:lining-nums_proportional-nums]';
const inputBase =
  'w-full px-4 py-3 rounded-xl border outline-none transition-all font-[Roboto] text-gray-700 placeholder-gray-400';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (token: string, email: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Заполните все поля');
      setLoading(false);
      return;
    }

    if (!isLoginMode && password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      if (isLoginMode) {
        const data = await authApi.login(email, password);
        onAuthSuccess(data.token, email);
        onClose();
      } else {
        await authApi.register(email, password);
        setIsLoginMode(true);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `${inputBase} ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#BCEC30] focus:ring-2 focus:ring-[#BCEC30]/20'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[30px] shadow-xl p-8 w-full max-w-[360px] relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>
        <img src={logo} alt="логотип" className="w-[180px] h-[28px] object-contain mb-8" />

        <form onSubmit={handleSubmit} className="w-full" noValidate>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            className={`${inputClass(!!error)} mb-[10px]`}
            placeholder={isLoginMode ? 'Логин' : 'Эл. почта'}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            className={`${inputClass(!!error)} mb-[10px]`}
            placeholder="Пароль"
          />
          {!isLoginMode && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              className={`${inputClass(!!error)} mb-[10px]`}
              placeholder="Повторите пароль"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-[46px] border-none flex items-center justify-center h-[52px] px-[26px] mt-[34px] transition-all duration-200 ${btnText} ${loading ? 'bg-[#F7F7F7] text-[#999999]' : 'bg-[#BCEC30] text-black hover:bg-[#C6FF00] active:bg-black active:text-white'}`}
          >
            {loading ? 'Загрузка...' : isLoginMode ? 'Войти' : 'Зарегистрироваться'}
          </button>

          {error && (
            <p className="text-red-500 text-[14px] text-center font-[Roboto] mt-2">{error}</p>
          )}
        </form>

        <div className="mt-4 w-full">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError(null);
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            className={`w-full rounded-[46px] border border-black flex items-center justify-center h-[52px] px-[26px] bg-white text-black hover:bg-[#F7F7F7] active:bg-[#E9ECED] transition-colors duration-200 ${btnText}`}
          >
            {isLoginMode ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}
