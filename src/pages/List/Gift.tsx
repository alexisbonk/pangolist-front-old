import React, { useState } from "react";
import { arrowDownCircleOutline, arrowUpCircleOutline } from "ionicons/icons";
import {
  IonAvatar,
  IonProgressBar,
  IonIcon,
  IonItem,
  IonText,
  IonButton,
  IonImg,
  IonModal,
} from "@ionic/react";

import Style from "./style";
import { GiftInterface } from "../../config/interfaces";
import API from "../../services/API";
import Forms, { Input } from "../../components/Forms";

const Gift = ({
  gift: { id, img, title, price, currentPrice, contributors },
  updateGift,
}: {
  gift: GiftInterface;
  updateGift(gift: GiftInterface): void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const fullpathImgGift = `https://mobile-hybrid-api.herokuapp.com/upload/gift/${img}`;
  const [amount, setAmount] = React.useState<number>(0);
  const amountMissing = React.useMemo(() => price - currentPrice, [
    price,
    currentPrice,
  ]);
  const amountReachPercent = React.useMemo(() => currentPrice / price, [
    price,
    currentPrice,
  ]);

  const addCollabo = React.useCallback(
    (amount: number) => {
      API.post<GiftInterface>(`/gifts/${id}/addContributor`, { amount })
        .then(({ data }) => {
          updateGift(data);
          setShowModal(false);
        })
        .catch(() => undefined);
    },
    [id, updateGift]
  );

  const inputs: Input[] = React.useMemo(
    () => [
      {
        label: "amount",
        type: "number",
        value: amount,
        onChange: setAmount,
        field: "amount",
        messageEmpty: "Please enter a valid amount.",
        excludeValues: [0],
        excludeValuesMessage: "Please, the amount mustn't be zero.",
        max: amountMissing,
      },
    ],
    [amount, amountMissing]
  );

  return !isOpen ? (
    <>
      <div style={Style.close}>
        <div style={{ display: "flex", width: "90%", marginLeft: "5%" }}>
          <div style={{ width: "30%" }}>
            <IonImg class="img" src={fullpathImgGift} />
          </div>
          <div style={{ display: "block", width: "60%" }}>
            <div style={Style.box_container}>
              <IonText style={Style.info_content}>{title}</IonText>
            </div>
            <div style={Style.box_container}>
              <IonText style={Style.info_content}>{price}€</IonText>
            </div>
          </div>
          <IonButton
            fill="clear"
            color="secondary"
            onClick={() => setIsOpen(true)}
          >
            <IonIcon icon={arrowDownCircleOutline} />
          </IonButton>
        </div>
      </div>
      <IonProgressBar
        style={Style.progress_bar}
        color="secondary"
        value={amountReachPercent}
        buffer={amountReachPercent}
      />
    </>
  ) : (
    <>
      <IonModal isOpen={showModal} cssClass="my-custom-modal">
        <div className="ion-text-center" style={{ color: "#000000" }}>
          <p style={{ margin: "2%", marginTop: "10%" }}>
            Contribute to the gift
          </p>
        </div>
        <Forms
          inputs={inputs}
          submitLabel="Pay"
          submitStyles={Style.button}
          inputContainerStyles={{}}
          submitColor="secondary"
          onSubmit={({ amount }: any) => addCollabo(amount)}
        />
        <IonButton style={{}} onClick={() => setShowModal(false)}>
          Cancel
        </IonButton>
      </IonModal>
      <div style={Style.open}>
        <div style={{ ...Style.info_container2, textAlign: "center" }}>
          <IonText style={Style.info_content2}>Playstation 5</IonText>
        </div>
        <div style={{ display: "flex", width: "90%", marginLeft: "5%" }}>
          <div style={{ width: "70%" }}>
            <IonImg class="img" src={fullpathImgGift} />
          </div>
          <div style={{ display: "row", width: "40%" }}>
            <div style={Style.info_container}>
              <IonText style={Style.info_content}>{price} €</IonText>
            </div>
            <div style={{ display: "flex" }}>
              {contributors.map(({ id, user: { img } }, i) => {
                if (i < 3)
                  return (
                    <IonItem
                      key={`${i}-${id}`}
                      style={Style.profile_picz}
                      lines="none"
                    >
                      <IonAvatar class="profile-avatar-collabo">
                        <img
                          style={{ width: "60%", height: "60%" }}
                          src={
                            img
                              ? `https://mobile-hybrid-api.herokuapp.com/upload/user/${img}`
                              : "https://www.sortiraparis.com/images/58/77153/452669-un-poney-club-gratuit-au-carre-senart.jpg"
                          }
                          alt="pp"
                        />
                      </IonAvatar>
                    </IonItem>
                  );
                else return null;
              })}
            </div>
            <IonButton
              fill="clear"
              color="secondary"
              style={{ marginTop: "-5%" }}
              onClick={() => {
                if (showModal) setShowModal(false);
                else setShowModal(true);
              }}
            >
              Contribute
            </IonButton>
          </div>
          <IonButton
            fill="clear"
            color="secondary"
            onClick={() => setIsOpen(false)}
          >
            <IonIcon icon={arrowUpCircleOutline} />
          </IonButton>
        </div>
      </div>
      <IonProgressBar
        style={Style.progress_bar}
        color="secondary"
        value={amountReachPercent}
        buffer={amountReachPercent}
      />
    </>
  );
};

export default Gift;
