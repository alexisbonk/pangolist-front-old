import React from "react";
import { menu, build, personCircle } from "ionicons/icons";
import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonItem,
  IonPage,
  IonText,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonHeader,
} from "@ionic/react";
import { menuController } from "@ionic/core";

import { AuthContext } from "../../providers/AuthProvider";
import Style from "./style";
import "./style.css";

const Profile: React.FC = () => {
  const authContext = React.useContext(AuthContext);
  const logout = () => {
    authContext.signOut?.();
  };
  const createdAt = authContext.user!.createdAt.split("-");

  return (
    <IonPage>
      <IonHeader>
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "100%",
              position: "absolute",
              display: "inline-flex",
              textAlign: "center",
            }}
          >
            <div
              style={{
                marginTop: "5%",
                marginLeft: "37%",
              }}
            >
              {authContext.user?.img ? (
                <IonItem style={Style.profile_pic} lines="none">
                  <IonAvatar class="profile-avatar">
                    <img
                      src={`https://mobile-hybrid-api.herokuapp.com/upload/user/${authContext.user.img}?random=${Math.random()}`}
                      alt="pp"
                    />
                  </IonAvatar>
                </IonItem>
              ) : (
                <IonIcon style={Style.profile_picw} icon={personCircle} />
              )}
            </div>
            <IonText style={Style.top_text}>{authContext.user?.name}</IonText>
            <IonText style={Style.top_subtext}>
              {`Created on ${createdAt[2].split("T")[0]}/${createdAt[1]}/${createdAt[0]}`}
            </IonText>
          </div>
          <IonButton
            fill="clear"
            color="light"
            style={Style.top_menu}
            onClick={async () => await menuController.toggle()}
          >
            <IonIcon icon={menu} />
          </IonButton>
          <IonButton
            fill="clear"
            color="light"
            routerLink="/modifProfile"
            style={Style.top_modif}
          >
            <IonIcon icon={build} />
          </IonButton>
          <IonImg
            src={
              "https://images.theconversation.com/files/369832/original/file-20201117-17-11bpvpq.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=900.0&fit=crop"
            }
            style={{}}
          ></IonImg>
        </div>
        <div
          style={{
            position: "absolute",
            backgroundColor: "#ffffff",
            marginTop: "-50px",
            width: "100%",
            height: "22%",
            borderTopRightRadius: "100%",
            borderTopLeftRadius: "100%",
          }}
        ></div>
      </IonHeader>
      <IonContent>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#ffffff",
          }}
        >
          <IonGrid>
            <IonRow>
              <IonCol size="12" style={{ marginTop: "30px" }}>
                <IonText style={Style.info}>Informations</IonText>
                <div style={Style.info_container}>
                  <IonText style={Style.info_title}>EMAIL</IonText>
                  <br />
                  <br />
                  <IonText style={Style.info_content}>
                    {authContext.user?.email}
                  </IonText>
                </div>
                <div style={Style.info_container}>
                  <IonText style={Style.info_title}>NAME</IonText>
                  <br />
                  <br />
                  <IonText style={Style.info_content}>
                    {authContext.user?.name}
                  </IonText>
                </div>
                <div style={Style.info_container_end}>
                  <IonButton onClick={logout}>Logout</IonButton>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

Profile.propTypes = {};

export default Profile;
