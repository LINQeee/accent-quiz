import {useMemo, useState} from 'react'
import {FinishPage} from './pages/FinishPage'
import {QuizPage} from './pages/QuizPage'
import {StatsPage} from './pages/StatsPage'
import {getQuizWords} from './utils/words'
import {loadStoredStats, saveStoredStats} from './utils/storage'
import type {Answer, Page, PreparedWord, StoredStats} from './types/quiz'

export default function App() {
  const [words, setWords] = useState(getQuizWords())
  const [page, setPage] = useState<Page>('quiz')
  const [index, setIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [storedStats, setStoredStats] = useState<StoredStats>(() =>
    loadStoredStats()
  )

  const current = words[index]
  const answered = selectedIndex !== null
  const finished = index >= words.length

  function updateStats(word: PreparedWord, ok: boolean) {
    setStoredStats((prev) => {
      const currentStats = prev[word.text] || {
        attempts: 0,
        correct: 0,
        wrong: 0
      }
      const next: StoredStats = {
        ...prev,
        [word.text]: {
          attempts: currentStats.attempts + 1,
          correct: currentStats.correct + (ok ? 1 : 0),
          wrong: currentStats.wrong + (ok ? 0 : 1)
        }
      }
      saveStoredStats(next)
      return next
    })
  }

  function choose(position: number) {
    if (answered || finished || !current) return
    const ok = position === current.stressCharIndex
    setSelectedIndex(position)
    setAnswers((prev) => [...prev, {word: current.raw, ok}])
    updateStats(current, ok)
    if (ok) setCorrectCount((n) => n + 1)
  }

  function next() {
    setSelectedIndex(null)
    setIndex((n) => n + 1)
  }

  function restart() {
    setIndex(0)
    setSelectedIndex(null)
    setCorrectCount(0)
    setAnswers([])
    setPage('quiz')
    setWords(getQuizWords())
  }

  function resetStats() {
    setStoredStats({})
    saveStoredStats({})
  }

  if (page === 'stats') {
    return (
      <StatsPage
        words={words}
        answers={answers}
        storedStats={storedStats}
        onBack={() => setPage('quiz')}
        onResetStats={resetStats}
      />
    )
  }

  if (finished) {
    return (
      <FinishPage
        answers={answers}
        correctCount={correctCount}
        total={words.length}
        onRestart={restart}
        onOpenStats={() => setPage('stats')}
      />
    )
  }

  return (
    <QuizPage
      current={current}
      index={index}
      total={words.length}
      correctCount={correctCount}
      selectedIndex={selectedIndex}
      onChoose={choose}
      onNext={next}
      onRestart={restart}
      onOpenStats={() => setPage('stats')}
    />
  )
}
