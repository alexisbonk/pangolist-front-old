export interface User {
  id: string;
  email: string;
  name: string;
  img: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: Boolean;
}

export const ReducerDefaultState: AuthState = {
  user: null,
  isLoading: true,
};

const Reducer = (prevState: AuthState, action: any) => {
  switch (action.type) {
    case "UPDATE_USER":
      return {
        ...prevState,
        user: prevState.user
          ? { ...prevState.user, ...action.user }
          : action.user,
        isLoading: false,
      };

    case "IS_LOADED":
      return {
        ...prevState,
        isLoading: false,
      };

    case "FORGET_USER":
      return {
        ...prevState,
        user: null,
      };

    default:
      return prevState;
  }
};

export default Reducer;
