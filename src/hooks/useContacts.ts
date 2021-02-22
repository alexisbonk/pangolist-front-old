import { useState, useCallback, useMemo } from "react";
import { Plugins } from "@capacitor/core";
import { usePlatform } from "@capacitor-community/react-hooks/platform";
import { Contact } from "@capacitor-community/contacts";

interface ContactsState {
  contacts: Contact[];
  isLoaded: boolean;
}

interface UseContactsRet {
  contacts: Contact[];
  requestContacts(): Promise<void>;
}

export const useContacts = (): UseContactsRet => {
  const [{ contacts, isLoaded }, setContactsState] = useState<ContactsState>({
    contacts: [],
    isLoaded: false,
  });
  const { platform } = usePlatform();

  const requestContacts = useCallback((): Promise<void> => {
    if (isLoaded) {
      return Promise.resolve();
    }

    const { Contacts } = Plugins;

    return (platform === "android"
      ? Contacts.getPermissions().then(({ granted }) => granted ? Contacts.getContacts() : { contacts: [] })
      : Contacts.getContacts()
    ).then(({ contacts }) =>
      setContactsState({
        contacts:
          contacts.sort(
            (a: Contact, b: Contact) =>
              a.displayName?.localeCompare(b.displayName || "") || -1
          ) || [],
        isLoaded: true,
      })
    );
  }, [isLoaded, platform]);

  return useMemo(() => ({ contacts, requestContacts }), [
    contacts,
    requestContacts,
  ]);
};
