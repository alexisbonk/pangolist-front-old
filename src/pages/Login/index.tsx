import { IonContent, IonPage } from "@ionic/react";
import React, { useState, useContext } from "react";
import { personCircle } from "ionicons/icons";
import {
  IonItem,
  IonLabel,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonImg,
  IonAlert,
} from "@ionic/react";
import { AuthContext } from "../../providers/AuthProvider";
import Forms, { Input } from "../../components/Forms";
import "./style.css";

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const inputs = React.useMemo<Input[]>(
    () => [
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
    ],
    [email, password]
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
        <IonCardHeader style={{ marginBottom: "100px" }}>
          <IonCardSubtitle>Already have an account?</IonCardSubtitle>
          <IonCardTitle>Login</IonCardTitle>
        </IonCardHeader>
        <IonImg class="logo" src="assets/logo.png" />
        <Forms
          inputs={inputs}
          submitLabel="Login"
          onSubmit={(submitFields) =>
            authContext
              .login?.(submitFields.email, submitFields.password)
              .catch(() => {
                setMessage("Auth failure! Please create an account");
              })
          }
        />
        <IonItem routerLink="/signup">
          <IonLabel>Sign up</IonLabel>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Login;
