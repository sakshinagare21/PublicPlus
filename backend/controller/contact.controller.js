import Contact from "../models/contact.model.js";
import { sgMail } from "../utils/email.js";
import dotenv from "dotenv";
dotenv.config();

export const submitContactForm = async (req, res) => {
 try {
 const { name, email, subject, message } = req.body;

 if (!name || !email || !subject || !message) {
 return res.status(400).json({ message: "All fields are required" });
 }

 // Save to database
 const newContact = new Contact({
 name,
 email,
 subject,
 message,
 });
 await newContact.save();

 // Send email to Admin
 const mailOptions = {
 from: process.env.EMAIL,
 to: process.env.ADMIN_EMAIL,
 subject: `New Contact Inquiry: ${subject}`,
 html: `
 <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
 <h2 style="color: #2563eb;">New Contact Inquiry</h2>
 <p><strong>Name:</strong> ${name}</p>
 <p><strong>Email:</strong> ${email}</p>
 <p><strong>Subject:</strong> ${subject}</p>
 <p><strong>Message:</strong></p>
 <div style="background: #f9fafb; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb;">
 ${message}
 </div>
 <hr style="margin-top: 20px; border: 0; border-top: 1px solid #eee;">
 <p style="font-size: 12px; color: #6b7280;">Sent via PublicPlus Contact Form</p>
 </div>
 `,
 };

 await sgMail.send(mailOptions);

 res.status(201).json({
 success: true,
 message: "Your message has been sent successfully!",
 });
 } catch (error) {
 console.error("Contact Form Error:", error);
 res.status(500).json({ message: "Error submitting contact form" });
 }
};

export const getAllInquiries = async (req, res) => {
 try {
 const inquiries = await Contact.find().sort({ createdAt: -1 });
 res.status(200).json(inquiries);
 } catch (error) {
 res.status(500).json({ message: "Error fetching inquiries" });
 }
};

