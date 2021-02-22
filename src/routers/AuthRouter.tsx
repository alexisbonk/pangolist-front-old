import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Menu from "../components/Menu";

import Profile from "../pages/Profile";
import ProfileModif from "../pages/ProfileModif";
import CreateList from "../pages/CreateList";
import CreateGhift from "../pages/CreateGhift";
import List from "../pages/List";

const AuthRouter: React.FC = () => (
  <IonReactRouter >
    <Menu />
    <IonRouterOutlet id="content">
      <Switch>
        <Route path="/createList" component={CreateList} exact={true} />
        <Route path="/createGhift/:listId" component={CreateGhift} exact={true} />
        <Route path="/list/:id" component={List} />
        <Route path="/profile" component={Profile} exact={true} />
        <Route path="/modifProfile" component={ProfileModif} exact={true} />
        <Redirect to="/profile" />
      </Switch>
    </IonRouterOutlet>
  </IonReactRouter>
);

AuthRouter.propTypes = {};

export default AuthRouter;
