const usersRoutes = require('./users');
const sneakersRoutes = require('./sneakers');
const reviewsRoutes = require('./reviews');
const reportsRoutes = require('./reports');
const qAndAsRoutes = require('./qAndA');

const configRoutes = (app) => {
    app.use('/users', usersRoutes);
    app.use('/sneakers', sneakersRoutes);
    app.use('/reviews', reviewsRoutes);
    app.use('/reports', reportsRoutes);
    app.use('/qAndAsRoutes', qAndAsRoutes);

    app.use('*' ,(req, res) => {
         res.status(404).json({error: 'Not found!'});
    });

    app.use(function (err, req, res, next) {
        if (!err) {
            return next();
        }
        res.status(400).json({error: 'Bad request!'});
    });
}

module.exports = configRoutes;
