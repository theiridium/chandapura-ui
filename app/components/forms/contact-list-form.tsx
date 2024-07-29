import { getPublicApiResponse, postRequestApi, putRequestApi } from '@/lib/interceptor';
import { ContactList } from '@/lib/typings/dto';
import { DropdownList } from '@/public/shared/app.config';
import { Autocomplete, AutocompleteItem, Input } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'

const ContactListForm = ({ user, contactId, selectedKey }: any) => {
    const [txtAutoComplete, setTxtAutoComplete] = useState("");
    const [savedContact, setSavedContact] = useState<ContactList | any>(null);
    const [contact, setContact] = useState<ContactList | any>(null);
    const [txtContactDisabled, setTxtContactDisabled] = useState(true);
    const [contactList, setContactList] = useState<ContactList[]>([]);
    const [isEdit, setIsEdit] = useState(false);
    const getContactList = async () => {
        const attrContact = DropdownList.ContactList.api;
        let apiUrlContact = `${attrContact.base}?sort=${attrContact.sort}&${attrContact.filter}=${user?.email}`
        const response = await getPublicApiResponse(apiUrlContact);
        setContactList(response.data);
    }
    useEffect(() => {
        getContactList();
        if (selectedKey) onContactChange(selectedKey);
    }, [selectedKey])
    const onContactChange = (id: any) => {
        let selectedContact: ContactList | any = id ? contactList.filter((x: any) => x.id == id)[0] : null;
        if (selectedContact) {
            setSavedContact(selectedContact);
            setContact(selectedContact);
            contactId(selectedContact.id);
        }
    }
    const handleFormChange = (e: any) => {
        setContact((prevState: any) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }
    const onAddNew = () => {
        setTxtContactDisabled(false);
        setContact(null);
        setSavedContact(null);
        setTxtAutoComplete("");
    }
    const onCancel = () => {
        setContact(savedContact);
        setTxtContactDisabled(true);
        setIsEdit(false);
    }
    const onSave = async () => {
        const attrContact = DropdownList.ContactList.api;
        let apiUrlContact = `${attrContact.base}`
        const payload = {
            ...contact,
            user: user?.id
        }
        let response = null;
        if (isEdit) response = await putRequestApi(apiUrlContact, payload, contact.id);
        else response = await postRequestApi(apiUrlContact, payload);
        console.log(response)
        if (response.data) {
            getContactList();
            setContact(contact);
            setTxtAutoComplete(response.data.full_name)
            setTxtContactDisabled(true);
        }
    }
    const onEdit = () => {
        setIsEdit(true);
        setTxtContactDisabled(false);
    }
    return (
        <>
            <div className="mb-8">
                <Autocomplete
                    variant="flat"
                    defaultItems={contactList}
                    label="Select an existing Contact"
                    onSelectionChange={onContactChange}
                    onInputChange={setTxtAutoComplete}
                    inputValue={txtAutoComplete}
                    defaultSelectedKey={selectedKey}
                >
                    {(item: any) => <AutocompleteItem key={item.id}>{item.full_name}</AutocompleteItem>}
                </Autocomplete>
            </div>
            <div className='mb-6'>
                <Input type="text" name="full_name" variant="flat" label="Full Name" disabled={txtContactDisabled} value={contact?.full_name || ""} onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='mb-6'>
                <Input type="text" name="phone" variant="flat" label="Phone Number" disabled={txtContactDisabled} value={contact?.phone || ""} onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='mb-6'>
                <Input type="text" name="phone_alt" variant="flat" label="Alternate Phone Number (optional)" disabled={txtContactDisabled} value={contact?.phone_alt || ""} onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='mb-6'>
                <Input type="text" name="email_id" variant="flat" label="Email ID" disabled={txtContactDisabled} value={contact?.email_id || ""} onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='mb-6 flex gap-x-3'>
                {(contact && txtContactDisabled) && <button type='button' className='btn-primary w-auto rounded-lg py-2' onClick={() => onEdit()}>Edit</button>}
                {txtContactDisabled && <button type='button' className='btn-primary w-auto rounded-lg py-2' onClick={() => onAddNew()}>Add New</button>}
                {!txtContactDisabled &&
                    <>
                        <button type='button' className='btn-primary w-auto rounded-lg py-2' onClick={() => onSave()}>Save</button>
                        <button type='button' className='btn-primary w-auto rounded-lg py-2' onClick={() => onCancel()}>Cancel</button>
                    </>
                }
            </div>
        </>
    )
}

export default ContactListForm