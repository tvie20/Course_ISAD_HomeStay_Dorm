
const reconModel = require('../models/reconciliation.model')

exports.getAll = async () => {
    return await reconModel.getAll()
}

exports.create = async (data) => {
    return await reconModel.create(data)
}

exports.updateStatus = async (data) => {
    return await reconModel.updateStatus(data)
}
