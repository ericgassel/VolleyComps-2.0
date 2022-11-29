import { AxiosError } from "axios";
import React, { useReducer, createContext, useContext, Dispatch } from "react";
import { Action } from "../action/action";

type State = {
    error: Error | AxiosError;
    data: any;
}

// -- Global react state managed by React Context API --
const initialState = {
    error: null,
    data: {}
}

type AppDispatch = Dispatch<Action>

/*
* -- Reducer --
* Reducer is a function that takes the current state and an action as arguments, and return a new state result.
* logic: use a switch case to handle different actions and update the state based on the given action 
*/


const appReducer = (state: any, action: Action) => {
    switch (action.type) {

        case "success": {
            const { data } = action;
            return {
              ...state,
              data: action.data
            }
        }

        case "error": {
            return {
              ...state,
              loading: false,
              error: action.error,
            };
          }

        default:
            throw new Error(`Unhandled action`);
    }
}
    
const AppStateContext = createContext<State | null>(null);
const AppDispatchContext = createContext<AppDispatch | null>(null);

export function AppProvider({children}: {children: React.ReactNode}) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// custom hooks to use state and dispatch
export function useAppContext() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("Cannot find AppProvider");
  }
  return context;
}

export function useAppDispatchContext() {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error("Cannot find AppProvider");
  }
  return context;
}

