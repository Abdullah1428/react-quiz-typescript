import React, { useState } from 'react'

import { fetchQuizQuestions, Difficulty, QuestionState } from './utils/api-call'

// components
import QuestionCard from './components/QuestionCard'

// styles
import { GlobalStyle, Wrapper } from './styles/App.styles'

export type AnswerObject = {
  question: string
  answer: string
  correct: boolean
  correctAnswer: string
}

const TOTAL_QUESTIONS: number = 10

const App = () => {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [number, setNumber] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)
  /*
  useEffect(() => {
    console.log(fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY))
  }, [])
  */

  const startTrivia = async () => {
    setLoading(true)
    setGameOver(false)

    try {
      const newQuestions = await fetchQuizQuestions(
        TOTAL_QUESTIONS,
        Difficulty.EASY
      )

      setQuestions(newQuestions)
      setScore(0)
      setUserAnswers([])
      setNumber(0)
      setLoading(false)
    } catch (error) {
      setGameOver(true)
      setScore(0)
      setUserAnswers([])
      setNumber(0)
      setLoading(false)
      console.log(error)
    }
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value

      const correct = questions[number].correct_answer === answer

      if (correct) {
        setScore(prev => prev + 1)
      }

      const answerObject: AnswerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }

      setUserAnswers(prev => [...prev, answerObject])
    }
  }

  const nextQuestion = () => {
    // move on to next question
    const nextQuestion = number + 1
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }
  }

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className='start' onClick={startTrivia}>
            Start
          </button>
        ) : null}

        {!gameOver && <p className='score'>Score: {score} </p>}
        {loading && <p>Loading Questions...</p>}
        {!loading && !gameOver && (
          <QuestionCard
            question={questions[number].question}
            answers={questions[number].answers}
            callback={checkAnswer}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            questionNumber={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
          />
        )}
        {!gameOver &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTIONS - 1 && (
            <button className='next' onClick={nextQuestion}>
              Next Question
            </button>
          )}
      </Wrapper>
    </>
  )
}

export default App
