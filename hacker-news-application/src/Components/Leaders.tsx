import { useState } from "react";
import { useForm } from "react-hook-form";

const leadersList = [
  "tptacek",
  "jacquesm",
  "ingve",
  "todsacerdoti",
  "rbanffy",
  "pseudolus",
  "danso",
  "tosh",
  "JumpCrisscross",
  "Tomte",
];

const Leaders: React.FC = () => {
  const leadersForm = useForm();
  const [searchedNames, setSearchedNames] = useState<string[]>([]);


  const handleLeadersSubmit = (values: any) => {
    setSearchedNames([]);
    console.log(values.name)
    leadersList.map((leader) => {
      if (leader.includes(values.name)) {
        setSearchedNames(searchedNames => [...searchedNames, leader])
      } 
    })
    console.log("searchedNames", searchedNames)
  }

console.log(leadersForm.formState.isSubmitted)

  return (
    <>
      <p>Search for a username within the top users</p>
      <p>To view all top 10, leave the text field empty</p>
      <br/>

      <form onSubmit={leadersForm.handleSubmit(handleLeadersSubmit)}>
        <label htmlFor="name">Username</label>
        <input type="text" id="name" {...leadersForm.register("name")} />

        <button type="submit">Search</button>
      </form>

      <br/>
      <br/>

      <p>Search results:</p>
      {searchedNames.length > 0 ? (
        <>
          {searchedNames.map((username) => (
            <p>{username}</p>
          ))}
        </>

      ) : (
        leadersForm.formState.isSubmitted ? (
          <p>No usernames match the search</p>
        ) : (
          <p>Press the "Search" button to find a username</p>
        )
      )}
    </>
  )
}

export default Leaders;
