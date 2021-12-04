const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;

router.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect('/');
        return;
    }

    res.status(200).render('users/login', {
        title: "Login",
        partial: "empty-scripts"
    });
});

router.get('/signup', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
        return;
    }

    res.status(200).render('users/signup', {
        title: "Signup",
        partial: "empty-scripts"
    });
});

router.post('/signup', async (req, res) => {
    let signupData = req.body;
    let errors = [];

    if (!signupData.email) {
        errors.push("No username provided!");
    }

    if (!signupData.password) {
        errors.push("No password provided!");
    }

    if (errors.length > 0) {
        res.status(400).render('users/signup', {
            title: 'Signup',
            hasErrors: true,
            errors: errors,
            partial: "empty-scripts",
        });
        return;
    }

    try {
        const result = await usersData.create("", "", signupData.email, signupData.password, "", "", false, [], []);
        if (result) {
            res.redirect("/users/login");
        } else {
            res.status(500).render('layouts/error', {
                title: "Error",
                error: "Internal server error!",
                partial: "empty-scripts",
            });
        }
    } catch (e) {
        if (e.statusCode === 400) {
            errors.push(e.message);
            res.status(400).render('users/signup', {
                title: 'Signup',
                hasErrors: true,
                errors: errors,
                partial: "empty-scripts",
            });
        } else {
            res.status(500).render('layouts/error', {
                title: "Error",
                error: "Internal server error!",
                partial: "empty-scripts",
            });
        }
    }
});

router.post('/login', async (req, res) => {
    let loginData = req.body;
    let errors = [];

    if (!loginData.email) {
        errors.push("No email provided!");
    }

    if (!loginData.password) {
        errors.push("No password provided!");
    }

    if (errors.length > 0) {
        res.status(400).render('users/login', {
            title: 'Login',
            hasErrors: true,
            errors: errors,
            partial: "empty-scripts",
        });
        return;
    }

    try {
        let result = await usersData.checkUser(loginData.email, loginData.password);
        if (result) {
            req.session.user = result["_id"].toString();
            res.redirect('/');
        }
    } catch (e) {
        errors.push(e.message);
        res.status(400).render('users/login', {
            title: 'Login',
            hasErrors: true,
            errors: errors,
            partial: "empty-scripts",
        });
    }
});

router.get('/logout', (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        req.session.destroy();
        res.status(200).render('users/logout', {
            title: "Logout",
            status: "Logged out successfully!",
            partial: "empty-scripts",
        });
    }
});

router.get('/profile', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        let user = await usersData.get(req.session.user);
        let renderOptions = {
            title: 'User Profile',
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            address: user.address,
            phoneNumber: user.phoneNumber,
            partial: "empty-scripts",
        }

        if (req.session.updateSuccessful) {
            renderOptions.updateSuccessful = true
            delete req.session.updateSuccessful;
        }

        res.status(200).render('users/profile', renderOptions);
    }
});

router.post('/profile', async (req, res) => {
    if (!req.session.user) {
        res.status(403).json({error: "Forbidden!"});
    } else {
        let updateData = req.body;
        let errors = [];

        if (!updateData.email) {
            errors.push('No email provided!');
        }

        if (errors.length > 0) {
            res.status(400).render('users/profile', {
                title: 'User Profile',
                hasErrors: true,
                errors: errors,
                partial: "empty-scripts",
            });
            return;
        }

        let user = await usersData.get(req.session.user);

        try {
            let result = await usersData.update(req.session.user, updateData.firstName, updateData.lastName, updateData.email, updateData.password, updateData.address, updateData.phoneNumber, false, user.sneakersListed, user.sneakersBought);
            if (result) {
                req.session.updateSuccessful = true;
                res.redirect("/users/profile");
            } else {
                res.status(500).render('layouts/error', {
                    title: "Error",
                    error: "Internal server error!",
                    partial: "empty-scripts",
                });
            }
        } catch (e) {
            if (e.statusCode === 400) {
                errors.push(e.message);
                res.status(400).render('users/profile', {
                    title: 'User Profile',
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    address: user.address,
                    phoneNumber: user.phoneNumber,
                    hasErrors: true,
                    errors: errors,
                    partial: "empty-scripts",
                });
            } else {
                console.log(e);
                res.status(500).render('layouts/error', {
                    title: "Error",
                    error: "Internal server error!",
                    partial: "empty-scripts",
                });
            }
        }
    }
});

module.exports = router;
