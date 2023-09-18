import Contact from "../services/schemas/contacts.js";

export const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (err) {
    console.error("Error getting contacts list: ", err);
    throw err;
  }
};

export const getContactById = async (contactId) => {
  try {
    return await Contact.findOne({ _id: contactId });
  } catch (err) {
    console.error(`Error getting contact with id: ${contactId}`, err);
    throw err;
  }
};

export const removeContact = async (contactId) => {
  try {
    return await Contact.findByIdAndRemove({ _id: contactId });
  } catch (err) {
    console.error(`Error removing contact with id: ${contactId}`, err);
    throw err;
  }
};

export const addContact = async (body) => {
  try {
    return await Contact.create(body);
  } catch (err) {
    console.error(`Error adding contact `, err);
    throw err;
  }
};

export const updateContact = async (contactId, body) => {
  try {
    return await Contact.findByIdAndUpdate(
      { _id: contactId },
      { $set: { favorite: favorite } },
      { new: true }
    );
  } catch (err) {
    console.error(`Error updating contact `, err);
    throw err;
  }
};

export const updatedStatusContact = async (contactId, favorite) => {
  try {
    return await Contact.findByIdAndUpdate(
      { _id: contactId },
      { $set: { favorite: favorite } },
      { new: true }
    );
  } catch (err) {
    console.error("An error occurred while updating contact: ", err);
    throw err;
  }
};
