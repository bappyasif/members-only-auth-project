let express = require("express");
const { isAdminGetReq, isAdminPostReq } = require("../controllers/is-admin");
const { joinClubGetReq, joinClubPostReq, checkMemberGetReq } = require("../controllers/join-club");
const { loginFormGetReq, loginFormPostReq } = require("../controllers/login");
const { messageBoardGetReq, logOutGetReq, messageBoardCreateNewGetReq, messageBoardCreateNewPostReq } = require("../controllers/message-board");
const { registerFormGetReq, registerFormPostReq } = require("../controllers/register");
const { isAuth, isMember } = require("./authChecks");

let routes = express();

routes.get("/register", registerFormGetReq);

routes.post("/register", registerFormPostReq);

routes.get("/join-club", isAuth, joinClubGetReq);

routes.post("/join-club", joinClubPostReq);

routes.get("/is-admin", isAuth, isAdminGetReq);

routes.post("/is-admin", isAuth, isAdminPostReq);

routes.get("/login", loginFormGetReq);

routes.post("/login", loginFormPostReq);

routes.get("/message-board", isAuth, messageBoardGetReq)

routes.get("/already-member", checkMemberGetReq)

routes.get("/already-admin", checkMemberGetReq)

// routes.get("/message-board", isMember, messageBoardGetReqForCreatingNewMessage)

routes.get("/message-board/create-new", messageBoardCreateNewGetReq)

routes.post("/message-board/create-new", isAuth, messageBoardCreateNewPostReq)

routes.get("/logout", logOutGetReq)

module.exports = routes