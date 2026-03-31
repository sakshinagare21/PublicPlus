import express from "express";
import { submitContactForm, getAllInquiries } from "../controller/contact.controller.js";

const router = express.Router();

router.post("/submit", submitContactForm);
router.get("/all", getAllInquiries);

export default router;
