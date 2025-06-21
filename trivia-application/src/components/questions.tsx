import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../main";
import { useEffect, useState } from "react";
import type React from "react";

export interface Props {
  fetchUrl: string;
}

interface Question {
  category: string;
  difficulty: string;
  type: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];    //not given by openTDB, random order of correct_answer and incorrect_answers
}

const Questions: React.FC<Props> = (props: Props) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const {
    isLoading: isLoadingQuiz,
    isError: isErrorQuiz,
    data: quizData,
    isFetching: isFetchingQuiz,
    status: fetchStatus,
  } = useQuery({
    queryKey: ["quizData"],
    queryFn: () =>
      fetch(props.fetchUrl).then((res) => res.json()),
  });

  const { mutate: getQuizMutation, data: getQuizData, isPending: isGetQuizPending, status } =
    useMutation({
      mutationFn: () =>
        fetch(props.fetchUrl).then((res) => res.json()),
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: ["quizData"],
        }),
      onError: (error) => {
        console.error("Error fetching data", { errorCode: { error }, data: getQuizData })
      }
    });

  useEffect(() => {
    if (props.fetchUrl !== "" && !isGetQuizPending && fetchStatus !== "pending") { //only fetch once cause rate limiter
      getQuizMutation();      
    }
  }, [props.fetchUrl])


  /* function below created by Rob W (https://stackoverflow.com/a/7394787)
  I researched "convert html encoding to text js"
  and this was a top result:  https://stackoverflow.com/q/7394748 */
  function decodeHtml(html: any) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  /* function below created by Laurens Holst https://stackoverflow.com/a/12646864
  I researched "js randomly order an array"
  https://stackoverflow.com/q/2450954 was in the top results */
  function shuffleArray(array: any[]) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

  //data validation, fix questions including "&quot;" etc
  useEffect(() => {
    if (quizData && quizData.results) {
      quizData.results.map((quizQuest: any) => {
        const question: Question = {
          category: decodeHtml(quizQuest.category),
          difficulty: quizQuest.difficulty,
          type: quizQuest.type,
          question: decodeHtml(quizQuest.question),
          correct_answer: quizQuest.correct_answer,
          incorrect_answers: quizQuest.incorrect_answers,
          all_answers: shuffleArray(quizQuest.incorrect_answers.concat([quizQuest.correct_answer])),
        }

        setQuestions((questions) => [...questions, question])
      })
    }

  }, [quizData])

  return (
    isLoadingQuiz ? (
      <p>Quiz questions loading...</p>
    ) : (

      isErrorQuiz || quizData.response_code !== 0 ? (   // res code 0 => success
        <p>Error: Connot load quiz questions</p>
      ) : (
        questions && questions.map((question: any) => (
          <>
            <p>Category: {question.category}</p>
            <p>Difficulty: {question.difficulty}</p>
            <p>Question: {question.question}</p>

            {question.type === "multiple" && (
              <>
                {question.all_answers.map((answer: string) => (
                  <p>{answer}</p>
                ))}
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
