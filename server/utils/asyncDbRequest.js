async function asyncDbRequest(db, request, data = []) {
    return new Promise((resolve, reject) => {
        db.query(
            request,
            data,
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
}

module.exports = asyncDbRequest;