module.exports = (status = true, data, message = "") => {
    return {
        status,
        data,
        message
    }
}