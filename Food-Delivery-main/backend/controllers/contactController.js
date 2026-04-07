
import contactModel from "../models/contactModel.js";

// submit contact form
const submitContact = async (req, res) => {
    const { name, email, phone, message } = req.body;
    try {
        const newContact = new contactModel({
            name,
            email,
            phone,
            message
        });

        await newContact.save();

        // Simulated Notification
        console.log(`NEW CONTACT MESSAGE!`);
        console.log(`From: ${name} (${email}, ${phone})`);
        console.log(`Message: ${message}`);
        console.log(`Email notification triggered for amankumarap76677@gmail.com`);
        console.log(`SMS notification triggered for 7667753470`);

        res.json({ success: true, message: "Message submitted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error in message submission" });
    }
}

// get all contact messages (for Admin)
const getContacts = async (req, res) => {
    try {
        const contacts = await contactModel.find({}).sort({ date: -1 });
        res.json({ success: true, data: contacts });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error in fetching messages" });
    }
}

// delete a contact message (for Admin)
const deleteContact = async (req, res) => {
    try {
        const { id } = req.body;
        await contactModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Message deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting message" });
    }
}

export { submitContact, getContacts, deleteContact };
