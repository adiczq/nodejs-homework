import Contact from "../services/schemas/contacts.js";

export const listContacts = async (userId) => {
  try {
    return await Contact.find({ owner: userId });
  } catch (err) {
    console.error("Error getting contacts list: ", err);
    throw err;
  }
};

export const getContactById = async (userId, contactId) => {
  try {
    return await Contact.findOne({ owner: userId, _id: contactId });
  } catch (err) {
    console.error(`Error getting contact with id: ${contactId}`, err);
    throw err;
  }
};

export const removeContact = async (userId, contactId) => {
  try {
    return await Contact.findByIdAndRemove({ owner: userId, _id: contactId });
  } catch (err) {
    console.error(`Error removing contact with id: ${contactId}`, err);
    throw err;
  }
};

export const addContact = async (body, userId) => {
  try {
    const contacts = { ...body, owner: userId };
    return await Contact.create(contacts);
  } catch (err) {
    console.error(`Error adding contact `, err);
    throw err;
  }
};

export const updateContact = async (contactId, body, userId) => {
  try {
    return await Contact.findByIdAndUpdate(
      { owner: userId, _id: contactId },
      body,
      { new: true }
    );
  } catch (err) {
    console.error(`Error updating contact: `, err);
    throw err;
  }
};

export const updatedStatusContact = async (userId, contactId, favorite) => {
  try {
    return await Contact.findByIdAndUpdate(
      { owner: userId, _id: contactId },
      { $set: { favorite: favorite } },
      { new: true }
    );
  } catch (err) {
    console.error("Error updating contact: ", err);
    throw err;
  }
};
