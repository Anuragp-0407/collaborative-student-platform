const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    sendJoinRequest,
    getProjectJoinRequests,
} = require("../controllers/joinRequestController");

const router = express.Router();

router.post(
    "/projects/:projectId/join",
    protect,
    sendJoinRequest
);

router.get(
    "/projects/:projectId/join-requests",
    protect,
    getProjectJoinRequests
);

module.exports = router;