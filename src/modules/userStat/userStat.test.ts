import { faker } from "@faker-js/faker";
import setupTestDB from "../jest/setupTestDB";
import { NewRegisteredUser } from "../user/user.interfaces";
import { User } from "../user";
import { UserStat } from "../userStat";
import request from "supertest";
import app from "../../app";
import httpStatus from "http-status";
import { Theme } from "../theme";
import { randInt } from "../utils/random";
import { Token } from "../token";

setupTestDB();

describe("UserStat routes", () => {
  describe("PUT /api/userstats/{id}/words", () => {
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
    });
    afterAll(async () => {
      await User.deleteMany({});
      await UserStat.deleteMany({});
      await Token.deleteMany({});
    });

    test("should return 200", async () => {
      const body = {
        wordsCount: randInt(1, 10),
      };

      await request(app).put(
        `/api/userstats/${userId}/words`,
      ).set("Authorization", `Bearer ${token}`).send(body)
        .expect(httpStatus.OK);
    });
  });
  describe("PUT /api/userstats/{id}/themes", () => {
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
    });
    afterAll(async () => {
      await User.deleteMany({});
      await UserStat.deleteMany({});
      await Token.deleteMany({});
    });

    test("should return 200 if theme in collection", async () => {
      const theme = await Theme.findOne({});

      const body = {
        // @ts-expect-error
        themes: [theme.id],
      };

      await request(app).put(
        `/api/userstats/${userId}/themes`,
      ).set("Authorization", `Bearer ${token}`).send(body)
        .expect(httpStatus.OK);
    });
  });
});
