'use client';

import React from 'react';
import { GlobalSurveyBlockData } from '@/types/sanity-blocks';

// Boş interface yerine type kullandık
type GlobalSurveyProps = Omit<GlobalSurveyBlockData, '_key' | '_type'>;

const GlobalSurvey: React.FC<GlobalSurveyProps> = ({ surveyTitle, surveyDescription, options }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto my-8">
      <h2 className="text-3xl font-extrabold text-center mb-4">📊 {surveyTitle || 'Küresel Anket'}</h2>
      {surveyDescription && (
        <p className="text-blue-100 text-center mb-6 leading-relaxed">{surveyDescription}</p>
      )}

      {options && options.length > 0 ? (
        <div className="space-y-4">
          {options.map((option) => (
            <button
              key={option._key}
              type="button"
              className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 ease-in-out text-white font-semibold py-3 px-6 rounded-xl shadow-md flex items-center justify-center text-lg transform hover:scale-105"
            >
              {option.text}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-blue-200 text-center">Anket seçenekleri bulunamadı.</p>
      )}

      <p className="text-blue-200 text-sm text-center mt-6">
        (Bu bir örnek anket bileşenidir. Gerçek bir anket için backend entegrasyonu gereklidir.)
      </p>
    </div>
  );
};

export default GlobalSurvey;
