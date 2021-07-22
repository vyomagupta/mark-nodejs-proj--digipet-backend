"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const model_1 = require("../digipet/model");
const server_1 = __importDefault(require("../server"));
describe("GIVEN that the user does not have a digipet the server responds with a message informing them that they don't have a digipet and suggesting that they try hatching one", () => {
    model_1.setDigipet(undefined);
    test("1st GET /digipet/ignore informs them that they don't currently have a digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.message).toMatch(/don't have/i);
        expect(response.body.digipet).not.toBeDefined();
    }));
});
describe("GIVEN that the user has a digipet with all stats above 10, the server responds with a message confirming that they have ignored their digipet and includes digipet stats that show a decrease in all stats by 10", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 50,
            nutrition: 50,
            discipline: 50,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("discipline", 50);
    }));
    test("1st GET /digipet/ignore informs them about the ignore and reduces all stats by 10", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 40);
        expect(response.body.digipet).toHaveProperty("nutrition", 40);
        expect(response.body.digipet).toHaveProperty("happiness", 40);
    }));
    test("2nd GET /digipet/ignore reduces all stats by 10", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 30);
        expect(response.body.digipet).toHaveProperty("nutrition", 30);
        expect(response.body.digipet).toHaveProperty("happiness", 30);
    }));
    test("3rd GET /digipet/ignore reduces all stats by 10", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 20);
        expect(response.body.digipet).toHaveProperty("nutrition", 20);
        expect(response.body.digipet).toHaveProperty("happiness", 20);
    }));
    test("4th GET /digipet/ignore reduces all stats by 10", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 10);
        expect(response.body.digipet).toHaveProperty("nutrition", 10);
        expect(response.body.digipet).toHaveProperty("happiness", 10);
    }));
});
describe("GIVEN that the user has a digipet with some stats below 10 the server responds with a message confirming that they have ignored their digipet and includes digipet stats that have decreased by 10 down to a possible floor of 0", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 30,
            nutrition: 15,
            discipline: 8,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("1st GET /digipet/ignore reduces all stats by 10, discipline bottoms out at 0", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 0);
        expect(response.body.digipet).toHaveProperty("nutrition", 5);
        expect(response.body.digipet).toHaveProperty("happiness", 20);
    }));
    test("2nd GET /digipet/ignore reduces all stats by 10 if above 10, discipline & nutrition bottom out at 0", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 0);
        expect(response.body.digipet).toHaveProperty("nutrition", 0);
        expect(response.body.digipet).toHaveProperty("happiness", 10);
    }));
    test("3rd GET /digipet/ignore reduces all stats by 10 if above 10, all stats bottom out at 0", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 0);
        expect(response.body.digipet).toHaveProperty("nutrition", 0);
        expect(response.body.digipet).toHaveProperty("happiness", 0);
    }));
});
