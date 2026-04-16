import type { Question } from '@/libs/forms/store/types';

interface SectionQuestionProps {
  question: Question;
}

export function SectionQuestion({ question }: SectionQuestionProps) {
  return (
    <div className='py-1'>
      <div className='border-b-2 border-[#0B1AA0]/20' />
      {question.description && (
        <p className='mt-2 text-sm text-slate-500'>{question.description}</p>
      )}
    </div>
  );
}
