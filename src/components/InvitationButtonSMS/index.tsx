import React from "react";
import PropTypes from 'prop-types';

import { IonContent, IonModal, IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/react';

import { SMS } from "@ionic-native/sms";

import { defaultState, reducer } from './reducer';
import { useContacts } from '../../hooks/useContacts';

import Styles from './styles';
import { PhoneNumber } from "@capacitor-community/contacts";

interface PropsInterface
{
    buttonIcon: string;
    message: string;
}

const InvitationButtonSMS: React.FC<PropsInterface> = ({ buttonIcon, message }) => {
    const [{ showModal, selectedContact }, dispatch] = React.useReducer(reducer, defaultState);
    const { contacts, requestContacts } = useContacts();

    const show = React.useCallback(() => {
        requestContacts().then(() => dispatch({ type: 'OPEN_MODAL' })).catch(() => undefined)
    }, [requestContacts]);
    const hide = React.useCallback(() => dispatch({ type: 'CLOSE_MODAL' }), []);
    const addContact = React.useCallback((contact) => dispatch({ type: 'ADD_CONTACT', contact }), []);
    const removeContact = React.useCallback((contactIndex) => dispatch({ type: 'REMOVE_CONTACT', contactIndex }), [dispatch]);
    const send = React.useCallback(() => {
        SMS.hasPermission()
        .then(() => Promise.all(selectedContact.map((phoneNumber) => SMS.send(phoneNumber, message))))
        .then(hide)
        .catch(console.error);
    }, [hide, message, selectedContact]);

    const convertPhoneNumber = ({ number } : PhoneNumber) : string => number ? number.replace(/\+33/, '0').replace(/\s/g, '') : '';

    const filterPhoneNumber = (phoneNumber : string, index : number, phoneNumbers : string[]) : boolean => {
        if (phoneNumber.length === 0) {
            return false;
        }
        for (let phoneIt = 0; phoneIt < phoneNumbers.length; ++phoneIt) {
            if (phoneNumbers[phoneIt] === phoneNumber) {
                return index === phoneIt;
            }
        }
        return true;
    }

    return (
        <>
            <IonModal isOpen={showModal}>
                <IonContent>
                    <IonList style={Styles.listContacts}>
                        {contacts.map((contact) => (
                            contact.phoneNumbers.map(convertPhoneNumber).filter(filterPhoneNumber).map((phoneNumber : string, i : number) : JSX.Element => {
                                const contactIndex : number = selectedContact.indexOf(phoneNumber);
                                const isSelected : boolean = contactIndex !== -1;

                                return (
                                    <IonItem style={isSelected ? Styles.contactSelected : undefined}  key={`${contact.contactId}-${phoneNumber}`} onClick={isSelected ? () => removeContact(i) : () => addContact(phoneNumber)}>
                                        <IonLabel >
                                            <p>{contact.displayName}</p>
                                            <p>{phoneNumber}</p>
                                        </IonLabel>
                                    </IonItem>
                                );
                            })
                        ))}
                    </IonList>
                    <div slot='fixed' style={Styles.modalButtonContainer as React.CSSProperties}>
                        <IonButton color='danger' style={Styles.modalButtonLeft} onClick={hide}>Annuler</IonButton>
                        <IonButton color='success' style={Styles.modalButtonRight} disabled={selectedContact.length === 0} onClick={send}>Envoyer</IonButton>
                    </div>
                </IonContent>
            </IonModal>
            <IonButton expand="block" class="rounded" style={Styles.buttonSent} onClick={show}>
              <IonIcon style={Styles.buttonSentIcon} icon={buttonIcon} />
            </IonButton>
        </>
    );
};

InvitationButtonSMS.propTypes = {
    buttonIcon: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
};

export default InvitationButtonSMS;