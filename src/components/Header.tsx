import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';

interface HeaderProps {
  onOpenAuth: () => void;
}

export default function Header({ onOpenAuth }: HeaderProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateEmail = () => {
    setUserEmail(localStorage.getItem('userEmail'));
  };

  useEffect(() => {
    updateEmail();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userEmail') {
        updateEmail();
      }
    };

    const handleAuthChange = () => {
      updateEmail();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    setIsProfileMenuOpen(false);
    window.location.href = '/';
  };

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <header className="bg-white relative">
      <div className="container mx-auto px-4 pt-[50px] pb-[40px] lg:pb-[60px] flex items-center justify-between">
        <div className="flex flex-col gap-[15px] shrink-0">
          <Link to="/">
            <img src={logo} alt="логотип" className="w-[220px] h-[35px] object-contain" />
          </Link>
          <p className="hidden lg:block text-gray-600 m-0 whitespace-nowrap font-normal text-[18px] leading-[110%] font-[Roboto]">
            Онлайн-тренировки для занятий дома
          </p>
        </div>

        <div className="relative" ref={menuRef}>
          {!isAuthenticated ? (
            <button
              onClick={onOpenAuth}
              className="bg-[#BCEC30] text-black rounded-[46px] border-none flex items-center justify-center gap-[8px] w-[83px] h-[36px] p-[8px_16px] text-[18px] leading-[110%] lg:w-[103px] lg:h-[52px] lg:p-[16px_26px] hover:opacity-90 transition-opacity font-[Roboto] font-normal [font-variant-numeric:lining-nums_proportional-nums]"
            >
              Войти
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-[40px] h-[40px] rounded-full bg-[#BCEC30] flex items-center justify-center text-black font-[Roboto] font-medium text-[16px] hover:opacity-90 transition-opacity"
              >
                {userEmail?.charAt(0).toUpperCase() || 'U'}
              </button>

              <span
                className="font-[Roboto] text-[24px] text-black-700 hidden sm:block cursor-pointer"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                {userEmail?.split('@')[0] || 'Пользователь'}
              </span>

              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="text-gray-400 hover:text-gray-600"
              >
                ▼
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-[50px] w-[250px] bg-white rounded-[20px] shadow-xl border border-gray-100 p-[30px] z-50 flex flex-col items-center">
                  <div className="mb-8 text-center">
                    <p className="font-[Roboto] text-gray-800 text-[18px]">
                      {userEmail?.split('@')[0] || 'Пользователь'}
                    </p>
                    <p className="text-sm text-gray-500 font-[Roboto] truncate max-w-[200px]">
                      {userEmail}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full items-center">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full max-w-[180px] bg-[#BCEC30] text-black rounded-[46px] py-2 px-4 font-[Roboto] text-[14px] text-center hover:opacity-90 transition-opacity"
                    >
                      Мой профиль
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full max-w-[180px] bg-white-100 text-black-700 border border-black rounded-[46px] py-2 px-4 font-[Roboto] text-[14px] text-center hover:bg-gray-200 transition-colors"
                    >
                      Выйти
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
