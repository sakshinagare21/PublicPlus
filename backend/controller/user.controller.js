/*Create User (Register Citizen)
Login User
Get Profile
Update Profile
Update Location
Update Trust Metrics (system use)
Add Device
Update Notification Settings
Get User Reports
Admin Get All Users
Admin Block / Suspend User
Delete User (Soft Delete)
*/

import User from "../models/user.model.js";
import admin from "../config/firebase.js";

// Helper function to calculate age from DOB
const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};


/* ================= FIREBASE LOGIN ================= */

export const firebaseLogin = async (req, res) => {
    try {

        const { uid, email, name, picture } = req.firebaseUser;

        let user = await User.findOne({ firebaseUID: uid });

        // 🔥 If user exists but was deleted → restore account
        if (user && user.accountStatus === "deleted") {

            user.accountStatus = "active";
            user.lastLogin = new Date();

            await user.save();

            return res.json(user);
        }

        // If user doesn't exist → create new
        if (!user) {
            user = await User.create({
                firebaseUID: uid,
                email: email,
                fullName: name || "New User",
                profilePhoto: picture || "",
                accountStatus: "active"
            });
        }

        user.lastLogin = new Date();
        user.loginHistory.push({
            ipAddress: req.ip,
            deviceInfo: req.headers["user-agent"],
            loginTime: new Date(),
        });

        await user.save();

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= CREATE PROFILE ================= */

export const createProfile = async (req, res) => {
    try {

        const { uid, email } = req.firebaseUser;
        const { dob } = req.body;
        
        let age = 0;
        if (dob) {
            age = calculateAge(dob);
        }

        if (age > 0 && age <= 15) {
            return res.status(400).json({
                message: "Citizens must be older than 15 years to register on PublicPlus."
            });
        }

        let user = await User.findOne({ email });

        // If user exists but firebase account was deleted → restore
        if (user && user.firebaseUID !== uid) {

            user.firebaseUID = uid;
            user.accountStatus = "active";
            user.fullName = req.body.name;
            user.phoneNumber = req.body.mobile;
            user.dateOfBirth = req.body.dob;
            user.age = req.body.age;
            user.gender = req.body.gender;

            user.homeLocation = {
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                address: req.body.address
            };

            await user.save();

            return res.json({
                message: "Account restored successfully",
                user
            });
        }

        if (user) {
            return res.status(400).json({
                message: "Profile already exists"
            });
        }

        // create new user
        user = await User.create({
            firebaseUID: uid,
            email,
            fullName: req.body.name,
            phoneNumber: req.body.mobile,
            dateOfBirth: req.body.dob,
            age: age,
            gender: req.body.gender,
            homeLocation: {
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                address: req.body.address
            }
        });

        res.status(201).json({
            message: "Profile created successfully",
            user
        });

    } catch (error) {
        console.error("Create Profile Error:", error);
        res.status(500).json({ message: error.message });
    }
};
/* ================= GET PROFILE ================= */

export const getUserProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select("-passwordHash");

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= UPDATE PROFILE ================= */

export const updateUserProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        user.fullName = req.body.fullName || user.fullName;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.profilePhoto = req.body.profilePhoto || user.profilePhoto;

        await user.save();

        res.json({
            message: "Profile updated",
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= UPDATE LOCATION ================= */

export const updateLocation = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        user.homeLocation = {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            address: req.body.address
        };

        await user.save();

        res.json({ message: "Location updated" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= DEVICE ================= */

export const addDevice = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        user.devices.push({
            deviceId: req.body.deviceId,
            platform: req.body.platform,
            pushToken: req.body.pushToken,
            lastUsed: new Date(),
        });

        await user.save();

        res.json({ message: "Device added" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= NOTIFICATIONS ================= */

export const updateNotificationSettings = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        user.notificationSettings = req.body;

        await user.save();

        res.json({ message: "Notification settings updated" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= TRUST SCORE ================= */

export const updateTrustScore = async (userId, trustData) => {

    const user = await User.findById(userId);

    user.trustMetrics = {
        ...user.trustMetrics,
        ...trustData,
    };

    await user.save();
};


/* ================= USER REPORTS ================= */

export const getUserReports = async (req, res) => {
    try {

        const user = await User.findById(req.user._id)
            .populate("reports");

        res.json(user.reports);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= ADMIN ================= */

export const getAllUsers = async (req, res) => {
    try {

        const users = await User.find().select("-passwordHash");

        res.json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*================= BLOCK USER ================= */
export const blockUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        user.accountStatus = "suspended";

        await user.save();

        res.json({ message: "User suspended" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*
Soft delete user - delete Firebase account
but keep data in MongoDB
*/
export const deleteUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🔥 Delete from Firebase
        await admin.auth().deleteUser(user.firebaseUID);

        // 🔥 Soft delete in MongoDB
        user.accountStatus = "deleted";

        await user.save();

        res.json({
            message: "User deleted successfully (soft delete)"
        });

    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: error.message });
    }
};
