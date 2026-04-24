import {Button} from '../components/ui/Button'
import {Card, CardContent} from '../components/ui/Card'
import {StatCard} from '../components/StatCard'
import {getKnowledgeLevel} from '../utils/stats'
import type {Answer, PreparedWord, StoredStats} from '../types/quiz'

interface StatsPageProps {
  words: PreparedWord[]
  answers: Answer[]
  storedStats: StoredStats
  onBack: () => void
  onResetStats: () => void
}

export function StatsPage({
  words,
  answers,
  storedStats,
  onBack,
  onResetStats
}: StatsPageProps) {
  const totalWords = words.length
  const currentTotal = answers.length
  const currentCorrect = answers.filter((a) => a.ok).length
  const currentWrong = currentTotal - currentCorrect
  const currentPercent = currentTotal
    ? Math.round((currentCorrect / currentTotal) * 100)
    : 0
  const progressPercent = totalWords
    ? Math.round((currentTotal / totalWords) * 100)
    : 0

  const storedRows = words.map((word) => {
    const stats = storedStats[word.text] || {attempts: 0, correct: 0, wrong: 0}
    const accuracy = stats.attempts
      ? Math.round((stats.correct / stats.attempts) * 100)
      : 0
    return {...word, ...stats, accuracy}
  })

  const totalAttempts = storedRows.reduce((sum, row) => sum + row.attempts, 0)
  const totalCorrect = storedRows.reduce((sum, row) => sum + row.correct, 0)
  const totalWrong = storedRows.reduce((sum, row) => sum + row.wrong, 0)
  const knownWords = storedRows.filter(
    (row) => row.attempts > 0 && row.accuracy >= 80
  ).length
  const knownPercent = totalWords
    ? Math.round((knownWords / totalWords) * 100)
    : 0
  const globalAccuracy = totalAttempts
    ? Math.round((totalCorrect / totalAttempts) * 100)
    : 0
  const confidence = totalWords
    ? Math.round(
        ((knownWords / totalWords) * 0.65 +
          Math.min(totalAttempts / (totalWords * 2), 1) * 0.35) *
          100
      )
    : 0
  const knowledgeLevel = getKnowledgeLevel(
    globalAccuracy || currentPercent,
    confidence
  )

  const mistakeLeaders = storedRows
    .filter((row) => row.wrong > 0)
    .sort(
      (a, b) =>
        b.wrong - a.wrong ||
        a.accuracy - b.accuracy ||
        a.text.localeCompare(b.text, 'ru')
    )
    .slice(0, 12)

  const strongestWords = storedRows
    .filter((row) => row.attempts > 0 && row.wrong === 0)
    .sort((a, b) => b.correct - a.correct || a.text.localeCompare(b.text, 'ru'))
    .slice(0, 100)

  const currentMistakes = answers.filter((a) => !a.ok)
  const lastFive = answers.slice(-5).reverse()
  const currentStreak = (() => {
    let streak = 0
    for (let i = answers.length - 1; i >= 0; i -= 1) {
      if (!answers[i].ok) break
      streak += 1
    }
    return streak
  })()

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Статистика знаний
            </h1>
            <p className="mt-2 text-slate-600">
              Цифры по текущему прохождению и накопленная статистика по каждому
              слову.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={onBack} className="rounded-md px-5">
              Назад к квизу
            </Button>
            <Button
              onClick={onResetStats}
              variant="outline"
              className="rounded-md px-5"
            >
              Сбросить статистику
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Знаешь слов"
            value={`${knownPercent}%`}
            hint={`${knownWords} из ${totalWords} слов с точностью 80%+`}
          />
          <StatCard
            label="Уверенность знания"
            value={`${confidence}%`}
            hint={knowledgeLevel}
          />
          <StatCard
            label="Точность сейчас"
            value={`${currentPercent}%`}
            hint={`${currentCorrect} верно, ${currentWrong} ошибок`}
          />
          <StatCard
            label="Прогресс прохода"
            value={`${progressPercent}%`}
            hint={`${currentTotal} из ${totalWords} заданий`}
          />
          <StatCard
            label="Всего попыток"
            value={totalAttempts}
            hint="Сколько слов ты уже ответил"
          />
          <StatCard
            label="Всего ошибок"
            value={totalWrong}
            hint="Чем меньше, тем лучше"
          />
          <StatCard
            label="Текущая серия"
            value={currentStreak}
            hint="Правильных ответов подряд"
          />
          <StatCard
            label="Общая точность"
            value={`${globalAccuracy}%`}
            hint={`${totalCorrect} правильных ответов`}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="rounded-md shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">
                Слова, где чаще всего ошибки
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Топ по накопленным ошибкам.
              </p>
              <div className="mt-4 space-y-3">
                {mistakeLeaders.length === 0 ? (
                  <p className="rounded-xl bg-white p-4 text-slate-500">
                    Пока нет ошибок — мощно.
                  </p>
                ) : (
                  mistakeLeaders.map((row, idx) => (
                    <div
                      key={row.text}
                      className="rounded-xl bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">
                            {idx + 1}. {row.raw}
                          </p>
                          <p className="text-sm text-slate-500">
                            Ошибок: {row.wrong} · Попыток: {row.attempts} ·
                            Точность: {row.accuracy}%
                          </p>
                        </div>
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full bg-slate-900"
                            style={{
                              width: `${Math.max(8, 100 - row.accuracy)}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-md shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">Топ 100 сильных слов</h2>
              <p className="mt-1 text-sm text-slate-500">Слова без ошибок</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {strongestWords.length === 0 ? (
                  <p className="rounded-xl bg-white p-4 text-slate-500">
                    Ответь на несколько слов правильно — они появятся здесь.
                  </p>
                ) : (
                  strongestWords.map((row) => (
                    <span
                      key={row.text}
                      className="rounded-full bg-white px-3 py-1 text-sm shadow-sm"
                    >
                      {row.raw} · {row.correct}/{row.attempts}
                    </span>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-md shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">
                Ошибки в текущем проходе
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {currentMistakes.length === 0 ? (
                  <p className="rounded-xl bg-white p-4 text-slate-500">
                    В этом проходе ошибок пока нет.
                  </p>
                ) : (
                  currentMistakes.map((item, idx) => (
                    <span
                      key={`${item.word}-${idx}`}
                      className="rounded-full bg-white px-3 py-1 text-sm shadow-sm"
                    >
                      {item.word}
                    </span>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-md shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">Последние ответы</h2>
              <div className="mt-4 space-y-2">
                {lastFive.length === 0 ? (
                  <p className="rounded-xl bg-white p-4 text-slate-500">
                    Пока нет ответов.
                  </p>
                ) : (
                  lastFive.map((item, idx) => (
                    <div
                      key={`${item.word}-${idx}`}
                      className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                    >
                      <span className="font-medium">{item.word}</span>
                      <span
                        className={item.ok ? 'text-green-700' : 'text-red-700'}
                      >
                        {item.ok ? 'верно' : 'ошибка'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
