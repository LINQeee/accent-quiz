import {AnimatePresence, motion} from 'framer-motion'
import {Button} from '../components/ui/Button'
import {Card, CardContent} from '../components/ui/Card'
import {InlineIcon} from '../components/InlineIcon'
import type {PreparedWord} from '../types/quiz'

interface QuizPageProps {
  current: PreparedWord
  index: number
  total: number
  correctCount: number
  selectedIndex: number | null
  onChoose: (position: number) => void
  onNext: () => void
  onOpenStats: () => void
  onRestart: () => void
}

export function QuizPage({
  current,
  index,
  total,
  correctCount,
  selectedIndex,
  onRestart,
  onChoose,
  onNext,
  onOpenStats
}: QuizPageProps) {
  const answered = selectedIndex !== null
  const isCorrect = answered && selectedIndex === current.stressCharIndex
  const progress = total > 0 ? Math.round((index / total) * 100) : 0

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <section className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Тренажёр ударений
            </h1>
            <p className="mt-2 text-slate-600">
              Может работать криво потому, что Адюха решает параметры и у него
              нет времени
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={onOpenStats}
              variant="outline"
              className="w-fit rounded-md px-5"
            >
              Статистика
            </Button>
            <Button
              onClick={onRestart}
              variant="outline"
              className="rounded-md px-5"
            >
              Заново
            </Button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
          <span>
            Задание {index + 1} из {total}
          </span>
          <span>Верно: {correctCount}</span>
        </div>
        <div className="mb-8 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-slate-900 transition-all"
            style={{width: `${progress}%`}}
          />
        </div>

        <Card className="rounded-md shadow-lg">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.text}
                initial={{opacity: 0, y: 14}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -14}}
                transition={{duration: 0.2}}
              >
                <p className="mb-5 text-center text-sm uppercase tracking-[0.25em] text-slate-500">
                  Где ударение?
                </p>
                <div className="mb-8 flex flex-wrap justify-center gap-1 text-5xl font-bold sm:text-7xl">
                  {current.chars.map((ch, charIndex) => {
                    const isVowel = current.vowelPositions.includes(charIndex)
                    const isSelected = selectedIndex === charIndex
                    const isRight = current.stressCharIndex === charIndex
                    let classes = 'rounded-xl px-1 transition '
                    if (isVowel)
                      classes +=
                        'cursor-pointer hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 '
                    if (answered && isRight)
                      classes += 'bg-green-100 text-green-700 '
                    if (answered && isSelected && !isRight)
                      classes += 'bg-red-100 text-red-700 '
                    if (!isVowel) classes += 'cursor-default '

                    return (
                      <button
                        key={`${ch}-${charIndex}`}
                        type="button"
                        disabled={!isVowel || answered}
                        onClick={() => onChoose(charIndex)}
                        className={classes}
                        aria-label={
                          isVowel ? `Выбрать гласную ${ch}` : undefined
                        }
                      >
                        {ch}
                      </button>
                    )
                  })}
                </div>

                <div className="min-h-[96px] text-center">
                  {!answered && (
                    <p className="text-slate-500">
                      Выбери одну из гласных в слове.
                    </p>
                  )}
                  {answered && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                      <div
                        className={`mx-auto mb-4 flex w-fit items-center gap-2 rounded-full px-4 py-2 text-lg font-semibold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        <InlineIcon type={isCorrect ? 'correct' : 'wrong'} />
                        {isCorrect ? 'Правильно' : 'Неправильно'}
                      </div>
                      <p className="mb-5 text-slate-600">
                        Правильный вариант: <strong>{current.raw}</strong>
                      </p>
                      <Button onClick={onNext} className="rounded-md px-6">
                        Дальше
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
