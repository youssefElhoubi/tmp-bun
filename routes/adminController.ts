import express from "express";
import {
  allUsers,
  banUser,
  approveUser,
  statistics,
  lastUser,
} from "../controllers/adminController";

const adminRout = express.Router();

adminRout.get("/users", allUsers);
adminRout.patch("/users/:id/ban", banUser);
adminRout.patch("/users/:id/approve", approveUser);
adminRout.get("/statistics", statistics);
adminRout.get("/users/last", lastUser);

export default adminRout;