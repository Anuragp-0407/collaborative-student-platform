const express = require("express");

const protect = require("../middleware/authMiddleware");
const { sendJoinRequest } = require("../controllers/joinRequestController");

const router = express.Router();

router.post(
    "/projects/:projectId/join",
    protect,
    sendJoinRequest
);

module.exports = router;