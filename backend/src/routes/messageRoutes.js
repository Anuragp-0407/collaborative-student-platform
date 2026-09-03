const express = require("express");
const protect = require("../middleware/authMiddleware");
const { 
    sendMessage,
    getProjectMessages
} = require("../controllers/messageController");

const router = express.Router();

router.post(
    "/projects/:projectId/messages",
    protect,
    sendMessage
);

router.get(
    "/projects/:projectId/messages",
    protect,
    getProjectMessages
);

module.exports = router;