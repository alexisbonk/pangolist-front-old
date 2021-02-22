import { IonContent, IonPage } from "@ionic/react";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { personCircle } from "ionicons/icons";
import {
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonImg,
  IonAlert,
  IonItem,
  IonLabel,
} from "@ionic/react";
import Forms, { Input } from "../../components/Forms";
import "./style.css";

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [checkPassword, setCheckPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const inputs = React.useMemo<Input[]>(
    () => [
      {
        label: "Name",
        type: "text",
        field: "name",
        value: name,
        onChange: setName,
        messageEmpty: "Please enter a valid name.",
      },
      {
        label: "Email",
        type: "email",
        field: "email",
        value: email,
        onChange: setEmail,
        messageEmpty: "Please enter a valid email.",
      },
      {
        label: "Password",
        type: "password",
        field: "password",
        value: password,
        onChange: setPassword,
        messageEmpty: "Please enter your password.",
      },
      {
        label: "Check password",
        type: "password",
        field: "checkPassword",
        value: checkPassword,
        onChange: setCheckPassword,
        messageEmpty: "Please enter your password again.",
        equality: {
          field: "password",
          message: "Passwords don't match.",
        },
      },
    ],
    [checkPassword, email, name, password]
  );

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding ion-text-center">
        <IonAlert
          isOpen={message !== null}
          onDidDismiss={() => setMessage(null)}
          header={"Error!"}
          message={message || ""}
          buttons={["Dismiss"]}
        />
        <IonCardHeader style={{ marginBottom: "50px" }}>
          <IonCardSubtitle>Don't have an account?</IonCardSubtitle>
          <IonCardTitle>Sign up</IonCardTitle>
        </IonCardHeader>
        <IonImg class="logo" src="assets/logo.png" />
        <Forms
          inputs={inputs}
          submitLabel="SignUp"
          onSubmit={(submitFields) =>
            authContext
              .signUp?.(
                submitFields.name,
                submitFields.email,
                submitFields.password
              )
              .catch(() => {
                setMessage(
                  "An error occured during your account creation, please try again."
                );
              })
          }
        />
        <IonItem routerLink="/login">
          <IonLabel>Login</IonLabel>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Login;
