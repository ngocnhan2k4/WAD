const passport = require("../../config/passport");
const User = require("./service");
const { login } = require("../user/controller");
const jwt = require("jsonwebtoken");
const { sendResetPassword } = require("../../utils/sendVerify");
const Auth = {
    signUpLocal: (req, res, next) => {
        passport.authenticate("local-signup", (err, user, info) => {
            if (err) {
                return res.status(500).json({ error: "An error occurred" });
            }
            if (!user) {
                console.log("Sai chỗ này", info);
                return res
                    .status(400)
                    .json({ error: info ? info.message : "Sign up failed" });
            }
            // Login user
            req.login(user, (loginErr) => {
                if (loginErr) {
                    console.log(loginErr);
                    return res
                        .status(500)
                        .json({ error: "Login failed after signup" });
                }
                return res
                    .status(200)
                    .json({ message: "Sign up successful", user });
            });
        })(req, res, next);
    },
    verify: async (req, res) => {
        const Token = req.params.token;
        const user = await User.verifyUser(Token);
        console.log(user);
        if (!user) {
            return res.send("Token not found");
        }
        res.redirect("/");
    },
    logout: (req, res) => {
        req.logout((err) => {
            if (err) {
                return res.status(500).send("Error logging out.");
            }

            // Xử lý sau khi logout thành công
            res.redirect("/"); // Chuyển hướng người dùng đến trang chủ hoặc trang khác sau khi logout
        });
    },
    googleSignup: (req, res) => {
        return passport.authenticate("google", {
            scope: ["profile", "email"], // Yêu cầu quyền truy cập thông tin profile và email
        })(req, res); // Trả về middleware để thực thi xác thực
    },
    githubSignup: (req, res) => {
        return passport.authenticate("github", {
            scope: ["user:email"],
        })(req, res);
    },
    googleCallBack: (req, res) => {
        passport.authenticate(
            "google",
            {
                failureRedirect: "/auth/login",
            },
            (err, user, info) => {
                if (err) {
                    return res.redirect("/auth/login"); // Nếu có lỗi, chuyển hướng về trang đăng nhập
                }
                if (!user) {
                    return res.redirect("/auth/login"); // Nếu không có người dùng, chuyển hướng về trang đăng nhập
                }
                if (user.state === "ban") {
                    return res.redirect("/auth/ban");
                }
                // Nếu xác thực thành công, sử dụng req.login để lưu thông tin người dùng vào session
                req.login(user, (err) => {
                    if (err) {
                        return res.redirect("/auth/login"); // Nếu có lỗi khi login, chuyển hướng về trang đăng nhập
                    }

                    console.log(req.user); // In thông tin người dùng vào console
                    res.redirect("/"); // Chuyển hướng đến trang sản phẩm sau khi đăng nhập thành công
                });
            }
        )(req, res); // Chú ý gọi middleware với đối tượng req và res
    },
    githubCallBack: (req, res) => {
        passport.authenticate(
            "github",
            {
                failureRedirect: "/auth/login",
            },
            (err, user, info) => {
                if (err) {
                    return res.redirect("/auth/login");
                }
                if (!user) {
                    return res.redirect("/auth/login");
                }
                if (user.state === "ban") {
                    return res.redirect("/auth/ban");
                }
                req.login(user, (err) => {
                    if (err) {
                        return res.redirect("/auth/login");
                    }

                    console.log(req.user);
                    res.redirect("/");
                });
            }
        )(req, res);
    },

    loginLocal: (req, res, next) => {
        passport.authenticate("local-login", (err, user, info) => {
            if (err) {
                return res.status(500).json({ error: "An error occurred" });
            }
            if (!user) {
                return res
                    .status(400)
                    .json({ error: info ? info.message : "Login failed" });
            }
            req.login(user, (loginErr) => {
                if (loginErr) {
                    return res
                        .status(500)
                        .json({ error: "Login failed after signup" });
                }
                return res.status(200).json({ message: "Login successful" });
            });
        })(req, res, next);
    },
    resetPassword: async (req, res) => {
        const token = req.params.token;
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.getUserById(decode.id);
            if (!user) {
                return res.send("Token not found");
            }
            res.render("reset_password", {
                user,
                page_style: "/css/reset_password.css",
            });
        } catch (err) {
            console.log(err);
            return res.send("Token invalid");
        }
    },
    updatePassword: async (req, res) => {
        console.log("Update password");
        const { password, token } = req.body;
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            const user = await User.getUserById(decode.id);
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }
            await User.updatePassword(user.id, password);
            res.status(200).json({ message: "Password updated" });
        } catch (err) {
            console.log(err);
            res.status(500).send("An error occurred");
        }
    },
    forgotPassword: (req, res) => {
        res.render("forgot_password", {
            page_style: "/css/forgot_password.css",
        });
    },
    sendResetPassword: async (req, res) => {
        const email = req.body.email;
        const user = await User.findUserByUsername(email);
        try {
            if (!user) {
                return res.status(400).json({ error: "Email not found" });
            }
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });
            await sendResetPassword(email, token);
            res.status(200).json({ message: "Email sent" });
        } catch (err) {
            console.log(err);
            res.status(500).send("An error occurred");
        }
    },
    ban: async (req, res) => {
        res.render("ban", { page_style: "/css/ban.css", notAJAX: true });
    },

    checkLogin: (req, res) => {
        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        if (req.user) {
            return res.json({ loggedIn: true, user: req.user });
        } else {
            return res.json({ loggedIn: false });
        }
    },
};

module.exports = Auth;
