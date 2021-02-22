import React, { ReactNode } from "react";
import PropTypes from "prop-types";
import { AxiosResponse } from "axios";
import API, { access_token, addAuthToken, forget } from "../../services/API";
import { Plugins } from "@capacitor/core";
import { OneSignal } from "@ionic-native/onesignal";

// Reducer
import Reducer, { ReducerDefaultState, AuthState, User } from "./Reducer";

export interface AuthContextInterface extends AuthState {
  isLogged: Boolean;
  signUp?(name: string, email: string, password: string): Promise<void>;
  login?(username: string, password: string): Promise<void>;
  signOut?(): void;
  modify?(name: string, logo: Blob | undefined): Promise<void>;
}

interface SignResponse {
  token: string;
  user: User;
}

export const AuthContext = React.createContext<AuthContextInterface>({
  user: null,
  isLoading: false,
  isLogged: false,
});

export const AuthConsumer = AuthContext.Consumer;

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { Storage } = Plugins;
  const storageTokenKey: string = "token";
  const [state, dispatch] = React.useReducer(Reducer, ReducerDefaultState);

  React.useEffect(() => {
    /* Init OneSignal */
    OneSignal.startInit("9805b45d-00ff-4ee4-b4cb-1da3cfd8a989", "149009597908");
    OneSignal.inFocusDisplaying(OneSignal.OSInFocusDisplayOption.InAppAlert);
    OneSignal.endInit();

    /* Retrive token from Storage */
    Storage.get({ key: storageTokenKey })
      .then(({ value: token }) => {
        if (token === null) {
          throw new Error("no token found !");
        }
        addAuthToken(token);
        return API.get("/users/me");
      })
      .then(({ data: user }) => {
        OneSignal.setExternalUserId(user.id);
        dispatch({ type: "UPDATE_USER", user });
      })
      .catch(() => {
        forget();
        Storage.remove({ key: storageTokenKey });
        OneSignal.removeExternalUserId();
        dispatch({ type: "IS_LOADED" });
      });
  }, [Storage]);

  const authContext = React.useMemo(
    () => ({
      // Attributs
      ...state,
      isLogged: state.user !== null,

      signUp: (name: string, email: string, password: string): Promise<void> =>
        API.post<SignResponse>("/users", { name, email, password }).then(
          ({
            data: { token, user },
          }: AxiosResponse<SignResponse>): Promise<void> => {
            addAuthToken(token);
            OneSignal.setExternalUserId(user.id);
            dispatch({ type: "UPDATE_USER", user });
            return Storage.set({ key: storageTokenKey, value: token });
          }
        ),

      login: (email: string, password: string): Promise<void> =>
        API.post<SignResponse>("/auth", null, {
          auth: { username: email, password },
          params: { access_token },
        }).then(
          ({
            data: { token, user },
          }: AxiosResponse<SignResponse>): Promise<void> => {
            addAuthToken(token);
            OneSignal.setExternalUserId(user.id);
            dispatch({ type: "UPDATE_USER", user });
            return Storage.set({ key: storageTokenKey, value: token });
          }
        ),

      signOut: (): void => {
        Storage.remove({ key: storageTokenKey }).then(() => {
          forget();
          OneSignal.removeExternalUserId();
          dispatch({ type: "FORGET_USER" });
        });
      },

      modify: (name: string, logo: Blob | undefined): Promise<void> => {
        const putRequests = [];
        const path = `/users/${state.user.id}`;

        if (name !== state.user.name) {
          putRequests.push(API.put(path, { name }));
        }
        if (logo !== undefined) {
          const formData = new FormData();

          formData.append(
            "img",
            logo,
            `user-${state.user.id}.${logo.type.split("/")[1]}`
          );
          putRequests.push(API.put(path, formData));
        }

        return Promise.all(putRequests).then((values) => {
          switch (values.length) {
            case 1:
              dispatch({ type: "UPDATE_USER", user: values[0].data });
              break;
            case 2:
              dispatch({
                type: "UPDATE_USER",
                user: { ...values[0].data, img: values[1].data.img },
              });
              break;
            default:
              break;
          }
        });
      },
    }),
    [state, Storage]
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default AuthProvider;
