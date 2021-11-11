const dbConnection = require('./mongoConnection');

const getCollectionFn = (collection) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection.connectToDb();
            _col = await db.collection(collection);
        }

        return _col;
    };
};

module.exports = {
    users: getCollectionFn('users'),
    sneakers: getCollectionFn('sneakers'),
    reviews: getCollectionFn('reviews'),
    qAndA: getCollectionFn('qAndA'),
    reports: getCollectionFn('reports')
};
