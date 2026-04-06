// export const registerCitizen = async (form) => {
// const payload = {
// fullName: form.name,
// email: form.email,
// phoneNumber: form.mobile,
// password: form.password,
// latitude: form.latitude,
// longitude: form.longitude,
// };

// const response = await fetch("http://localhost:5000/api/users/register", {
// method: "POST",
// headers: {
// "Content-Type": "application/json",
// },
// body: JSON.stringify(payload),
// });

// return response.json();
// };

// export const loginCitizen = async (form) => {
// const response = await fetch("http://localhost:5000/api/users/login", {
// method: "POST",
// headers: {
// "Content-Type": "application/json",
// },
// body: JSON.stringify({
// email: form.email,
// password: form.password,
// }),
// });

// const data = await response.json();

// if (!response.ok) {
// throw new Error(data.message || "Login failed");
// }

// return data;
// };











// export const createUserProfile = async (token, formData) => {

// const response = await fetch("http://localhost:5000/api/users/create-profile", {
// method: "POST",
// headers: {
// "Content-Type": "application/json",
// Authorization: `Bearer ${token}`,
// },
// body: JSON.stringify(formData),
// });

// return response.json();
// };

import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const registerCitizen = async (form) => {

    try {

        // 🔥 Firebase register
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            form.email,
            form.password
        );

        const firebaseUser = userCredential.user;

        const token = await firebaseUser.getIdToken();

        // 🔥 Send data to backend
        const response = await fetch(
            "http://localhost:5000/api/users/create-profile",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: form.name,
                    mobile: form.mobile,
                    dob: form.dob,
                    gender: form.gender,
                    address: form.address,
                    latitude: form.latitude,
                    longitude: form.longitude,
                }),
            }
        );

        const data = await response.json();

        localStorage.setItem("user", JSON.stringify(data.user));

        return data;

    } catch (error) {
        throw new Error(error.message);
    }
};

/*====Login with Firebase + Backend====*/

export const loginCitizen = async (form) => {

    try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            form.email,
            form.password
        );

        const firebaseUser = userCredential.user;

        const token = await firebaseUser.getIdToken();

        const response = await fetch(
            "http://localhost:5000/api/users/login",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        localStorage.setItem("user", JSON.stringify(data));

        return data;

    } catch (error) {
        throw new Error(error.message);
    }
};

