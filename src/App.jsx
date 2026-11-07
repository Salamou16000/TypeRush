import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  RotateCcw, Zap, Keyboard, Trophy, Clock3, Target, Github, Linkedin, Info,
  History, Medal, CheckCircle2, AlertCircle, Sun, Moon, Volume2,
  VolumeX, BarChart3, CalendarDays, Keyboard as KeyboardIcon
} from "lucide-react";

const TEXT_LIBRARY = {"en": {"Beginner": ["The sun is warm and the sky is blue. I like to read a good book and drink a cup of tea.", "A small step every day can lead to a big change. Keep going and enjoy the journey.", "My name is Alex. I live in a quiet town near the sea, where the mornings are calm.", "Practice makes progress. Take your time, stay relaxed, and focus on each word.", "The cat is sleeping on the soft chair while rain falls gently outside the window.", "Today is a good day to learn something new and try a different way of doing things.", "Fresh bread, ripe apples, and a glass of water make a simple and tasty breakfast.", "I walk to the park after work to get some fresh air and clear my mind.", "A kind word can make someone smile. Be patient, helpful, and respectful to others.", "Please close the door, turn off the light, and leave the keys on the table."], "Intermediate": ["Building a useful habit takes patience. Start with a realistic goal, repeat it often, and notice the progress you make along the way.", "Modern technology helps people share ideas, solve problems, and work together across different cities and countries.", "A successful team does not avoid mistakes. It learns from them, communicates clearly, and keeps improving its methods.", "When you learn a new skill, focus on understanding the basics before trying to move faster or take on harder tasks.", "The best way to prepare for a busy week is to organize your priorities, make a simple plan, and leave room for surprises.", "Reading every day improves vocabulary and concentration. Even fifteen minutes can make a difference over time.", "Good design is not only about appearance. It should make information clear and help people complete their tasks with ease.", "Before starting a project, define the problem, identify the people it will help, and decide how you will measure success.", "Working remotely requires trust and clear communication. Short updates can keep everyone informed without creating unnecessary meetings.", "Learning from different cultures can change the way we see the world and help us understand experiences beyond our own."], "Advanced": ["Consistency is often more valuable than occasional bursts of motivation; meaningful progress emerges when deliberate practice becomes part of an ordinary routine.", "A thoughtful solution begins with careful observation, a precise understanding of the constraints, and the willingness to question the first assumption.", "Digital tools can increase productivity, but their value depends on how intelligently they are integrated into existing workflows and human needs.", "Clear communication is a practical discipline: choose accurate words, organize complex ideas, and adapt the level of detail to the audience.", "Resilient systems are designed with failure in mind, making it possible to detect unexpected behavior, recover safely, and learn from incidents.", "Creative thinking rarely follows a straight line; experimentation, reflection, and revision gradually transform an uncertain idea into a useful result.", "A reliable analysis distinguishes measurable evidence from personal interpretation and explains the limitations that may affect its conclusions.", "The ability to concentrate deeply is increasingly important in environments filled with notifications, competing priorities, and constant interruptions.", "Sustainable innovation balances technical progress with long-term consequences for communities, resources, accessibility, and the environment.", "Mastery is not the absence of mistakes, but the ability to recognize them quickly, understand their causes, and respond with deliberate improvement."]}, "fr": {"Beginner": ["Le soleil brille et le ciel est bleu. J'aime lire un livre et boire une tasse de thé.", "Un petit pas chaque jour peut apporter un grand changement. Continue et profite du chemin.", "Je m'appelle Alex. J'habite dans une ville calme près de la mer, où les matins sont paisibles.", "La pratique aide à progresser. Prends ton temps, reste calme et concentre-toi sur chaque mot.", "Le chat dort sur le fauteuil pendant que la pluie tombe doucement dehors.", "Aujourd'hui est une bonne journée pour apprendre quelque chose de nouveau et essayer autrement.", "Du pain frais, des pommes mûres et un verre d'eau font un petit déjeuner simple et délicieux.", "Après le travail, je marche dans le parc pour respirer et me changer les idées.", "Un mot gentil peut faire sourire quelqu'un. Soyons patients et respectueux avec les autres.", "Ferme la porte, éteins la lumière et laisse les clés sur la table, s'il te plaît."], "Intermediate": ["Créer une bonne habitude demande de la patience. Fixe un objectif réaliste, répète tes efforts et observe tes progrès.", "Les technologies modernes permettent de partager des idées, de résoudre des problèmes et de collaborer à distance.", "Une équipe efficace ne cherche pas à éviter toutes les erreurs. Elle apprend, communique et améliore ses méthodes.", "Quand tu apprends une nouvelle compétence, comprends d'abord les bases avant d'accélérer ou de choisir des exercices difficiles.", "Pour préparer une semaine chargée, organise tes priorités, établis un plan simple et garde du temps pour les imprévus.", "Lire chaque jour enrichit le vocabulaire et améliore la concentration. Même quinze minutes peuvent faire une différence.", "Un bon design ne concerne pas seulement l'apparence. Il rend les informations claires et facilite les actions de chacun.", "Avant de commencer un projet, définis le problème, identifie les personnes concernées et choisis des critères de réussite.", "Le travail à distance repose sur la confiance et une communication claire. De courts messages peuvent éviter des réunions inutiles.", "Découvrir d'autres cultures peut transformer notre regard et nous aider à comprendre des expériences différentes des nôtres."], "Advanced": ["La régularité compte souvent davantage que de rares élans de motivation ; les progrès durables naissent d'une pratique réfléchie et quotidienne.", "Une solution pertinente commence par une observation attentive, une compréhension précise des contraintes et la remise en question des premières hypothèses.", "Les outils numériques peuvent améliorer la productivité, mais leur efficacité dépend de leur intégration aux méthodes de travail et aux besoins humains.", "Communiquer clairement est une véritable discipline : choisir des mots justes, structurer les idées complexes et adapter les détails à son public.", "Les systèmes fiables anticipent les défaillances afin de détecter les comportements inattendus, de rétablir le service et de tirer des enseignements des incidents.", "La créativité ne suit presque jamais une ligne droite ; les essais, la réflexion et les ajustements transforment progressivement une idée incertaine.", "Une analyse rigoureuse distingue les faits vérifiables des interprétations personnelles et présente les limites qui peuvent influencer ses conclusions.", "La capacité à se concentrer profondément devient essentielle dans un environnement rempli de notifications, de priorités concurrentes et d'interruptions.", "L'innovation durable associe le progrès technique à ses conséquences à long terme sur les communautés, les ressources et l'environnement.", "La maîtrise ne signifie pas ne jamais se tromper, mais savoir repérer ses erreurs, comprendre leurs causes et progresser avec méthode."]}};

const TIME_OPTIONS = [15, 30, 60];
const HISTORY_KEY = "typerush-history";
const BEST_KEY = "typerush-best";
const SETTINGS_KEY = "typerush-settings";
const DAILY_KEY = "typerush-daily-completed";

function safeRead(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value == null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}
function readHistory() {
  const value = safeRead(HISTORY_KEY, []);
  return Array.isArray(value) ? value : [];
}
function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY) || 0); } catch { return 0; }
}
function getRating(wpm, accuracy) {
  if (accuracy < 85) return "Keep practicing";
  if (wpm >= 80) return "Outstanding";
  if (wpm >= 60) return "Excellent";
  if (wpm >= 40) return "Great job";
  if (wpm >= 25) return "Good start";
  return "Keep practicing";
}
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString([], {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });
}
function localDayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function dailyPassageIndex(count) {
  const date = new Date();
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date - start) / 86400000);
  return count ? day % count : 0;
}
function playTone(kind = "finish") {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(kind === "best" ? 880 : 620, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(kind === "best" ? 1175 : 420, context.currentTime + 0.16);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.09, context.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.2);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.21);
    oscillator.onended = () => context.close();
  } catch {}
}

export default function App() {
  const savedSettings = safeRead(SETTINGS_KEY, {});
  const [duration, setDuration] = useState(30);
  const [passageIndex, setPassageIndex] = useState(0);
  const [language, setLanguage] = useState("en");
  const [level, setLevel] = useState("Beginner");
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState("ready");
  const [best, setBest] = useState(readBest);
  const [history, setHistory] = useState(readHistory);
  const [result, setResult] = useState(null);
  const [theme, setTheme] = useState(savedSettings.theme === "light" ? "light" : "dark");
  const [soundOn, setSoundOn] = useState(savedSettings.soundOn !== false);
  const [dailyCompleted, setDailyCompleted] = useState(safeRead(DAILY_KEY, "") === localDayKey());
  const [dailyMode, setDailyMode] = useState(false);

  const inputRef = useRef(null);
  const startedAt = useRef(null);
  const typedRef = useRef("");
  const savedResultId = useRef(null);

  const availablePassages = TEXT_LIBRARY[language][level];
  const passage = availablePassages[passageIndex % availablePassages.length];
  const correctChars = useMemo(
    () => [...typed].filter((char, index) => char === passage[index]).length,
    [typed, passage]
  );
  const errors = typed.length - correctChars;
  const accuracy = typed.length ? Math.round((correctChars / typed.length) * 100) : 100;
  const wpm = elapsedTime > 0 ? Math.round((correctChars / 5) / (elapsedTime / 60)) : 0;
  const progress = status === "running"
  ? Math.min(100, (elapsedTime / duration) * 100)
  : status === "finished" && result?.reason === "timeout"
    ? 100
    : 0;

  useEffect(() => {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme, soundOn })); } catch {}
  }, [theme, soundOn]);

  const finishTest = useCallback((finalTyped, reason) => {
    if (status === "finished") return;
    const now = Date.now();
    const elapsed = Math.max(1, Math.floor((now - (startedAt.current || now)) / 1000));
    const correct = [...finalTyped].filter((char, index) => char === passage[index]).length;
    const mistakes = finalTyped.length - correct;
    const finalAccuracy = finalTyped.length ? Math.round((correct / finalTyped.length) * 100) : 100;
    const finalWpm = Math.round((correct / 5) / (elapsed / 60));
    setElapsedTime(elapsed);
    if (reason === "timeout") setTimeLeft(0);
    setResult({
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      wpm: finalWpm, accuracy: finalAccuracy, errors: mistakes,
      characters: finalTyped.length, duration, elapsed,
      rating: getRating(finalWpm, finalAccuracy), completedAt: now, reason,
      daily: dailyMode, language, level
    });
    setStatus("finished");
  }, [duration, passage, status, dailyMode, language, level]);

  useEffect(() => {
    if (status !== "running") return undefined;
    const timer = window.setInterval(() => {
    const elapsed = (Date.now() - startedAt.current) / 1000;
    const remaining = Math.max(0, duration - elapsed);

   setElapsedTime(elapsed);
   setTimeLeft(Math.ceil(remaining));

   if (remaining <= 0) {
   finishTest(typedRef.current, "timeout");
  }
    }, 100);
    return () => window.clearInterval(timer);
  }, [status, duration, finishTest]);

  useEffect(() => {
    if (status !== "finished" || !result || savedResultId.current === result.id) return;
    savedResultId.current = result.id;
    setHistory(previous => {
      const updated = [result, ...previous].slice(0, 100);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
    setBest(previous => {
      const updated = Math.max(previous, result.wpm);
      try { localStorage.setItem(BEST_KEY, String(updated)); } catch {}
      return updated;
    });
    if (result.daily) {
      setDailyCompleted(true);
      try { localStorage.setItem(DAILY_KEY, localDayKey()); } catch {}
    }
    if (soundOn) playTone(result.wpm >= best && result.wpm > 0 ? "best" : "finish");
  }, [status, result, soundOn, best]);

  const reset = useCallback((nextDuration = duration, nextIndex = passageIndex, isDaily = false) => {
    setDuration(nextDuration);
    setPassageIndex(nextIndex);
    setTyped("");
    typedRef.current = "";
    setTimeLeft(nextDuration);
    setElapsedTime(0);
    setResult(null);
    startedAt.current = null;
    savedResultId.current = null;
    setStatus("ready");
    setDailyMode(isDaily);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [duration, passageIndex]);

  const handleChange = event => {
    if (status === "finished") return;
    const value = event.target.value.slice(0, passage.length);
    if (status === "ready" && value.length > 0) {
      startedAt.current = Date.now();
      setStatus("running");
    }
    typedRef.current = value;
    setTyped(value);
    if (value.length >= passage.length) finishTest(value, "completed");
  };

  const newText = () => reset(duration, (passageIndex + 1) % availablePassages.length, false);
  const startDaily = () => reset(60, dailyPassageIndex(availablePassages.length), true);
  const changeLibrary = (nextLanguage, nextLevel) => {
    setLanguage(nextLanguage);
    setLevel(nextLevel);
    reset(duration, 0, false);
  };
  const clearHistory = () => {
    setHistory([]);
    setBest(0);
    try { localStorage.removeItem(HISTORY_KEY); localStorage.removeItem(BEST_KEY); } catch {}
  };
  const focusTest = () => inputRef.current?.focus();

  useEffect(() => {
    const onKeyDown = event => {
      if (event.altKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        newText();
      } else if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        reset();
      } else if (event.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [reset, passageIndex, duration, availablePassages.length]);

  const chartData = useMemo(() => {
    const days = [];
    for (let offset = 6; offset >= 0; offset--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - offset);
      const key = localDayKey(date);
      const attempts = history.filter(item => localDayKey(new Date(item.completedAt)) === key);
      const avg = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.wpm, 0) / attempts.length) : 0;
      days.push({ label: date.toLocaleDateString([], { weekday: "short" }), value: avg, count: attempts.length });
    }
    return days;
  }, [history]);
  const maxChart = Math.max(20, ...chartData.map(day => day.value));
  const averageWpm = history.length ? Math.round(history.reduce((sum, item) => sum + item.wpm, 0) / history.length) : 0;
  const averageAccuracy = history.length ? Math.round(history.reduce((sum, item) => sum + item.accuracy, 0) / history.length) : 0;

  return (
    <main className={`app-shell theme-${theme}`}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="TypeRush home">
          <span className="brand-mark"><Zap size={19} fill="currentColor" /></span>
          <span>Type<span className="brand-accent">Rush</span></span>
        </a>
        <div className="topbar-right">
          <span className="top-label"><span className="live-dot" /> TYPING SPEED TEST</span>
          <button className="icon-control" onClick={() => setTheme(value => value === "dark" ? "light" : "dark")} aria-label="Toggle theme" title="Toggle light/dark theme">
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="icon-control" onClick={() => setSoundOn(value => !value)} aria-label="Toggle sound" title={soundOn ? "Turn sound off" : "Turn sound on"}>
            {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
          <a className="github-link" href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span className="eyebrow-line" /> THE DAILY TYPING CHALLENGE</div>
        <h1>Every second <span>counts.</span></h1>
        <p className="subtitle">Find your rhythm. Build your speed. Beat your best.</p>
      </section>

      <section className="stats-grid" aria-label="Typing statistics">
        <article className="stat-card"><div className="stat-icon purple"><Zap size={17} /></div><div><span className="stat-label">YOUR SPEED</span><div className="stat-value">{result ? result.wpm : wpm}<small> WPM</small></div></div></article>
        <article className="stat-card"><div className="stat-icon green"><Target size={17} /></div><div><span className="stat-label">ACCURACY</span><div className="stat-value">{result ? result.accuracy : accuracy}<small>%</small></div></div></article>
        <article className="stat-card"><div className="stat-icon orange"><Clock3 size={17} /></div><div><span className="stat-label">TIME LEFT</span><div className="stat-value">{timeLeft}<small> SEC</small></div></div></article>
        <article className="stat-card"><div className="stat-icon gold"><Trophy size={17} /></div><div><span className="stat-label">PERSONAL BEST</span><div className="stat-value">{best}<small> WPM</small></div></div></article>
      </section>

      <section className="daily-card">
        <div className="daily-copy">
          <span className="section-kicker"><CalendarDays size={13} /> DAILY CHALLENGE</span>
          <h2>{dailyCompleted ? "Today's challenge completed" : "One challenge. Every day."}</h2>
          <p>{dailyCompleted ? "Nice work — come back tomorrow for a new daily passage." : "Take the same 60-second challenge as everyone else today."}</p>
        </div>
        <button className="primary-btn" onClick={startDaily} disabled={dailyCompleted || status === "running"}>
          {dailyCompleted ? "Completed ✓" : "Play daily challenge →"}
        </button>
      </section>

      <section className="test-panel">
        <div className="panel-top">
          <div className="panel-heading"><span className="keyboard-icon"><Keyboard size={17} /></span><div><h2>Typing test</h2><p>{dailyMode ? "Daily challenge · 60 seconds" : "Type the text below as fast as you can."}</p></div></div>
          <div className="test-controls">
            <label className="library-select"><span>LANGUAGE</span><select value={language} disabled={status === "running"} onChange={event => changeLibrary(event.target.value, level)}><option value="en">English</option><option value="fr">Français</option></select></label>
            <label className="library-select"><span>LEVEL</span><select value={level} disabled={status === "running"} onChange={event => changeLibrary(language, event.target.value)}><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option></select></label>
          <span className="library-count">{availablePassages.length} passages</span>
          <div className="duration-picker" aria-label="Test duration">
            {TIME_OPTIONS.map(option => <button key={option} className={duration === option && !dailyMode ? "duration active" : "duration"} onClick={() => reset(option, passageIndex, false)} disabled={status === "running"}>{option}s</button>)}
          </div>
          </div>
        </div>
        <div className="progress-track">
  <div
    className="progress-fill"
    style={{ width: `${progress}%` }}
  />
</div>
        <button className={`text-display ${status === "finished" ? "completed" : ""}`} onClick={focusTest} aria-label="Typing passage. Click to start typing">
          {passage.split("").map((char, index) => {
            let className = "char";
            if (index < typed.length) className += typed[index] === char ? " correct" : " incorrect";
            if (index === typed.length && status !== "finished") className += " cursor";
            return <span className={className} key={`${passageIndex}-${index}`}>{char}</span>;
          })}
        </button>
        <textarea ref={inputRef} className="typing-input" value={typed} onChange={handleChange} onPaste={event => event.preventDefault()} disabled={status === "finished"} placeholder="Click here and start typing..." aria-label="Type the passage here" spellCheck="false" autoCapitalize="off" autoComplete="off" autoCorrect="off" />
        {status === "ready" && <div className="helper"><Info size={14} /> Start typing to begin the timer. Your test starts with your first character.</div>}
        {status === "running" && <div className="helper"><span className="live-dot" /> Test in progress — keep going!</div>}
        {status === "finished" && result && <div className="result-banner"><div><strong>{result.reason === "completed" ? "Passage completed!" : "Time is up!"}</strong><span>You typed {result.characters} characters with {result.accuracy}% accuracy.</span></div><span className="result-score">{result.wpm} <small>WPM</small></span></div>}
        <div className="panel-footer">
          <div className="mini-metrics"><span><b>{typed.length}</b> / {passage.length} characters</span><span><b>{errors}</b> errors</span></div>
          <div className="actions"><button className="secondary-btn" onClick={() => reset()}><RotateCcw size={15} /> Restart</button><button className="primary-btn" onClick={newText}>New text <span>→</span></button></div>
        </div>
      </section>

      {result && <section className="results-panel" aria-live="polite">
        <div className="section-heading"><div><span className="section-kicker">YOUR PERFORMANCE</span><h2>Test results</h2></div><span className="rating-pill"><Medal size={15} /> {result.rating}</span></div>
        <div className="result-grid">
          <article className="result-stat"><span>WORDS PER MINUTE</span><strong>{result.wpm}</strong><small>WPM</small></article>
          <article className="result-stat"><span>ACCURACY</span><strong>{result.accuracy}%</strong><small><CheckCircle2 size={13} /> Correct characters</small></article>
          <article className="result-stat"><span>ERRORS</span><strong>{result.errors}</strong><small><AlertCircle size={13} /> Incorrect characters</small></article>
          <article className="result-stat"><span>TIME USED</span><strong>{result.elapsed}s</strong><small>Out of {result.duration}s</small></article>
        </div>
        <p className="result-tip">{result.accuracy < 90 ? "Tip: focus on accuracy first. Speed will improve naturally with practice." : "Nice work! Keep practicing to beat your personal best."}</p>
      </section>}

      <section className="analytics-panel">
        <div className="section-heading"><div><span className="section-kicker"><BarChart3 size={13} /> YOUR PROGRESS</span><h2>Performance overview</h2></div></div>
        <div className="analytics-summary">
          <div className="analytics-metric"><span>AVERAGE SPEED</span><strong>{averageWpm}<small> WPM</small></strong></div>
          <div className="analytics-metric"><span>AVERAGE ACCURACY</span><strong>{averageAccuracy}<small>%</small></strong></div>
          <div className="analytics-metric"><span>TESTS COMPLETED</span><strong>{history.length}</strong></div>
        </div>
        <div className="chart-title">Average WPM · Last 7 days</div>
        <div className="progress-chart" role="img" aria-label="Average words per minute over the last seven days">
          {chartData.map(day => <div className="chart-column" key={day.label}><div className="chart-value">{day.value || ""}</div><div className="chart-track"><div className="chart-bar" style={{ height: `${day.value ? Math.max(5, day.value / maxChart * 100) : 0}%` }} /></div><span>{day.label}</span></div>)}
        </div>
      </section>

      <section className="history-panel">
        <div className="section-heading"><div><span className="section-kicker">TRACK YOUR PROGRESS</span><h2><History size={19} /> Recent attempts</h2></div>{history.length > 0 && <button className="clear-history" onClick={clearHistory}>Clear history</button>}</div>
        {history.length === 0 ? <div className="empty-history"><Trophy size={20} /><span>Your completed tests will appear here.</span><small>Finish your first test to start tracking progress.</small></div> : <div className="history-list">
          {history.slice(0, 10).map((item, index) => <div className="history-row" key={item.id || `${item.completedAt}-${index}`}>
            <div className="history-rank">{index + 1}</div><div className="history-info"><strong>{item.wpm} WPM</strong><span>{formatDate(item.completedAt)}{item.daily ? " · Daily" : ""}</span></div>
            <div className="history-detail"><strong>{item.accuracy}%</strong><span>Accuracy</span></div><div className="history-detail"><strong>{item.errors}</strong><span>Errors</span></div><span className="history-duration">{item.duration}s</span>
          </div>)}
        </div>}
      </section>

      <section className="shortcuts-panel">
        <span className="section-kicker"><KeyboardIcon size={13} /> QUICK SHORTCUTS</span>
        <div><kbd>Ctrl</kbd> + <kbd>Enter</kbd><span>Restart test</span></div>
        <div><kbd>Alt</kbd> + <kbd>N</kbd><span>New text</span></div>
        <div><kbd>Esc</kbd><span>Unfocus typing box</span></div>
      </section>

      <footer className="footer"><span>MADE TO MAKE EVERY KEYSTROKE COUNT.</span><span>TYPE<span className="brand-accent">RUSH</span><span className="footer-dot"> • </span>2026</span></footer>
       <footer className="footer">
       <div className="footer-tagline">
       MADE TO MAKE EVERY KEYSTROKE COUNT.
       </div>

       <div className="footer-credit">
       <span className="footer-credit-label">
       DESIGNED & DEVELOPED BY
       </span>

       <strong>Abdesselam Bounabi</strong>

       <a
       className="footer-linkedin"
       href="https://www.linkedin.com/in/abdesselam-bounabi-76801b250"
       target="_blank"
       rel="noopener noreferrer"
       >
        <Linkedin size={15} />
        <span>Connect on LinkedIn</span>
       </a>
       </div>

       <div className="footer-brand">
        TYPERUSH · © 2026
       </div>
      </footer>
    </main>
  );
}
