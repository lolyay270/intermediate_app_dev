import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { queryClient } from "../main.tsx";

import { fetchUrlBase, storyInfoUrlExtension } from "./Stories";

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

interface UserProps {
  about: string;
  created: Date;
  id: string;       //what i would refer to as a username, but hackernews is silly
  karma: number;
  submitted: string[]; //fetch urls to top 5 posts
}

const Leaders: React.FC = () => {
  const leadersForm = useForm();
  const [searchedUser, setSearchedUser] = useState<string>(""); //will either be a valid name from the list or ""
  const [user, setUser] = useState<UserProps>();

  const fetchUrlUser = fetchUrlBase + "/user/"; //full url is ".../v0/user/[id]"
  const [fetchUrl, setFetchUrl] = useState<string>("");

  const handleLeadersSubmit = (values: any) => {
    setFetchUrl("");
    leadersList.map((user) => {
      if (user === values.name) {
        setSearchedUser(user)
        setFetchUrl(fetchUrlUser + user + ".json")
      }
    })
    console.log("fetchUrl", fetchUrl)
  }

  const {
    data: userData,
    isLoading: isLoadingData,
    isError: isErrorData,
  } = useQuery({
    queryKey: ["userData", fetchUrl],
    queryFn: () => fetch(fetchUrl).then((res) => res.json()),
  });

  //update data each time a valid username selected
  const { mutate: getUserMutation, data: getUserData } =
    useMutation({
      mutationFn: () =>
        fetch(fetchUrl).then((res) => res.json()),
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: ["userData"],
        }),
    });

  useEffect(() => {
    if (fetchUrl !== "") {
      getUserMutation()
    }
  }, [fetchUrl])

  // data validation and changing values to human readable (eg, time)
  useEffect(() => {
    if (userData) {
      setUser({
        about: userData.about ? userData.about.slice(0, userData.about.indexOf("<")) : "",
        created: new Date(userData.created * 1000), //hackerNews saves in seconds, JS creates from milliseconds
        id: userData.id,
        karma: userData.karma,
        submitted: userData.submitted.slice(0, 5).map((post: string) => ( //fetch urls to top 5 posts
          post = fetchUrlBase + storyInfoUrlExtension + post + ".json"
        )),
      })
    }
  }, [userData])


  return (
    <>
      <p>Search for a username within the top users</p>
      <form onSubmit={leadersForm.handleSubmit(handleLeadersSubmit)}>

        {/* allow for predetermined list of leaders to select from */}
        <datalist id="leadersList">
          {leadersList.map((leader) => (
            <option value={leader}></option>
          ))}
        </datalist>

        <label htmlFor="name">Username</label>
        <input type="text" id="name" list="leadersList" {...leadersForm.register("name")} />

        <button type="submit">Search</button>
      </form>

      <br />
      <br />

      <p>User data:</p>
      {!leadersForm.formState.isSubmitted ? (
        <p> Press the "Search" button to find a user</p >
      ) : (

        searchedUser === "" ? ( //form submitted but search value is "" or value was invalid and set to "" by code
          <p>No usernames match the search</p>
        ) : (

          isLoadingData ? (
            <p>Loading...</p>
          ) : (

            isErrorData ? (
              <p>Error: Cannot show data</p>
            ) : (

              userData && user && (
                <>
                  <p>About: {user.about}</p>
                  <p>Created: {user.created.toString()}</p>
                  <p>Id: {user.id}</p>
                  <p>Karma: {user.karma}</p>
                  <p>
                    Subitted: {user.submitted.length > 1 ? (
                      user.submitted.map((post) => (
                        <>
                          <br />
                          <a href={post} target="_blank">{post}</a>
                        </>
                      ))
                    ) : (
                        "N/A"
                    )}
                  </p>
                </>
              )
            )
          )
        )
      )}
    </>
  )
}

export default Leaders;

// 

