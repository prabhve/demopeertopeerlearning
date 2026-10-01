/**
 * Learning Arena View (Mini-Games Suite)
 * Interactive gamified skill challenges: Concept Match, Rapid Fire MCQ, Code Debugger
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gamepad2,
  Trophy,
  Zap,
  Timer,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { MOCK_GAMES } from '../data/mockData';

export const LearningArenaView: React.FC = () => {
  const { completeGameReward, currentUser, showToast } = useApp();

  const [activeGameId, setActiveGameId] = useState<string>('game-concept-match');
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Rapid Fire MCQ state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [rapidScore, setRapidScore] = useState(0);
  const [rapidFinished, setRapidFinished] = useState(false);

  // Debug code state
  const [debugSolved, setDebugSolved] = useState(false);

  // Concept Match logic
  const conceptGame = MOCK_GAMES[0];
  const pairs: { term: string; definition: string }[] = conceptGame.data.pairs;

  const handleTermClick = (term: string) => {
    if (matchedPairs.includes(term)) return;
    setSelectedTerm(term);
  };

  const handleDefClick = (def: string, expectedTerm: string) => {
    if (!selectedTerm) return;
    if (selectedTerm === expectedTerm) {
      const newMatched = [...matchedPairs, selectedTerm];
      setMatchedPairs(newMatched);
      setSelectedTerm(null);
      if (newMatched.length === pairs.length) {
        completeGameReward('Concept Match Victory', 2, 40);
        showToast('🏆 Concept Match Cleared! +2 Credits & +40 XP awarded!', 'success');
      }
    } else {
      showToast('Mismatch! Try another definition.', 'error');
      setSelectedTerm(null);
    }
  };

  // Rapid MCQ logic
  const rapidGame = MOCK_GAMES[2];
  const rapidQuestions = rapidGame.data.questions;

  const handleAnswerRapid = (choice: string) => {
    const isCorrect = choice === rapidQuestions[currentQuestionIndex].a;
    if (isCorrect) setRapidScore(prev => prev + 1);

    if (currentQuestionIndex + 1 < rapidQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setRapidFinished(true);
      const finalCredits = isCorrect ? 3 : 2;
      completeGameReward('Rapid Fire Speedrun', finalCredits, 75);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Gamified Arena
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Daily Brain Sprint
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Gamepad2 className="w-7 h-7 text-indigo-600" />
            Learning Arena
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Reinforce core engineering knowledge through rapid challenges. Earn credits, XP, and unlock streak badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
            <span className="text-amber-800 font-bold block">Current XP</span>
            <span className="text-lg font-black text-amber-950">{currentUser.xp} XP</span>
          </div>
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs">
            <span className="text-sky-800 font-bold block">Wallet</span>
            <span className="text-lg font-black text-sky-950">{currentUser.credits} Cr</span>
          </div>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl text-xs max-w-md">
        {MOCK_GAMES.map(g => (
          <button
            key={g.id}
            onClick={() => setActiveGameId(g.id)}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center ${
              activeGameId === g.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {g.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* GAME 1: Concept Match */}
      {activeGameId === 'game-concept-match' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Match the Concept</h3>
              <p className="text-xs text-slate-500">
                Click a concept on the left, then select its matching definition on the right.
              </p>
            </div>
            <div className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
              Reward: +2 Credits &amp; +40 XP
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Terms Column */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Concepts</span>
              {pairs.map(p => {
                const isMatched = matchedPairs.includes(p.term);
                const isSelected = selectedTerm === p.term;

                return (
                  <button
                    key={p.term}
                    disabled={isMatched}
                    onClick={() => handleTermClick(p.term)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs font-bold transition-all ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : isSelected
                        ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-sm scale-102'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{p.term}</span>
                      {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Definitions Column (scrambled order) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Definitions</span>
              {[...pairs].reverse().map(p => {
                const isMatched = matchedPairs.includes(p.term);

                return (
                  <button
                    key={p.definition}
                    disabled={isMatched}
                    onClick={() => handleDefClick(p.definition, p.term)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs transition-all ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                        : 'bg-white border-slate-200 hover:border-sky-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{p.definition}</span>
                      {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {matchedPairs.length === pairs.length && (
            <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="font-extrabold text-emerald-900 text-sm">🎉 All Concepts Matched!</div>
              <p className="text-xs text-emerald-700">You earned +2 Credits and +40 XP for your mastery.</p>
              <button
                onClick={() => setMatchedPairs([])}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: Rapid Fire MCQ */}
      {activeGameId === 'game-rapid-fire' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Rapid Fire GATE Speedrun</h3>
              <p className="text-xs text-slate-500">
                Question {currentQuestionIndex + 1} of {rapidQuestions.length}
              </p>
            </div>
            <div className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
              Reward: +3 Credits &amp; +75 XP
            </div>
          </div>

          {!rapidFinished ? (
            <div className="space-y-4 max-w-xl">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 text-sm">
                  {rapidQuestions[currentQuestionIndex].q}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rapidQuestions[currentQuestionIndex].options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswerRapid(opt)}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-xs font-bold text-slate-800 text-left transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
              <h4 className="text-lg font-black text-slate-900">Sprint Completed!</h4>
              <p className="text-xs text-slate-500">
                You answered {rapidScore} out of {rapidQuestions.length} correctly.
              </p>
              <button
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setRapidScore(0);
                  setRapidFinished(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Restart Speedrun
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 3: Code Debugger */}
      {activeGameId === 'game-code-debug' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Debug the Code: Python Memory Leak</h3>
              <p className="text-xs text-slate-500">
                Inspect the class and find the architectural bug causing memory accumulation.
              </p>
            </div>
            <div className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
              Reward: +3 Credits &amp; +60 XP
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
            <pre>{MOCK_GAMES[1].data.code}</pre>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Which statement identifies the root bug?</h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  setDebugSolved(true);
                  completeGameReward('Python Debug Victory', 3, 60);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  debugSolved
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                1. `_cache = []` is declared at the class level instead of inside `__init__`, so every instance shares and accumulates data permanently.
              </button>
              <button
                onClick={() => showToast('Incorrect. The sensor_id parameter is valid.', 'error')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-slate-300"
              >
                2. `sensor_id` must be declared as a private variable `__sensor_id`.
              </button>
              <button
                onClick={() => showToast('Incorrect. Python lists support append natively.', 'error')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-slate-300"
              >
                3. The method name `store` conflicts with Python standard library keywords.
              </button>
            </div>

            {debugSolved && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <strong>Correct!</strong> In Python, mutable class-level attributes are shared across all instances, creating severe memory leaks in production servers. +3 Credits added!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
