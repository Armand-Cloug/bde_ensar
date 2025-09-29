'use client';

import SuggestQuestionDialog from './SuggestQuestionDialog';

export default function QuizzActions() {
  function start() {
    // le composant QuizzGame écoute cet event
    window.dispatchEvent(new Event('quizz:start'));
  }

  return (
    <div className="flex flex-col gap-2">
      <SuggestQuestionDialog />
      <button
        onClick={start}
        className="rounded-md bg-amber-600 px-3 py-2 text-white hover:bg-amber-700"
      >
        Jouer
      </button>
    </div>
  );
}
