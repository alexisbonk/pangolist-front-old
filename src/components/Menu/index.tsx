import {
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonAvatar,
  IonItemDivider,
  IonCol,
  IonRow,
  IonGrid,
} from "@ionic/react";
import { menuController } from "@ionic/core";

import React from "react";
import {
  addCircleOutline,
  arrowBackCircleOutline,
  person,
} from "ionicons/icons";
import API from "../../services/API";

interface MyList {
  id: string;
  title: string;
  img?: string;
}

interface ListInvited {
  id: string;
  title: string;
  img?: string;
}

interface ListState {
  my: MyList[];
  invited: ListInvited[];
}

const Menu: React.FC = () => {
  const [{ my, invited }, setLists] = React.useState<ListState>({
    my: [],
    invited: [],
  });
  
  const retrieveLists = React.useCallback(() => (
    Promise.all([
        API.get<MyList[]>("/lists/me"),
        API.get<ListInvited[]>("/lists/whereInvited"),
    ])
    .then(([{ data: dataMyLists }, { data: dataListsInvited }]) =>
        setLists({ my: dataMyLists, invited: dataListsInvited })
    )
    .catch(() => undefined)
  ), []);

  const toggleMenu = React.useCallback(() => menuController.toggle(), []);

  return (
    <IonMenu contentId="content" type="overlay" onIonWillOpen={retrieveLists}>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem onClick={toggleMenu}>
                <IonIcon
                  style={{ color: "#000000", fontSize: "80px" }}
                  icon={arrowBackCircleOutline}
                />
              </IonItem>

              <IonItemDivider />

              <IonList id="inbox-list">
                {my.map(({ id, img }, index) => (
                  <IonMenuToggle key={index} autoHide={false}>
                    <IonItem
                      key={index}
                      lines="none"
                      routerLink={`/list/${id}`}
                      onClick={toggleMenu}
                    >
                      <IonAvatar>
                        <img
                          src={
                            img
                              ? `https://mobile-hybrid-api.herokuapp.com/upload/list/${img}`
                              : "assets/img/gift.png"
                          }
                          alt="myList icon"
                        />
                      </IonAvatar>
                    </IonItem>
                  </IonMenuToggle>
                ))}
                <IonItem
                  routerLink="/createList"
                  onClick={toggleMenu}
                >
                  <IonIcon
                    style={{ color: "#000000", fontSize: "80px" }}
                    icon={addCircleOutline}
                  />
                </IonItem>
              </IonList>

              <IonItemDivider />

              <IonList id="labels-list">
                {invited.map(({ id, img }, index) => (
                  <IonItem
                    key={index}
                    lines="none"
                    routerLink={`/list/${id}`}
                    onClick={toggleMenu}
                  >
                    <IonAvatar>
                      <img
                        src={
                          img
                            ? `https://mobile-hybrid-api.herokuapp.com/upload/list/${img}`
                            : "assets/img/gift.png"
                        }
                        alt="pp"
                      />
                    </IonAvatar>
                  </IonItem>
                ))}
              </IonList>

              <IonItemDivider />

              <IonItem
                routerLink="/profile"
                onClick={toggleMenu}
              >
                <IonIcon
                  style={{ color: "#000000", fontSize: "80px" }}
                  icon={person}
                />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonMenu>
  );
};

Menu.propTypes = {};

export default Menu;
