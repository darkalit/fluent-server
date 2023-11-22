import { faker } from "@faker-js/faker";
import setupTestDB from "../jest/setupTestDB";
import { NewRegisteredUser } from "../user/user.interfaces";
import { User } from "../user";
import { UserStat } from "../userStat";
import request from "supertest";
import app from "../../app";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

setupTestDB();

const password = "password1";
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password,
  role: "user",
  auth_type: "standalone",
};

const insertUsers = async (users: Record<string, any>[]) => {
  await User.insertMany(
    users.map((user) => ({ ...user, password: hashedPassword })),
  );
};

describe("Auth routes", () => {
  describe("POST /api/auth/register", () => {
    let newUser: NewRegisteredUser;
    beforeEach(() => {
      newUser = {
        name: faker.person.firstName(),
        email: faker.internet.email().toLowerCase(),
        password: "password1",
      };
    });
    afterEach(async () => {
      await User.deleteMany({});
      await UserStat.deleteMany({});
    });

    test("should return 201 and successfully register user if request data is ok", async () => {
      const res = await request(app).post("/api/auth/register").send(newUser)
        .expect(httpStatus.CREATED);

      expect(res.body.user).not.toHaveProperty("password");
      expect(res.body.user).toEqual({
        id: expect.anything(),
        name: newUser.name,
        email: newUser.email,
        role: "user",
        auth_type: "standalone",
      });

      const dbUser = await User.findById(res.body.user.id);
      expect(dbUser).toBeDefined();
      expect(dbUser).toMatchObject({
        name: newUser.name,
        email: newUser.email,
        role: "user",
        auth_type: "standalone",
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });

    test("should return 400 error if email is invalid", async () => {
      newUser.email = "invalidEmail";

      await request(app).post("/api/auth/register").send(newUser).expect(
        httpStatus.BAD_REQUEST,
      );
    });

    test("should return 400 error if email is already used", async () => {
      await insertUsers([userOne]);
      newUser.email = userOne.email;

      await request(app).post("/api/auth/register").send(newUser).expect(
        httpStatus.BAD_REQUEST,
      );
    });

    test("should return 400 error if password length is less than 8 chars", async () => {
      newUser.password = "passwo1";

      await request(app).post("/api/auth/register").send(newUser).expect(
        httpStatus.BAD_REQUEST,
      );
    });

    test("should return 400 error if password length is more than 32 chars", async () => {
      newUser.password = "passwordpasswordpasswordpassword1";

      await request(app).post("/api/auth/register").send(newUser).expect(
        httpStatus.BAD_REQUEST,
      );
    });

    test("should return 400 error if password does not contain both numbers and letters", async () => {
      newUser.password = "password";

      await request(app).post("/api/auth/register").send(newUser).expect(
        httpStatus.BAD_REQUEST,
      );

      newUser.password = "11111111";

      await request(app).post("/api/auth/register").send(newUser).expect(
        httpStatus.BAD_REQUEST,
      );
    });
  });
});
