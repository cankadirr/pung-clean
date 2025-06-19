import React, { useState } from 'react';
import { GlobalSurveyOption } from '../src/types/sanity'; // Yeni tipimizi import ettik

interface GlobalSurveyProps {
  surveyTitle?: string;
  surveyDescription?: string;
  options?: GlobalSurveyOption[]; // Yeni tipimizi kullanıyoruz
}

const GlobalSurvey: React.FC<GlobalSurveyProps> = ({ surveyTitle, surveyDescription, options }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (!options || !Array.isArray(options) || options.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-600">
        <p>Anket seçenekleri yüklenemedi veya mevcut değil.</p>
      </div>
    );
  }

  const handleOptionSelect = (optionKey: string) => {
    setSelectedOption(optionKey);
    console.log(`Seçilen opsiyon KEY: ${optionKey}`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 {surveyTitle || 'Küresel Anket'}</h2>
      <p className="text-lg text-gray-700">{surveyDescription || 'Anket hakkında kısa bir açıklama veya soru.'}</p>
      <div className="space-y-3">
        {options.map(option => (
          <button
            key={option._key}
            onClick={() => handleOptionSelect(option._key || '')} // _key kullanılmalı
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200
              ${selectedOption === option._key ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-blue-50 hover:border-blue-300'}`}
          >
            {option.text}
          </button>
        ))}
      </div>
      {selectedOption !== null && (
        <p className="text-sm text-gray-600 mt-4">Seçiminiz kaydedildi. Teşekkür ederiz!</p>
      )}
    </div>
  );
};

export default GlobalSurvey;
