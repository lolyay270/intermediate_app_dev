import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import Categories from "./components/categories";
import Questions from "./components/questions";

interface QuizSelection {
  username: string;   //not required for opentdb but good place to save
  amount: number;
  category: number;   //id of the category
  difficulty: string; //should be toLower 
  type: string;       //should be toLower 
}

const App = () => {
  const categories = Categories();
  const difficulties = [
    "Any",
    "Easy",
    "Medium",
    "Hard",
  ]
  const types = [
    "Any",
    "Multiple Choice",
    "True/False",
  ]

  const fetchUrlBase = "https://opentdb.com/api.php?"
  const [fetchUrl, setFetchUrl] = useState<string>("")

  const quizSelectionForm = useForm();
  const [quizSelection, setQuizSelection] = useState<QuizSelection>();

  const quizSelectionSubmit = (values: any) => {
    const quizSel: QuizSelection = {
      username: values.username === "" ? "Anonymous" : values.username,
      amount: Number(values.amount) === 0 ? 10 : Number(values.amount),
      category: Number(values.category),
      difficulty: values.difficulty.toLowerCase(),
      type: values.type.toLowerCase(),
    }
    setQuizSelection(quizSel);
  }

  //update fetch Url when selection is made
  useEffect(() => {
    if (quizSelection) {
      let newUrl = fetchUrlBase + `amount=${quizSelection.amount}` //there is always an amount needed

      if (quizSelection.category !== 0) newUrl += "&category=" + quizSelection.category; //0 is my value set for "any"

      if (quizSelection.difficulty !== "any") newUrl += "&difficulty=" + quizSelection.difficulty;

      if (quizSelection.type !== "any") {
        newUrl += "&type=";
        if (quizSelection.type === "true/false") newUrl += "boolean";
        else newUrl += quizSelection.type;
      }

      setFetchUrl(newUrl);
    }
  }, [quizSelection]);

  if (!categories || categories === "loading" /* add other loading states here */) return <p>Loading...</p>
  if (categories === "error" /* add other error states here */) return <p>Error: Cannot load data</p>

  return (
    <>
      {!quizSelectionForm.formState.isSubmitted ? (
        <>
        <h2>Please create the quiz you would like to take</h2>

      <form onSubmit={quizSelectionForm.handleSubmit(quizSelectionSubmit)}>
        <label htmlFor="username">Your username (to save to the leaderboard):</label>
        <input type="text" id="username" placeholder="Anonymous" {...quizSelectionForm.register("username")} />
        <br />
        <br />

        <label htmlFor="amount">Number of questions:</label>
        <input type="number" id="amount" min="1" max="50" placeholder="10" {...quizSelectionForm.register("amount")} />
        <br />
        <br />

        <label htmlFor="category">Select a category:</label>
        <select id="category" {...quizSelectionForm.register("category")} >
          {categories.map((cat: any) => (
            <option value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <br />
        <br />

        <label htmlFor="difficulty">Select a difficulty:</label>
        <select id="difficulty" {...quizSelectionForm.register("difficulty")} >
          {difficulties.map((dif: any) => (
            <option value={dif}>{dif}</option>
          ))}
        </select>
        <br />
        <br />

        <label htmlFor="type">Select a type:</label>
        <select id="type" {...quizSelectionForm.register("type")} >
          {types.map((type: any) => (
            <option value={type}>{type}</option>
          ))}
        </select>
        <br />
        <br />

        <button type="submit">Generate Quiz</button>
      </form>
      </>
      ) : (


        //quiz selection form submitted
        <Questions fetchUrl={fetchUrl}/>
      )}
      
    </>
  )
}

export default App
