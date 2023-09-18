import express from "express";

import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} from "./../../models/contacts.js";

export const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();

    return res.json({
      status: "success",
      code: 200,
      data: { contacts },
    });
  } catch (err) {
    res.status(500).json(`Error getting the contact list : ${err}`);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await getContactById(id);

    return res.json({
      status: "success",
      code: 200,
      data: { contact },
    });
  } catch (err) {
    res.status(500).json(`Error getting contact: ${err}`);
  }
});

router.post("/", async (req, res, next) => {
  const { body } = req;

  if (Object.keys(body).length === 0) {
    return res.status(400).json("Error, empty request is not allowed");
  }

  try {
    const contact = await addContact(body);

    return res.status(201).json({
      status: "success",
      code: 201,
      data: { contact },
    });
  } catch (err) {
    res.status(500).json(`An error adding the contact: ${err}`);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const isContactRemoved = await removeContact(id);

    return res.status(200).json({
      message: `Contact with ID ${id} removed.`,
    });
  } catch (err) {
    res.status(500).json(`Error removing the contact: ${err}`);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  if (Object.keys(body).length === 0) {
    return res.status(400).json("Error, empty request is not allowed");
  }

  try {
    const updatedContact = await updateContact(id, body);

    return res.json({
      status: "success",
      code: 200,
      data: { updatedContact },
    });
  } catch (err) {
    res.status(500).json(`Error updating the contact: ${err}`);
  }
});

router.patch("/:id", async (req, res, netxt) => {
  const { id } = req.params;
  const { body } = req;
  const { favorite } = body;
  if (!("favorite" in body) || Object.keys(body).length === 0) {
    return res.status(400).json("missing field favorite");
  }
  try {
    const updateStatus = await updateStatusContact(id, favorite);
    return res.json({
      status: "succes",
      code: 200,
      data: { updateStatus },
    });
  } catch (err) {
    res.status(404).json("Not found");
  }
});
