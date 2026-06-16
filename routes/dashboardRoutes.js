import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  (req, res) => {
    res.json({
      message: "Welcome Student Dashboard",
    });
  }
);

router.get(
  "/rector",
  protect,
  authorizeRoles("rector"),
  (req, res) => {
    res.json({
      message: "Welcome Rector Dashboard",
    });
  }
);

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin Dashboard",
    });
  }
);

export default router;