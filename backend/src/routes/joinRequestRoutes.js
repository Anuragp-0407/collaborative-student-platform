const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    sendJoinRequest,
    getProjectJoinRequests,
    getMyJoinRequests,
    acceptJoinRequest,
    rejectJoinRequest,
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

router.get(
    "/my/join-requests",
    protect,
    getMyJoinRequests
);

router.put(
    "/join-requests/:requestId/accept",
    protect,
    acceptJoinRequest
);

router.put(
    "/join-requests/:requestId/reject",
    protect,
    rejectJoinRequest
);

module.exports = router;