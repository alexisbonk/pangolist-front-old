import React, { useState } from "react";
import { build, camera, personCircle } from "ionicons/icons";
import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonItem,
  IonPage,
  IonButton,
  IonModal,
  IonImg,
  IonHeader,
  IonTitle,
} from "@ionic/react";

import { useHistory } from "react-router-dom";
import { usePhoto } from "../../hooks/usePhoto";

import { AuthContext } from "../../providers/AuthProvider";
import Forms, { Input } from "../../components/Forms";
import Style from "./style";
import "./style.css";

const ProfileModif: React.FC = () => {
  const { photoB64, takePhoto, getPhotoBlob } = usePhoto();
  const authContext = React.useContext(AuthContext);
  const [name, setName] = useState<string>(authContext?.user?.name!);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  const checkInfos = React.useMemo(
    () => name === authContext?.user?.name && photoB64 === undefined,
    [authContext, name, photoB64]
  );

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
    ],
    [name]
  );
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
            <IonButton
              fill="clear"
              style={Style.camera_pic}
              onClick={() => takePhoto()}
            >
              <IonIcon icon={camera} />
            </IonButton>
          </div>
          <div
            style={{
              position: "absolute",
              display: "inline-flex",
              textAlign: "center",
            }}
          >
            <div
              style={{
                marginTop: "2%",
                marginLeft: "34%",
              }}
            >
              {photoB64 ? (
                <IonButton
                  fill="clear"
                  style={{
                    fontSize: "100%",
                    marginTop: "20px",
                    marginLeft: "-7px",
                    height: "auto",
                  }}
                  onClick={() => takePhoto()}
                >
                  <IonItem style={Style.profile_pic} lines="none">
                    <IonAvatar class="modif-profile-avatar">
                      <img src={photoB64} alt="pp" />
                    </IonAvatar>
                  </IonItem>
                </IonButton>
              ) : (
                <>
                  {authContext.user?.img ? (
                    <IonButton
                      fill="clear"
                      style={{
                        fontSize: "100%",
                        marginTop: "20px",
                        marginLeft: "-7px",
                        height: "auto",
                      }}
                      onClick={() => takePhoto()}
                    >
                      <IonItem style={Style.profile_pic} lines="none">
                        {photoB64 ? (
                          <IonAvatar class="modif-profile-avatar">
                            <img src={photoB64} alt="pp" />
                          </IonAvatar>
                        ) : (
                          <IonAvatar class="modif-profile-avatar">
                            <img
                              src={
                                "https://mobile-hybrid-api.herokuapp.com/upload/user/" +
                                authContext.user?.img
                              }
                              alt="pp"
                            />
                          </IonAvatar>
                        )}
                      </IonItem>
                    </IonButton>
                  ) : (
                    <IonIcon style={Style.profile_picw} icon={personCircle} />
                  )}
                </>
              )}
            </div>
          </div>
          <IonButton
            fill="clear"
            color="light"
            style={Style.top_modif}
            onClick={() => {
              if (checkInfos === false)
                if (showModal) setShowModal(false);
                else setShowModal(true);
              else history.push("/profile");
            }}
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
            height: "80%",
            backgroundColor: "#ffffff",
          }}
        >
          <IonModal isOpen={showModal} cssClass="my-custom-class">
            <div
              style={{
                display: "inline-flex",
                color: "#ffffff",
                textAlign: "center",
              }}
            >
              <p style={{ margin: "2%", marginTop: "10%" }}>
                Your change will not be saved
              </p>
            </div>
            <div
              style={{
                marginLeft: "50px",
                color: "#ffffff",
              }}
            >
              <p>Are you sure?</p>
            </div>
            <div
              style={{
                marginLeft: "10%",
                marginBottom: "40px",
              }}
            >
              <IonButton
                onClick={() => {
                  setShowModal(false);
                  history.push("/profile");
                }}
              >
                Yes
              </IonButton>
              <IonButton
                style={{
                  marginLeft: "20%",
                }}
                onClick={() => setShowModal(false)}
              >
                No
              </IonButton>
            </div>
          </IonModal>
          <IonTitle
            style={{ ...Style.info, marginTop: "32px", marginBottom: "16px" }}
          >
            Modify informations
          </IonTitle>
          <Forms
            inputs={inputs}
            submitLabel="Enregistrer"
            submitDisabled={checkInfos}
            labelStyles={Style.info_title}
            submitStyles={Style.info_submit}
            onSubmit={(submitFields) =>
              authContext
                ?.modify?.(submitFields.name, getPhotoBlob())
                .then(() => history.push("/profile"))
                .catch(console.error)
            }
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfileModif;
