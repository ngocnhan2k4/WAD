const request = require("supertest");
const express = require("express");
const router = require("../src/app/product/route");
const app = express();

app.use(express.json());
app.use("/product", router);

jest.mock("../src/app/product/controller", () => ({
    getAllProducts: (req, res) => res.status(200).json({ message: "ok" }),
    getProductDetail: (req, res) => res.status(200).json({ message: "ok" }),
    addReview: (req, res) => res.status(200).json({ message: "ok" }),
}));

describe("Test product route", () => {
    it("GET /product", async () => {
        const response = await request(app).get("/product");
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("ok");
    });

    it("GET /product/productDetail", async () => {
        const response = await request(app).get("/product/productDetail");
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("ok");
    });

    it("POST /product/api/review/add", async () => {
        const requestBody = { review: "good good" };
        const response = await request(app)
            .post("/product/api/review/add")
            .send(requestBody)
            .set("Content-Type", "application/json");
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("ok");
    });
});