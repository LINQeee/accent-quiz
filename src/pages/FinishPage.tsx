import {Button} from '../components/ui/Button'
import {Card, CardContent} from '../components/ui/Card'
import {InlineIcon} from '../components/InlineIcon'
import type {Answer} from '../types/quiz'

interface FinishPageProps {
  answers: Answer[]
  correctCount: number
  total: number
  onRestart: () => void
  onOpenStats: () => void
}

export function FinishPage({
  answers,
  correctCount,
  total,
  onRestart,
  onOpenStats
}: FinishPageProps) {
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0
  const mistakes = answers.filter((a) => !a.ok)

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <section className="mx-auto max-w-3xl">
        <Card className="rounded-md shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 text-4xl font-bold">
              <InlineIcon type="trophy" />
            </div>
            <h1 className="text-3xl font-bold">Квиз завершён</h1>
            <p className="mt-3 text-lg text-slate-600">
              Результат: {correctCount} из {total} — {percent}%
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button onClick={onRestart} className="rounded-md px-6">
                <span className="mr-2">
                  <InlineIcon type="restart" />
                </span>{' '}
                Пройти заново
              </Button>
              <Button
                onClick={onOpenStats}
                variant="outline"
                className="rounded-md px-6"
              >
                Статистика
              </Button>
            </div>
          </CardContent>
        </Card>

        {mistakes.length > 0 && (
          <Card className="mt-6 rounded-md shadow-sm">
            <CardContent className="p-6">
              <h2 className="mb-3 text-xl font-semibold">
                Ошибки для повторения
              </h2>
              <div className="flex flex-wrap gap-2">
                {mistakes.map((item) => (
                  <span
                    key={item.word}
                    className="rounded-full bg-white px-3 py-1 text-sm shadow-sm"
                  >
                    {item.word}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  )
}
