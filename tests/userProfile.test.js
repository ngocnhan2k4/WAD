const request = require("supertest");
const express = require("express");
const router = require("../src/app/userProfile/route");
const app = express();

app.use(express.json());
app.use("/userProfile", router);

jest.mock("../src/app/userProfile/controller", () => ({
    getUserProfile: (req, res) => res.status(200).json({ message: "OK" }),
    updateImage: (req, res) => res.status(200).json({ message: "OK" }),
    updatePassword: (req, res) => res.status(200).json({ message: "OK" }),
    verifyOldPassword: (req, res) => res.status(200).json({ message: "OK" }),
    updateProfile: (req, res) => res.status(200).json({ message: "OK" }),
    updateStatus: (req, res) => res.status(200).json({ message: "OK" }),
}));

describe("Test userProfile route", () => {
    it("GET /userProfile", async () => {
        const response = await request(app).get("/userProfile");
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("OK");
    });

    // it("POST /userProfile/update-avatar", async () => {
    //     const response = await request(app)
    //         .post("/userProfile/update-avatar")
    //         .attach("avatar", path.join(__dirname, "test-avatar.jpg")); // Ensure this file exists
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.message).toBe("Avatar updated successfully");
    // });

    it("POST /userProfile/updatepassword", async () => {
        const requestBody = { oldPassword: "oldPass123", newPassword: "newPass123" };
        const response = await request(app)
            .post("/userProfile/updatepassword")
            .send(requestBody)
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("OK");
    });

    it("POST /userProfile/verifyoldpassword", async () => {
        const requestBody = { oldPassword: "oldPass123" };
        const response = await request(app)
            .post("/userProfile/verifyoldpassword")
            .send(requestBody)
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("OK");
    });

    it("POST /userProfile/updateprofile", async () => {
        const requestBody = { name: "newName", email: "newEmail@gmail.com" };
        const response = await request(app)
            .post("/userProfile/updateprofile")
            .send(requestBody)
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("OK");
    });
    it("POST /userProfile/updatestatus", async () => {
        const requestBody = { newStatus: "newStatus", orderId: "orderId" };
        const response = await request(app)
            .post("/userProfile/updatestatus")
            .send(requestBody)
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("OK");
    });
});