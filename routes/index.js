let express = require("express");
const { serveBecomeAdminForm, updateUserAdminStatus, serveUserAlreadyAdmin } = require("../controllers/is-admin");
const { serveUserAlreadyMember, serveJoinClubForm, updateUserMembershipStatus } = require("../controllers/join-club");
const { serveUserLoginForm, authenticateUserloginAttempt } = require("../controllers/login");
const { serveDefaultMessageBoard, saveMessageInDatabase, logOutCurrentUser, createNewMessageForm } = require("../controllers/message-board");
const { serveUserRegistrationForm, saveRegisteredUserInDatabase } = require("../controllers/register");
const { isAuth, setAuthenticationVariables } = require("./authChecks");

let routes = express();

// setting up res.locals variables for conditional rendering
routes.use(setAuthenticationVariables);

routes.get("/register", serveUserRegistrationForm);
routes.post("/register", saveRegisteredUserInDatabase);

routes.get("/join-club", isAuth, serveJoinClubForm);
routes.post("/join-club", updateUserMembershipStatus);

routes.get("/is-admin", isAuth, serveBecomeAdminForm);
routes.post("/is-admin", isAuth, updateUserAdminStatus);

routes.get("/login", serveUserLoginForm);
routes.post("/login", authenticateUserloginAttempt);

routes.get("/already-member", serveUserAlreadyMember)
routes.get("/already-admin", serveUserAlreadyAdmin)

routes.get("/message-board", isAuth, serveDefaultMessageBoard)
routes.get("/message-board/create-new", createNewMessageForm)
routes.post("/message-board/create-new", isAuth, saveMessageInDatabase)

routes.get("/logout", logOutCurrentUser)

module.exports = routes