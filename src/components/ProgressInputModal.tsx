import { useState, useEffect } from 'react';

interface Exercise {
  _id: string;
  name: string;
  quantity: number;
}

interface ProgressInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: number[]) => void;
  exercises: Exercise[];
  initialData: number[];
}

export default function ProgressInputModal({
  isOpen,
  onClose,
  onSave,
  exercises,
  initialData,
}: ProgressInputModalProps) {
  const [values, setValues] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen && exercises.length > 0) {
      const initData = initialData.length === exercises.length 
        ? [...initialData] 
        : new Array(exercises.length).fill(0);
      setValues(initData);
    }
  }, [isOpen, exercises, initialData]);

  if (!isOpen) return null;

  const handleChange = (index: number, val: string) => {
    const num = parseInt(val) || 0;
    const newValues = [...values];
    newValues[index] = num;
    setValues(newValues);
  };

  const handleSaveClick = () => {
    onSave(values);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[30px] shadow-xl w-full max-w-[460px] p-6 lg:p-[40px] flex flex-col relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl leading-none"
        >
          &times;
        </button>

        <h3 className="font-[Roboto] font-normal text-[24px] lg:text-[32px] leading-[110%] text-gray-900 text-center mb-8">
          Мой прогресс
        </h3>

        <div className="flex flex-col gap-6 mb-8">
          {exercises.map((ex, index) => {
            const cleanName = ex.name.split(' (')[0];
            return (
              <div key={ex._id} className="flex flex-col gap-2">
                <label className="font-[Roboto] font-normal text-[18px] text-gray-700">
                  Сколько раз вы сделали <span className="font-medium">{cleanName.toLowerCase()}</span>?
                </label>
                <input
                  type="number"
                  min="0"
                  max={ex.quantity * 2} 
                  value={values[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-full px-4 py-3 rounded-[12px] border border-gray-200 font-[Roboto] text-[18px] focus:border-[#BCEC30] focus:outline-none focus:ring-2 focus:ring-[#BCEC30]/20"
                  placeholder="0"
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSaveClick}
          className="w-full h-[52px] rounded-[46px] bg-[#BCEC30] text-black font-[Roboto] font-normal text-[18px] leading-[110%] hover:opacity-90 transition-opacity flex items-center justify-center"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}