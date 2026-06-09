import { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
    useEffect(() => {
      if (isOpen) {
        const timer = setTimeout(() => {
          onClose();
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[30px] shadow-xl w-full max-w-[360px] p-8 flex flex-col items-center justify-center text-center animate-fade-in">
        <h3 className="font-[Roboto] font-medium text-[40px] leading-[110%] text-gray-900 mb-2">
          Ваш прогресс
        </h3>
        <p className="font-[Roboto] font-medium text-[40px] leading-[110%] text-gray-900 mb-[32px]">
          засчитан!
        </p>

        <div className="w-[58px] h-[58px] rounded-full bg-[#BCEC30] flex items-center justify-center mb-6">
          <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
            <path
              d="M5 15L15 25L35 5"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
