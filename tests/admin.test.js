const request = require("supertest");
const app = require("../src/app");
jest.mock("../src/app/admin/middleware.js", () => (req, res, next) => {
    next();
});
//test

jest.setTimeout(10000);

describe("Test admin route", () => {
    afterAll(() => {
        console.log("Cleanup after tests");
    });
    it("GET /admin/viewaccount", async () => {
        const response = await request(app).get("/admin/viewaccount");
        expect(response.statusCode).toBe(200);
    });
    it("GET /admin/viewaccount/:id", async () => {
        const response = await request(app).get("/admin/viewaccount/1");
        expect(response.statusCode).toBe(200);
    }, 10000);
    it("GET /admin/viewcatemanu", async () => {
        const response = await request(app).get("/admin/viewcatemanu");
        expect(response.statusCode).toBe(200);
    }, 15000);
    it("GET /admin/manu/:id", async () => {
        const response = await request(app).get("/admin/viewmanu/1");
        expect(response.statusCode).toBe(200);
    });
    it("GET /admin/cate/:id", async () => {
        const response = await request(app).get("/admin/viewcate/1");
        expect(response.statusCode).toBe(200);
    });
    it("GET /admin/product", async () => {
        const response = await request(app).get("/admin/product");
        expect(response.statusCode).toBe(200);
    });
    it("GET /admin/vieworder", async () => {
        const response = await request(app).get("/admin/vieworder");
        expect(response.statusCode).toBe(200);
    });
    it("GET /admin/vieworder/:id", async () => {
        const response = await request(app).get("/admin/vieworder/1");
        expect(response.statusCode).toBe(200);
    });
    it("GET /admin/viewrevenue", async () => {
        const response = await request(app).get("/admin/viewrevenue");
        expect(response.statusCode).toBe(200);
    });
    it("GET /admin", async () => {
        const response = await request(app).get("/admin");
        expect(response.statusCode).toBe(200);
    });
    it("POST /admin/countsearch", async () => {
        const requestBody = {
            user_search: "test-rd4fmegzj@srv1.mail-tester.com",
        };
        const response = await request(app)
            .post("/admin/countsearch")
            .send(requestBody)
            .set("Content-Type", "application/json"); // Đặt header nếu cần
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(1);
    });
});
