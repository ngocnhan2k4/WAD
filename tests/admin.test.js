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
    }, 10000);
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
    it("POST /admin/searchproducts", async () => {
        const requestBody = {
            search: "Iphone 17",
            id: 1,
        };
        const response = await request(app)
            .post("/admin/searchproducts")
            .send(requestBody)
            .set("Content-Type", "application/json"); // Đặt header nếu cần
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([27]);
    });
    it("POST /admin/searchproductsallattribute", async () => {
        const requestBody = {
            search: "Iphone 17",
        };
        const data = [
            {
                Images: [
                    {
                        directory_path: "/images/products/1732900861025.png",
                        ordinal_numbers: 1,
                        product_id: 27,
                    },
                    {
                        directory_path: "/images/products/1732900861029.jpg",
                        ordinal_numbers: 2,
                        product_id: 27,
                    },
                ],
                category_id: 7,
                creation_time: "2024-11-29T17:21:01.671Z",
                current_price: 9998,
                description:
                    "Apple iPhone 17 smartphone. Announced Sep 2023. Features 6.1″ display, Apple A16 Bionic chipset, 3349 mAh battery, 512 GB storage, 6 GB RAM, Ceramic Shield",
                manufacturer: 8,
                original_price: 9998,
                product_id: 27,
                product_name: "Iphone 17",
                stock_quantity: 100,
                total_purchase: 0,
            },
        ];
        const response = await request(app)
            .post("/admin/searchproductsallattribute")
            .send(requestBody)
            .set("Content-Type", "application/json"); // Đặt header nếu cần
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(data);
    });
    it("POST /admin/getproduct/:id", async () => {
        const response = await request(app).get("/admin/getproduct/27");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
            status: "success",
            product: {
                Images: [
                    {
                        directory_path: "/images/products/1732900861025.png",
                        ordinal_numbers: 1,
                        product_id: 27,
                    },
                    {
                        directory_path: "/images/products/1732900861029.jpg",
                        ordinal_numbers: 2,
                        product_id: 27,
                    },
                ],
                Categories: {
                    category_id: 7,
                    category_name: "Bathroom Essentials",
                },
                Suppliers: {
                    brand: "OutdoorLiving",
                    supplier_id: 8,
                },
                category_id: 7,
                creation_time: "2024-11-29T17:21:01.671Z",
                current_price: 9998,
                description:
                    "Apple iPhone 17 smartphone. Announced Sep 2023. Features 6.1″ display, Apple A16 Bionic chipset, 3349 mAh battery, 512 GB storage, 6 GB RAM, Ceramic Shield",
                manufacturer: 8,
                original_price: 9998,
                product_id: 27,
                product_name: "Iphone 17",
                stock_quantity: 100,
                total_purchase: 0,
            },
        });
    });
});
