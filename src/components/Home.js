import React from "react";
import Card from "./Card";
import { AuthContext } from "../App";

const Home = () => {
  const initialState = {
    songs: [],
    isFetching: false,
    hasError: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_SONGS_REQUEST":
        return {
          ...state,
          isFetching: true,
          hasError: false,
        };
      case "FETCH_SONGS_SUCCESS":
        return {
          ...state,
          isFetching: false,
          songs: action.payload,
        };
      case "FETCH_SONGS_FAILURE":
        return {
          ...state,
          isFetching: false,
          hasError: true,
        };
      default:
        return state;
    }
  };

  const { state: authState } = React.useContext(AuthContext);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: "FETCH_SONGS_REQUEST",
    });
    fetch("https://hookedbe.herokuapp.com/api/songs", {
      headers: {
        Authorization: `Bearer ${authState.token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((resJson) => {
        console.log(resJson);
        dispatch({
          type: "FETCH_SONGS_SUCCESS",
          payload: resJson,
        });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: "FETCH_SONGS_FAILURE",
        });
      });
  }, [authState.token]);

  return (
    <React.Fragment>
      <div className="home">
        {state.isFetching ? (
          <span className="loader">Loading...</span>
        ) : state.hasError ? (
          <span className="error">An error has occurred</span>
        ) : (
          <>
            {state.songs.length > 0 &&
              state.songs.map((song) => (
                <Card key={song.id.toString()} song={song} />
              ))}
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default Home;
