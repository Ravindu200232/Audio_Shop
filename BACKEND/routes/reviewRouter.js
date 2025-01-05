import express from "express";
import { addReview, getReview } from "../Controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/",addReview);

reviewRouter.get("/",getReview);

export default reviewRouter;