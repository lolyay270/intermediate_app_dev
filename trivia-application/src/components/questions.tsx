import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../main";
import { useEffect, useState } from "react";
import type React from "react";
import { useForm } from "react-hook-form";

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

interface QuestionAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean; //easier to compare early than in the massive return method
}

const Questions: React.FC<Props> = (props: Props) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<any[]>();
  const [scores, setScores] = useState<QuestionAnswer[]>([]); 
  const [finalScore, setFinalScore] = useState<number>(0);

  const questionSubmissionForm = useForm();

  /*data validation 
  convert to an array of objects {question: answer}

  any question that includes a "." will be turned into an object
  
  values {
    question: answer, (this is normal)
    ...
    questionPart1: {questionPart2: answer} (when a "." is in the question)
    }
  */
  const HandleQuestionsSubmit = (values: any) => {
    let newValues: any[] = [];
    for (let [key, value] of Object.entries<any>(values)) {
      if (!value) value = "";
      if (typeof value === "object") {
        const [subKey, answer] = Object.entries(value);
        key = key + "." + subKey;
        value = answer ? answer : "";

      }

      newValues.push({ [key]: value });
      //answers = [{question: answer}, ...]
    }

    setAnswers(newValues);
  }

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

  const { mutate: getQuizMutation, data: getQuizData, isPending: isGetQuizPending } =
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
    if (props.fetchUrl !== "" && !isGetQuizPending && !isFetchingQuiz) { //only fetch once cause rate limiter
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


  // Check scores for each answer
  useEffect(() => {
    if (answers){
      answers.map((question, i) => {
        const questionAnswer: QuestionAnswer = {
          question: Object.keys(question)[0], //there will only ever be one key value pair
          userAnswer: Object.values(question).toString(),
          correctAnswer: questions[i].correct_answer,
          isCorrect: Object.values(question).toString() === questions[i].correct_answer,
        }
        setScores((score) => [...score, questionAnswer])
        if (questionAnswer.isCorrect) setFinalScore(finalScore + 1);
      })
    }
  }, [answers])


  return (
    !answers ? ( //Answers not submitted, show questions

      isLoadingQuiz ? (
        <p>Quiz questions loading...</p>
      ) : (

        isErrorQuiz || quizData.response_code !== 0 ? (   // res code 0 => success
          <p>Error: Connot load quiz questions</p>
        ) : (

          <form onSubmit={questionSubmissionForm.handleSubmit(HandleQuestionsSubmit)}>
            {questions && questions.map((question: any) => (
              <>
                <p>Category: {question.category}</p>
                <p>Difficulty: {question.difficulty}</p>
                <p>Question: {question.question}</p>

                {question.type === "multiple" && (
                  <>
                    {question.all_answers.map((answer: string) => (
                      <>
                        <input type="radio" id={answer} value={answer} {...questionSubmissionForm.register(question.question)} />
                        <label htmlFor={answer}>{answer}</label>
                        <br />
                      </>
                    ))}
                  </>
                )}

                {question.type === "boolean" && (
                  <>
                    <input type="radio" id="True" value="True" {...questionSubmissionForm.register(question.question)} />
                    <label htmlFor="True">True</label>
                    <br />

                    <input type="radio" id="False" value="False" {...questionSubmissionForm.register(question.question)} />
                    <label htmlFor="False">False</label>
                    <br />
                  </>
                )}
                <br />
                <br />
              </>
            ))}
            <button type="submit">Submit Answers For Marking</button>
          </form>
        )
      )
    ) : (
      <>
        {/* Answers have been submitted */}

        <h2>Final score: {finalScore}</h2>
        
        {scores.map((score: QuestionAnswer) => (
          <>
            <p>{score.question}</p>
            <p>Your answer: {score.userAnswer}</p>
            {score.isCorrect ? (
              <p>CORRECT!</p>
            ) : (
              <p>Correct answer: {score.correctAnswer}</p>
            )}
            <br />
            <br />
          </>
        ))}
        
      </>
    )
  )
}

export default Questions;
