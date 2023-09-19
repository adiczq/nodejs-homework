import express from "express";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updatedStatusContact,
} from "./../../models/contacts.js";
import { auth } from "../../config/config-pasport.js";

export const contactsRouter = express.Router();

const pagination = (array, page, limit) => {
  const startIndex = (page - 1) * limit;
  return array.slice(startIndex, startIndex + limit);
};

contactsRouter.get("/", auth, async (req, res, next) => {
  try {
    const { id: userID } = req.user;
    const contacts = await listContacts(userID);
    const { page = 1, limit = 20, favorite } = req.query;
    let filterContact = contacts;
    if (favorite === "true") {
      filterContact = contacts.filter((contact) => contact.favorite);
    }
    const paginatedContacts = pagination(filterContact, page, limit);
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { contacts: paginatedContacts },
    });
  } catch (err) {
    res.status(500).json(`Error getting the contact list : ${err}`);
  }
});

contactsRouter.get("/:id", auth, async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: contactId } = req.params;
  try {
    const contact = await getContactById(userId, contactId);
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { contact },
    });
  } catch (err) {
    res.status(500).json(`Error getting contact: ${err}`);
  }
});

contactsRouter.post("/", auth, async (req, res, next) => {
  const body = req.body;
  const { id: userId } = req.user;
  if (Object.keys(body).length === 0) {
    return res.status(400).json("Error, empty request is not allowed");
  }
  try {
    const contact = await addContact(body, userId);
    return res.status(201).json({
      status: "success",
      code: 201,
      data: { contact },
    });
  } catch (err) {
    res.status(500).json(`Error adding the contact: ${err}`);
  }
});

contactsRouter.delete("/:id", auth, async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: contactId } = req.params;
  try {
    await removeContact(contactId, userId);
    return res.status(200).json({
      message: `Contact with ID ${id} removed.`,
    });
  } catch (err) {
    res.status(500).json(`Error removing the contact: ${err}`);
  }
});

contactsRouter.put("/:id", auth, async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: contactId } = req.params;
  const { body } = req;
  if (Object.keys(body).length === 0) {
    return res.status(400).json("Error, empty request is not allowed");
  }
  try {
    const updatedContact = await updateContact(contactId, body, userId);
    return res.json({
      status: "success",
      code: 200,
      data: { updatedContact },
    });
  } catch (err) {
    res.status(500).json(`Error updating the contact: ${err}`);
  }
});

contactsRouter.patch("/:id", auth, async (req, res, netxt) => {
  const { id: userId } = req.user;
  const { id: contactId } = req.params;
  const { body } = req;
  const { favorite } = body;
  if (!("favorite" in body) || Object.keys(body).length === 0) {
    return res.status(400).json("missing field favorite");
  }
  try {
    const updateStatus = await updatedStatusContact(
      contactId,
      favorite,
      userId
    );
    return res.json({
      status: "succes",
      code: 200,
      data: { updateStatus },
    });
  } catch (err) {
    res.status(404).json("Not found");
  }
});
