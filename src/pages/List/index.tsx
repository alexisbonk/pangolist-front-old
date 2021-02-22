import React from "react";
import { menu, send, personCircle, addCircleOutline } from "ionicons/icons";
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
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import MapContainer from "../../components/Map";
import InvitationButtonSMS from "../../components/InvitationButtonSMS";

import { GiftInterface, ListInterface } from "../../config/interfaces";
import { AuthContext } from "../../providers/AuthProvider";
import { useParams } from "react-router";
import API from "../../services/API";

import Gift from "./Gift";
import Style from "./style";
import "./style.css";

const MESSAGE_INVITATION = (id: any) => {
  return (
    "You have been invited to a list. Download “Pangolist” app and enter the following code: " +
    id
  );
};

const List: React.FC = () => {
  const params: any = useParams();
  const authContext = React.useContext(AuthContext);

  const [list, setList] = React.useState<ListInterface | null>(null);

  React.useEffect(() => {
    API.get<ListInterface>(`/lists/${params.id}`)
      .then(({ data }) => setList(data))
      .catch(() => undefined);
  }, [params]);

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
                      src={
                        "https://mobile-hybrid-api.herokuapp.com/upload/user/" +
                        authContext.user?.img
                      }
                      alt="pp"
                    />
                  </IonAvatar>
                </IonItem>
              ) : (
                <IonIcon style={Style.profile_picw} icon={personCircle} />
              )}
            </div>
            <IonText style={Style.top_text}>{authContext.user?.name}</IonText>
            <IonText style={Style.top_subtext}>{list?.title}</IonText>
          </div>
          <IonButton
            fill="clear"
            color="light"
            style={Style.top_menu}
            onClick={async () => await menuController.toggle()}
          >
            <IonIcon icon={menu} />
          </IonButton>
          <IonImg
            src={"https://i.postimg.cc/8zpfPc6G/test.png"}
            style={{}}
          ></IonImg>
        </div>
        <div style={{ ...Style.header_end, position: "absolute" }}></div>
      </IonHeader>
      <IonContent>
        <WhatsappShareButton
          color="secondary"
          url={MESSAGE_INVITATION(params.id)}
        >
          <IonButton
            color="success"
            expand="block"
            class="rounded"
            style={Style.share_button}
          >
            <WhatsappIcon />
          </IonButton>
        </WhatsappShareButton>
        <InvitationButtonSMS
          message={MESSAGE_INVITATION(params.id)}
          buttonIcon={send}
        />
        <div style={Style.grid_container}>
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <div style={{ display: "flex" }}>
                  <IonText style={Style.info}>Wish list</IonText>
                  {(list && authContext.user?.id !== list?.creator.id) && <IonButton
                    class="rounded"
                    style={Style.add_button}
                    routerLink={`/createGhift/${params.id}`}
                  >
                    <IonIcon icon={addCircleOutline} />
                  </IonButton>}
                </div>
                {list?.location && ((list.location.split('_').length === 2) ?
                  <div style={Style.map_container}>
                    <MapContainer lat={list.location.split('_')[0]} lng={list.location.split('_')[1]} />
                  </div> :
                  <p>{list.location}</p>)}
                {list?.gifts.map((gift, i, gifts) => (
                  <Gift
                    key={`${i}-${gift.id}`}
                    updateGift={(gift: GiftInterface) => {
                      const giftsCopy = gifts.slice();

                      giftsCopy[i] = gift;
                      setList({ ...list, gifts: giftsCopy });
                    }}
                    gift={gift}
                  />
                ))}
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default List;
