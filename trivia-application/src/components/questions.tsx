import { useQuery } from "@tanstack/react-query";
import type React from "react";

export interface QuestionsProps {
  fetchUrl: string;
}

const Questions: React.FC<QuestionsProps> = (props: QuestionsProps) => {
  const {
    isLoading: isLoadingQuiz,
    isError: isErrorQuiz,
    data: quizData,
    isFetching: isFetchingQuiz,
  } = useQuery({
    queryKey: ["quizData"],
    queryFn: () =>
      fetch(props.fetchUrl).then((res) => res.json()),
  });

  console.log("quizData", quizData);



  return (
    isLoadingQuiz ? (
      <p>Quiz questions loading...</p>
    ) : (

      isErrorQuiz || quizData.response_code !== 0 ? (   // res code 0 => success
        <p>Error: Connot load quiz questions</p>
      ) : (
        quizData.results.map((question: any) => (
          <>
            <p>Category: {question.category}</p>
            <p>Difficulty: {question.difficulty}</p>
            <p>Question: {question.question}</p>

            {question.type === "multiple" && (
              <>
                <p>{question.correct_answer}</p>
                <p>
                  {question.incorrect_answers.map((answer: string) => (
                    <>{answer} </>
                  ))
                  }
                </p>
              </>
            )}

            {question.type === "boolean" && (
              <>
                <p>True</p>
                <p>False</p>
              </>
            )}
            <br />
            <br />
          </>
        ))
      )
    )
  )
}

export default Questions;