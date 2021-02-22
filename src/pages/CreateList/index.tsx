import React, { useState } from "react";
import { menu, camera, personCircle, squareOutline } from "ionicons/icons";
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

import { usePhoto } from "../../hooks/usePhoto";
import { useGeolocation } from "../../hooks/useGeolocation";
import Forms, { Input, CallbackTypeCallback } from "../../components/Forms";

import { AuthContext } from "../../providers/AuthProvider";
import API from '../../services/API';
import { ListInterface } from '../../config/interfaces';
import Style from "./style";
import "./style.css";
import { useHistory } from "react-router";
import AutoComplete from "../../components/AutoComplete";

const Create: React.FC = () => {
  const { photoB64, takePhoto, getPhotoBlob } = usePhoto();
  const [title, setTitle] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const authContext = React.useContext(AuthContext);
  const { geolocation, requestGeolocation } = useGeolocation();
  const history = useHistory();

  const onSubmit = React.useCallback((form) => {
    if (!photoB64) {
      alert('A photo is required.');
      return ;
    }
    if (geolocation) {
      form.location = `${geolocation.latitude}_${geolocation.longitude}`;
    }
    API.post<ListInterface>('/lists', form).then(({ data: { id } }) => {
      const formData = new FormData();
      const img = getPhotoBlob()!;

      formData.append("img", img,`list-${id}-${Date.now()}.${img.type.split("/")[1]}`);

      return API.put<ListInterface>(`/lists/${id}`, formData);
    })
    .then(({ data: { id } }) => history.push(`/list/${id}`))
    .catch(console.error);
  }, [photoB64, geolocation, getPhotoBlob, history]);

  const onSubmitExistingList = React.useCallback((form) => {
    API.post<ListInterface>(`/lists/${form.code}/addUser/${authContext.user!.id}`)
    .then(({ data: { id } }) => history.push(`/list/${id}`))
    .catch(console.error);
  }, [authContext.user, history]);

  React.useEffect(() => {
    requestGeolocation();
  }, [requestGeolocation]);

  const addInputs = React.useMemo<Input[]>(
    () => [
      {
        label: "Code",
        type: "text",
        field: "code",
        value: code,
        onChange: setCode,
        messageEmpty: "Please enter a valid code.",
        placeholder: "601e6421fdbb5d001563b833",
      },
    ],
    [code]
  );

  const inputs = React.useMemo<Input[]>(
    () => {
      const tmp : Input[] = [
      {
        label: "Title",
        type: "text",
        field: "title",
        value: title,
        onChange: setTitle,
        messageEmpty: "Please enter a valid title.",
        placeholder: "List name",
      },
      {
        label: "Description",
        type: "textarea",
        field: "description",
        value: description,
        onChange: setDescription,
        messageEmpty: "Please enter a valid description.",
        placeholder: "List description",
      },
    ];

    if (!geolocation) {
      tmp.push({
        label: "Location",
        type: (label: string, value: string, onChange: CallbackTypeCallback) => <AutoComplete onComplete={onChange} />,
        field: "location",
        value: location,
        onChange: setLocation,
        messageEmpty: "Please enter a valid location.",
      });
    }
    return tmp;
  },
    [description, geolocation, location, title]
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
          </div>
          <IonButton
            fill="clear"
            color="light"
            style={Style.top_menu}
            onClick={async () => await menuController.toggle()}
          >
            <IonIcon icon={menu} />
          </IonButton>
          <IonImg src={"https://i.postimg.cc/8zpfPc6G/test.png"} style={{}} />
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
        />
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
              <IonCol>
                <IonText style={Style.info}>Add an existing list</IonText>
                <Forms
                  inputs={addInputs}
                  submitColor={"secondary"}
                  submitLabel="Add"
                  inputContainerStyles={{ marginBottom: "16px" }}
                  onSubmit={onSubmitExistingList}
                />
                <div className="ion-text-center" style={{}}>
                  <IonText>OR</IonText>
                </div>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol
                size="12"
                style={{
                  marginTop: "5%",
                }}
              >
                <IonText style={Style.info}>Create a list</IonText>
                {photoB64 ? (
                  <IonImg
                    src={photoB64}
                    style={{
                      width: "30%",
                      marginLeft: "10%",
                      marginTop: "10%",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      marginLeft: "10%",
                    }}
                  >
                    <div>
                      <IonIcon
                        style={Style.square_outline}
                        icon={squareOutline}
                      />
                    </div>
                    <div
                      style={{
                        marginTop: "-85px",
                        marginLeft: "-23px",
                        position: "absolute",
                      }}
                    >
                      <IonButton
                        fill="clear"
                        color="secondary"
                        style={Style.camera_pic}
                        onClick={() => takePhoto()}
                      >
                        <IonIcon icon={camera} />
                      </IonButton>
                    </div>
                  </div>
                )}
                <Forms
                  inputs={inputs}
                  submitColor={"secondary"}
                  submitLabel="Create"
                  inputContainerStyles={{ marginBottom: "16px" }}
                  onSubmit={onSubmit}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Create;
