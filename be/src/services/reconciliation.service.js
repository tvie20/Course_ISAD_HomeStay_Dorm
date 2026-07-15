
const reconModel = require('../models/reconciliation.model')

exports.getAll = async () => {
    return await reconModel.getAll()
}

exports.updateStatus = async (data) => {
    return await reconModel.updateStatus(data)
}
