"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DifficultyChoice = "facile" | "moyen" | "difficile";
type CategoryChoice = "all" | "general" | "qse" | "data" | "ssi";

type LoadedQuestion = {
  id: string;
  question: string;
  difficulty: string;
  category: string;
  points: number;
  answer: string;
};

function normalize(s: string) {
  return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function diffsFor(choice: DifficultyChoice): string[] {
  if (choice === "difficile") return ["easy","medium","hard","facile","moyen","difficile"];
  if (choice === "moyen") return ["easy","medium","facile","moyen"];
  return ["easy","facile"];
}

export default function QuizzGame() {
  // Pré-jeu
  const [category, setCategory] = useState<CategoryChoice>("all");
  const [diff, setDiff] = useState<DifficultyChoice>("facile");

  // État jeu
  const [started, setStarted] = useState(false);
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [current, setCurrent] = useState<LoadedQuestion | null>(null);
  const [input, setInput] = useState("");
  const [seen, setSeen] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Démarrage depuis la page (bouton "Jouer")
  useEffect(() => {
    function onStartEvent() {
      handleStart();
    }
    window.addEventListener("quizz:start", onStartEvent as any);
    return () => window.removeEventListener("quizz:start", onStartEvent as any);
  }, []);

  // Anti-triche : changement d'onglet
  useEffect(() => {
    function onVis() {
      if (document.hidden) setLocked(true);
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Timer par question
  useEffect(() => {
    if (!started || !current) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    setTimeLeft(30);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timerRef.current!);
          setLives((v) => v - 1);
          setInput("");
          nextQuestion();
          return 30;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, current?.id]);

  // Fin de partie (plus de vies) → on soumet puis on sort du mode overlay
  useEffect(() => {
    if (started && lives <= 0) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      (async () => {
        await submitScore();
        setStarted(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lives, started]);

  const canPlay = useMemo(() => started && lives > 0, [started, lives]);

  function reset() {
    setLives(5); setScore(0); setTimeLeft(30);
    setCurrent(null); setSeen([]); setInput(""); setLocked(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  }

  async function handleStart() {
    reset();
    setStarted(true);
    await nextQuestion();
  }

  async function handleQuit() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    // ✅ on enregistre même si tu quittes avant d’être à 0 vie
    await submitScore();
    setStarted(false);
    // reset l’état local
    setLives(5); setScore(0); setTimeLeft(30);
    setCurrent(null); setSeen([]); setInput(""); setLocked(false);
  }

  async function nextQuestion() {
    try {
      const qs = new URLSearchParams();
      qs.set("category", category);
      qs.set("diffs", diffsFor(diff).join(","));
      if (seen.length > 0) qs.set("exclude", seen.join(","));
      const res = await fetch(`/api/game/quizz/next?${qs.toString()}`, { cache: "no-store" });
      if (!res.ok) { setCurrent(null); return; }
      const q = (await res.json()) as LoadedQuestion;
      setCurrent(q);
      setSeen((s) => [...s, q.id]);
    } catch { setCurrent(null); }
  }

  async function submitScore() {
    try {
      await fetch("/api/game/quizz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
      });
      // notif pour rafraîchir le meilleur score côté page
      window.dispatchEvent(new CustomEvent("quizz:score-submitted", { detail: { score } }));
    } catch {}
  }

  async function onAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!current || !canPlay || locked) return;
    const good = normalize(input) === normalize(current.answer);
    if (good) {
      setScore((s) => s + (current.points ?? 0));
      setInput("");
      await nextQuestion();
    }
  }

  // Fin de partie → submit score
  useEffect(() => {
    if (started && lives <= 0) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      submitScore().finally(() => setStarted(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lives, started]);

  /* ---------- Rendu ---------- */

  // Overlay plein écran quand started = true
  if (started) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto mt-6 w-full max-w-3xl rounded-xl border bg-card p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Catégorie : <b>{category}</b> · Difficulté : <b>{diff}</b>
            </div>
            <button onClick={handleQuit} className="rounded-md border px-3 py-1 text-sm hover:bg-muted">
              Quitter
            </button>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-md border px-3 py-1">Vies : {Math.max(lives, 0)}</span>
            <span className="rounded-md border px-3 py-1">Score : {score}</span>
            <span className="rounded-md border px-3 py-1">Temps : {timeLeft}s</span>
          </div>

          {locked && (
            <div className="mb-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              <b>Tricheur !</b> On a vu que tu as changé d’onglet.
              <button className="ml-3 rounded border px-2 py-1 text-xs hover:bg-red-100" onClick={() => setLocked(false)}>
                Je comprends
              </button>
            </div>
          )}

          {lives <= 0 ? (
            <div className="space-y-2 text-center py-10">
              <h3 className="text-xl font-semibold">Partie terminée</h3>
              <p className="text-sm text-muted-foreground">Ton score a été enregistré.</p>
              <button
                onClick={handleStart}
                className="mt-2 rounded-md bg-amber-600 px-3 py-2 text-white hover:bg-amber-700"
              >
                Rejouer
              </button>
            </div>
          ) : current ? (
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">
                  {current.category} · {current.difficulty}
                </div>
                <div className="mt-1 text-lg font-medium">{current.question}</div>
              </div>

              <form onSubmit={onAnswer} className="flex items-center gap-2">
                <input
                  autoFocus disabled={locked}
                  value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Ta réponse…"
                  className="flex-1 rounded-md border bg-background px-3 py-2"
                />
                <button type="submit" disabled={locked} className="rounded-md border px-3 py-2 hover:bg-muted">
                  Valider
                </button>
              </form>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Chargement de la question…</div>
          )}
        </div>
      </div>
    );
  }

  // Préparation (affiché dans la page tant que la partie n'a pas démarré)
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Catégorie</label>
          <select className="rounded-md border bg-background px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value as CategoryChoice)}>
            <option value="all">all (toutes)</option>
            <option value="general">general</option>
            <option value="qse">qse</option>
            <option value="data">data</option>
            <option value="ssi">ssi</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Difficulté</label>
          <select className="rounded-md border bg-background px-3 py-2" value={diff} onChange={(e) => setDiff(e.target.value as DifficultyChoice)}>
            <option value="facile">facile</option>
            <option value="moyen">moyen</option>
            <option value="difficile">difficile</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleStart}
            className="w-full rounded-md bg-amber-600 px-3 py-2 font-medium text-white hover:bg-amber-700"
          >
            Jouer
          </button>
        </div>
      </div>
    </div>
  );
}
