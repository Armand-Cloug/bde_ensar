'use client';

import * as React from 'react';

export default function BestScore({ initial }: { initial: number }) {
  const [score, setScore] = React.useState<number>(initial);

  async function refresh() {
    try {
      const res = await fetch('/api/game/quizz/best', { cache: 'no-store' });
      if (res.ok) {
        const j = await res.json();
        setScore(Number(j?.score ?? 0));
      }
    } catch {}
  }

  React.useEffect(() => {
    function onSubmitted() { refresh(); }
    window.addEventListener('quizz:score-submitted', onSubmitted as any);
    return () => window.removeEventListener('quizz:score-submitted', onSubmitted as any);
  }, []);

  return <div className="text-3xl font-bold">{score}</div>;
}
    