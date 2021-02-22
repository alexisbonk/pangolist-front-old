import React from "react";
import { Redirect, Route } from "react-router-dom";

import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Login from "../pages/Login";
import Signup from "../pages/Signup";

const NotAuthRouter : React.FC = () => (
    <IonReactRouter>
        <IonRouterOutlet>
        <Route path="/login" component={Login} exact={true} />
        <Route path="/signup" component={Signup} exact={true} />
        <Redirect to="/login" />
        </IonRouterOutlet>
    </IonReactRouter>
);

NotAuthRouter.propTypes = {};

export default NotAuthRouter;