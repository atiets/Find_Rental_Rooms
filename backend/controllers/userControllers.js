const User = require("../models/User");

const userController = {
    //get all users
    getAllUsers: async(req, res) => {
        try{
            const users = await User.find();
            res.status(200).json(users);
        } catch(err) {
            // res.status(500).json(err);
            console.error("Error details: ", err);  // In chi tiết lỗi ra console
            res.status(500).json({ error: "An error occurred", details: err.message });
        }
    },

    //delete user
    deleteUser: async(req, res) => {
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete successfully!");
        }catch(err){
            res.status(500).json(err);
        }
    }
}

module.exports = userController;