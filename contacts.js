const { generateKey } = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "db/contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    const contactsList = JSON.parse(data);
    return contactsList;
  } catch (error) {
    throw error.message;
  }
}

async function getContactById(contactId) {
  try {
    const contactsList = await listContacts();
    const contact = await contactsList.find((el) => el.id === +contactId);
    if (!contact) {
      throw new Error(`Contact with id=${contactId} not found`);
    }
    return contact;
  } catch (error) {
    throw error.message;
  }
}

async function removeContact(contactId) {
  try {
    const contactsList = await listContacts();
    const contactIndex = await contactsList.findIndex((el) => el.id === +contactId);

    if (!~contactIndex) {
      throw new Error(`Contact with id=${contactId} not found`);
    }

    const removedContact = await contactsList.splice(contactIndex, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contactsList));

    return removedContact;
  } catch (error) {
    throw error.message;
  }
}
const generateId = (list) => list.reduce((acc, el) => acc + el.id, 0);
async function addContact(name, email, phone) {
  try {
    const contactsList = await listContacts();
    const newContact = { name, email, phone, id: generateId(contactsList) };
    await contactsList.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contactsList));

    return newContact;
  } catch (error) {
    throw error.message;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
