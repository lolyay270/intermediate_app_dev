import { useForm } from "react-hook-form";
import Categories from "./components/categories";

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

  const quizSelectionForm = useForm();
  const quizSelectionSubmit = (values: any) => {
    if (values.username === "") values.username = "Anonymous";

    values.amount = Number(values.amount); //dont need to validate types since number input 
    if (values.amount === 0) values.amount = 10;

    values.category = Number(values.category); 
    
    console.log(values);
  }

  if (!categories || categories === "loading" /* add other loading states here */) return <p>Loading...</p>
  if (categories === "error" /* add other error states here */) return <p>Error: Cannot load data</p>

  return (
    <>
      <h2>Please create the quiz you would like to take</h2>
      
      <form onSubmit={quizSelectionForm.handleSubmit(quizSelectionSubmit)}>
        <label htmlFor="username">Your username (to save to the leaderboard):</label>
        <input type="text" id="username" placeholder="Anonymous" {...quizSelectionForm.register("username")} />
        <br/>
        <br/>

        <label htmlFor="amount">Number of questions:</label>
        <input type="number" id="amount" min="1" max="50" placeholder="10" {...quizSelectionForm.register("amount")} />
        <br/>
        <br/>

        <label htmlFor="category">Select a category:</label>
        <select id="category" {...quizSelectionForm.register("category")} >
          {categories.map((cat: any) => (
            <option value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <br/>
        <br/>

        <label htmlFor="difficulty">Select a difficulty:</label>
        <select id="difficulty" {...quizSelectionForm.register("difficulty")} >
          {difficulties.map((dif: any) => (
            <option value={dif}>{dif}</option>
          ))}
        </select>
        <br/>
        <br/>

        <label htmlFor="type">Select a type:</label>
        <select id="type" {...quizSelectionForm.register("type")} >
          {types.map((type: any) => (
            <option value={type}>{type}</option>
          ))}
        </select>
        <br/>
        <br/>

        <button type="submit">Generate Quiz</button>
      </form>
    </>
  )
}

export default App
