import React from "react";
import { IonApp } from "@ionic/react";

import AuthProvider, {
  AuthConsumer,
  AuthContextInterface,
} from "./providers/AuthProvider";

import { AuthRouter, NotAuthRouter } from "./routers";

import { Plugins } from "@capacitor/core";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./style.css";

window.screen.orientation.lock("portrait");

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <AuthConsumer>
        {({ isLoading, isLogged }: AuthContextInterface) => {
          const { SplashScreen } = Plugins;

          if (isLoading) {
            SplashScreen.show({ autoHide: false });
            return undefined;
          }
          SplashScreen.hide();
          return isLogged ? <AuthRouter /> : <NotAuthRouter />;
        }}
      </AuthConsumer>
    </AuthProvider>
  </IonApp>
);

export default App;