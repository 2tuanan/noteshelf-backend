const { responseReturn } = require("../utils/response");
const userModel = require("../models/userModel");
const noteModel = require("../models/noteModel");
const delay = require('../utils/delay')

class adminControllers {
  get_users = async (req, res) => {
    if (req.role !== 'admin') {
        return responseReturn(res, 403, {error: 'Access Denied!'})
    }
    try {
        const users = await userModel.find();
        responseReturn(res, 200, {users})
    } catch (error) {
        responseReturn(res, 500, {error: 'Internal Server Error!'})
    }
  }
  // End method
  reset_user = async (req, res) => {
    if (req.role !== 'admin') {
        return responseReturn(res, 403, {error: 'Access Denied!'})
    }
    const {id} = req.params;
    await delay(200);
    try {
        const deleteResult = await noteModel.deleteMany({userId: id});
        if (deleteResult.deletedCount === 0) {
            return responseReturn(res, 400, {error: 'Note not found!'})
        }
        await userModel.findByIdAndUpdate(id, {$set: {noteTotal: 0}});
        responseReturn(res, 200, {message: 'Notes reset successfully!', noteTotal: 0})
    } catch (error) {
        responseReturn(res, 500, {error: 'Internal Server Error!'})
    }
  }
  // End method
  delete_user = async (req, res) => {
    await delay(200);
    if (req.role !== 'admin') {
        return responseReturn(res, 403, {error: 'Access Denied!'})
    }
    const {id} = req.params;
    try {
        if (!id) {
        return responseReturn(res, 400, {error: 'User not found!'})
    }   
        await noteModel.deleteMany({userId: id});
        await userModel.findByIdAndDelete(id);
        responseReturn(res, 200, {message: 'User deleted successfully!'})
    } catch (error) {
        responseReturn(res, 500, {error: 'Internal Server Error!'})
    }
  }
}

module.exports = new adminControllers();