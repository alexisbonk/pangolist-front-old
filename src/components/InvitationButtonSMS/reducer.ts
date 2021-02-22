interface ReducerState
{
    showModal: boolean,
    selectedContact: string[],
}

export const defaultState : ReducerState = {
    showModal: false,
    selectedContact: [],
}

export const reducer = (prevState : ReducerState, action : any) : ReducerState =>
{
    let selectedContact;

    switch (action.type)
    {
        case 'OPEN_MODAL':
            return {
                ...prevState,
                showModal: true,
            };
        case 'CLOSE_MODAL':
            return defaultState;
        case 'ADD_CONTACT':
            return {
                ...prevState,
                selectedContact: [...prevState.selectedContact, action.contact]
            };
        case 'REMOVE_CONTACT':
            selectedContact = prevState.selectedContact.slice();
            selectedContact.splice(action.contactIndex, 1);

            return {
                ...prevState,
                selectedContact,
            };
        default:
            return prevState;
    }
}