const userController = require("../controllers/userControllers");
const middlewareControllers = require("../controllers/middlewareControllers");

const router = require("express").Router();

//get all users
router.get("/", middlewareControllers.verifyToken, userController.getAllUsers);

//delete user
//v1/user/admin(id)
router.delete("/:id", middlewareControllers.verifyTokenAndAdminAuth, userController.deleteUser);

module.exports = router;