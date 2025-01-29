"use client";
import {FC, ReactNode} from "react";
import { createContext, useReducer, useCallback, useEffect } from "react";
interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  name: string;
}
interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}
enum ActionType {
  INITIALIZE = 'INITIALIZE',
  SIGNIN = "SIGN_IN",
  SIGNOUT = "SIGN_OUT",
}
type Handler = (state: State, action: any) => State;
type InitializeAction = {
  type: ActionType.INITIALIZE;
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  }
};
type SignInAction = {
  type: ActionType.SIGNIN;
  payload: {
    user: User;
  }
};
type SignOutAction = {
  type: ActionType.SIGNOUT;
};
const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
}
const handlers: Record<ActionType, Handler> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    }
  },
  SIGN_IN: (state: State, action: SignInAction): State => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user,
    }
  },
  SIGN_OUT: (state: State): State => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    }
  },
}
export interface AuthContextType extends State {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve()
});
interface AuthProviderProps {
  children: ReactNode;
}
type Action = InitializeAction | SignInAction | SignOutAction;
const reducer = (state: State, action: Action): State => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);
export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialize = useCallback(async (): Promise<void> => {
    try {
      const accessToken = globalThis.localStorage.getItem("ACCESS_TOKEN");
      const user = globalThis.localStorage.getItem("USER");
      if (accessToken && user) {
        // Verify if token expired
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user: JSON.parse(user)
          }
        });
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    } catch (e) {
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  }, [dispatch]);
  useEffect(() => {
    initialize();
  }, []);
  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    const authResponse = await fetch("https://api.escuelajs.co/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email, password})
    });
    const tokenRes = await authResponse.json();
    globalThis.localStorage.setItem("ACCESS_TOKEN", tokenRes.access_token);
    globalThis.localStorage.setItem("USER", JSON.stringify({
      "id": "1",
      "email": "john@mail.com",
      "password": "changeme",
      "name": "Jhon",
      "role": "customer"
    }));
    dispatch({
      type: ActionType.SIGNIN,
      payload: {
        user: {
          "id": "1",
          "email": "john@mail.com",
          "password": "changeme",
          "name": "Jhon",
          "role": "customer"
        }
      }
    });
  }, [dispatch]);
  const signOut = useCallback(async (): Promise<void> => {
    globalThis.localStorage.removeItem("ACCESS_TOKEN");
    globalThis.localStorage.removeItem("USER");
    dispatch({
      type: ActionType.SIGNOUT,
    });
  }, [dispatch]);
  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const AuthConsumer = AuthContext.Consumer;