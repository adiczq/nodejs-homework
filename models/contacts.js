import * as path from "path";
import { readFile, writeFile } from "fs/promises";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("./models", "contacts.json");

const getContacts = async () => {
  try {
    const contactsJson = await readFile(contactsPath);
    const contacts = JSON.parse(contactsJson);
    return contacts;
  } catch (err) {
    console.error("Error reading contacts from file:", err);
    throw err;
  }
};

const setContacts = async (data) => {
  try {
    await writeFile(contactsPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writinf contacts to file: ", err);
    throw err;
  }
};

export const listContacts = async () => {
  try {
    return await getContacts();
  } catch (err) {
    console.error("Error getting contacts list: ", err);
    throw err;
  }
};

export const getContactById = async (contactId) => {
  try {
    const contacts = await getContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact;
  } catch (err) {
    console.error(`Error getting contact with id: ${contactId}`, err);
    throw err;
  }
};

export const removeContact = async (contactId) => {
  try {
    const contacts = await getContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    if (!contact) {
      console.log(`COntact with id: ${contactId} notfound`);
      return false;
    }
    const newList = contacts.filter((contact) => contact.id !== contactId);
    await setContacts(newList);
    console.log(`Contact removed`);
    return true;
  } catch (err) {
    console.error(`Error removing contact with id: ${contactId}`, err);
    throw err;
  }
};

export const addContact = async (body) => {
  try {
    const contacts = await getContacts();
    const { name, email, phone } = body;
    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await setContacts(contacts);
    console.log(`Contact added`);
    return newContact;
  } catch (err) {
    console.error(`Error adding contact `, err);
    throw err;
  }
};

export const updateContact = async (contactId, body) => {
  try {
    const contacts = await getContacts();
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (contactIndex === -1) {
      console.log(`Ther's no contact`);
      return false;
    }
    const contact = contacts[contactIndex];
    const updateContact = { ...contact, ...body };
    contacts[contactIndex] = updateContact;
    await setContacts(contacts);
    console.log(`Contact updated`);
    return updateContact;
  } catch (err) {
    console.error(`Error updating contact `, err);
    throw err;
  }
};
