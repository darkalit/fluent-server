import { faker } from "@faker-js/faker";
import setupTestDB from "../jest/setupTestDB";
import { NewRegisteredUser } from "../user/user.interfaces";
import { User } from "../user";
import { UserStat } from "../userStat";
import request from "supertest";
import app from "../../app";
import httpStatus from "http-status";
import { Token } from "../token";
import Test from "./test.model";

setupTestDB();

describe("Test routes", () => {
  describe("GET /api/tests/{id}", () => {
    let newUser: NewRegisteredUser;
    let userId: string;
    let token: string;
    beforeEach(async () => {
      newUser = {
        name: faker.person.firstName(),
        email: faker.internet.email().toLowerCase(),
        password: "password1",
      };

      const res = await request(app).post("/api/auth/register").send(newUser)
        .expect(httpStatus.CREATED);

      userId = res.body.user.id;

      token = res.body.tokens.access.token;

      await request(app).get(`/api/words/${userId}`).set(
        "Authorization",
        `Bearer ${token}`,
      ).send().expect(
        httpStatus.OK,
      );
    });
    afterAll(async () => {
      await User.deleteMany({});
      await UserStat.deleteMany({});
      await Token.deleteMany({});
      await Test.deleteMany({});
    });

    test("should return 200", async () => {
      await request(app).get(`/api/tests/${userId}`).set(
        "Authorization",
        `Bearer ${token}`,
      ).expect(
        httpStatus.OK,
      );
    });
  });
});
