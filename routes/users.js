const express = require("express");
const router = express.Router();
const data = require("../data");
const {
  isValidEmail,
  isValidPassword,
  isValidString,
  isValidPhoneNumber,
} = require("../data/validate");
const usersData = data.users;

router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  }

  res.status(200).render("users/login", {
    title: "Login",
    isLoggedIn: !!req.session.user,
    partial: "user-scripts",
  });
});

router.get("/signup", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  }

  res.status(200).render("users/signup", {
    title: "Signup",
    isLoggedIn: !!req.session.user,
    partial: "user-scripts",
  });
});

router.post("/signup", async (req, res) => {
  let signupData = req.body;
  let errors = [];

  if (!signupData.email) {
    errors.push("No username provided!");
  }

  if (!signupData.password) {
    errors.push("No password provided!");
  }

  let validation = isValidString(signupData.email, "email");
  if (!validation.result) {
    errors.push(validation.message);
  }

  validation = isValidEmail(signupData.email.trim());
  if (!validation.result) {
    errors.push(validation.message);
  }

  validation = isValidString(signupData.password, "password");
  if (!validation.result) {
    errors.push(validation.message);
  }

  validation = isValidPassword(signupData.password);
  if (!validation.result) {
    errors.push(validation.message);
  }

  if (errors.length > 0) {
    res.status(400).render("users/signup", {
      title: "Signup",
      isLoggedIn: !!req.session.user,
      hasErrors: true,
      errors: errors,
      partial: "user-scripts",
    });
    return;
  }

  try {
    const result = await usersData.create(
      signupData.email.toLowerCase().trim(),
      signupData.password,
      false
    );
    if (result) {
      res.redirect("/users/login");
    } else {
      res.status(500).render("layouts/error", {
        title: "Error",
        isLoggedIn: !!req.session.user,
        error: "Internal server error!",
        partial: "user-scripts",
      });
    }
  } catch (e) {
    if (e.statusCode === 400) {
      errors.push(e.message);
      res.status(400).render("users/signup", {
        title: "Signup",
        isLoggedIn: !!req.session.user,
        hasErrors: true,
        errors: errors,
        partial: "user-scripts",
      });
    } else {
      res.status(500).render("layouts/error", {
        title: "Error",
        isLoggedIn: !!req.session.user,
        error: "Internal server error!",
        partial: "user-scripts",
      });
    }
  }
});

router.post("/login", async (req, res) => {
  let loginData = req.body;
  let errors = [];

  if (!loginData.email) {
    errors.push("No email provided!");
  }

  if (!loginData.password) {
    errors.push("No password provided!");
  }

  let validation = isValidString(loginData.email, "email");
  if (!validation.result) {
    errors.push(validation.message);
  }

  validation = isValidEmail(loginData.email.trim());
  if (!validation.result) {
    errors.push(validation.message);
  }

  validation = isValidString(loginData.password, "password");
  if (!validation.result) {
    errors.push(validation.message);
  }

  validation = isValidPassword(loginData.password);
  if (!validation.result) {
    errors.push(validation.message);
  }

  if (errors.length > 0) {
    res.status(400).render("users/login", {
      title: "Login",
      isLoggedIn: !!req.session.user,
      hasErrors: true,
      errors: errors,
      partial: "user-scripts",
    });
    return;
  }

  try {
    let result = await usersData.checkUser(
      loginData.email.trim(),
      loginData.password
    );
    if (result) {
      req.session.user = result["_id"].toString();
      res.redirect("/");
    }
  } catch (e) {
    errors.push(e.message);
    res.status(400).render("users/login", {
      title: "Login",
      isLoggedIn: !!req.session.user,
      hasErrors: true,
      errors: errors,
      partial: "user-scripts",
    });
  }
});

router.get("/logout", (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    req.session.destroy();
    res.status(200).render("users/logout", {
      title: "Logout",
      status: "Logged out successfully!",
      partial: "user-scripts",
    });
  }
});

router.get("/profile", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    try {
      let user = await usersData.get(req.session.user);
      let renderOptions = {
        title: "User Profile",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
        phoneNumber: user.phoneNumber,
        isLoggedIn: !!req.session.user,
        partial: "user-scripts",
      };

      if (req.session.updateSuccessful) {
        renderOptions.updateSuccessful = true;
        delete req.session.updateSuccessful;
      }

      res.status(200).render("users/profile", renderOptions);
    } catch (e) {
      if (e.statusCode === 404) {
        res.status(404).json({ error: "Not found!" });
      } else {
        res.status(500).render("layouts/error", {
          title: "Error",
          isLoggedIn: !!req.session.user,
          error: "Internal server error!",
          partial: "user-scripts",
        });
      }
    }
  }
});

router.post("/profile", async (req, res) => {
  if (!req.session.user) {
    res.status(403).json({ error: "Forbidden!" });
  } else {
    let updateData = req.body;
    let errors = [];

    if (!updateData.firstName) {
      errors.push("No first name provided!");
    }

    if (!updateData.lastName) {
      errors.push("No last name provided!");
    }

    if (!updateData.email) {
      errors.push("No email provided!");
    }

    if (!updateData.address) {
      errors.push("No address provided!");
    }

    if (!updateData.phoneNumber) {
      errors.push("No phone number provided!");
    }

    let validation = isValidString(updateData.firstName, "firstName");
    if (!validation.result) {
      errors.push(validation.message);
    }

    validation = isValidString(updateData.lastName, "lastName");
    if (!validation.result) {
      errors.push(validation.message);
    }

    validation = isValidString(updateData.email, "email");
    if (!validation.result) {
      errors.push(validation.message);
    }

    validation = isValidEmail(updateData.email.trim());
    if (!validation.result) {
      errors.push(validation.message);
    }

    validation = isValidString(updateData.address, "address");
    if (!validation.result) {
      errors.push(validation.message);
    }

    validation = isValidString(updateData.phoneNumber, "phoneNumber");
    if (!validation.result) {
      errors.push(validation.message);
    }

    validation = isValidPhoneNumber(updateData.phoneNumber.trim());
    if (!validation.result) {
      errors.push(validation.message);
    }

    if (errors.length > 0) {
      res.status(400).render("users/profile", {
        title: "User Profile",
        hasErrors: true,
        errors: errors,
        isLoggedIn: !!req.session.user,
        partial: "user-scripts",
      });
      return;
    }

    let user;

    try {
      user = await usersData.get(req.session.user);
      let result = await usersData.update(
        req.session.user,
        updateData.firstName.trim(),
        updateData.lastName.trim(),
        updateData.email.toLowerCase().trim(),
        updateData.password,
        updateData.address.trim(),
        updateData.phoneNumber.trim(),
        false,
        user.sneakersListed,
        user.sneakersBought
      );
      if (result) {
        req.session.updateSuccessful = true;
        res.redirect("/users/profile");
      } else {
        res.status(500).render("layouts/error", {
          title: "Error",
          error: "Internal server error!",
          isLoggedIn: !!req.session.user,
          partial: "user-scripts",
        });
      }
    } catch (e) {
      if (e.statusCode === 400) {
        errors.push(e.message);
        res.status(400).render("users/profile", {
          title: "User Profile",
          firstName: user.firstName.trim(),
          lastName: user.lastName.trim(),
          email: user.email.toLowerCase().trim(),
          address: user.address.trim(),
          phoneNumber: user.phoneNumber.trim(),
          hasErrors: true,
          errors: errors,
          isLoggedIn: !!req.session.user,
          partial: "user-scripts",
        });
      } else {
        console.log(e);
        res.status(500).render("layouts/error", {
          title: "Error",
          error: "Internal server error!",
          isLoggedIn: !!req.session.user,
          partial: "user-scripts",
        });
      }
    }
  }
});

module.exports = router;
