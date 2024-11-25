const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const { sendEmail } = require("../utils/sendVerify");
const bcrypt = require("bcrypt");

const User = require("../app/user/service");
//User sử dụng Prismas
const crypto = require("../utils/crypto");

passport.use(
    "local-signup",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                const existUser = await User.findUserByUsername(email);
                if (existUser) {
                    return done(null, false, {
                        message: "Email already taken",
                    });
                }
                const Token = crypto.generateToken();
                const user = await User.createUserLocal(
                    email,
                    password,
                    req.body.fullName,
                    Token
                );
                console.log("User created:", email);
                await sendEmail(email, Token);
                return done(null, user);
            } catch (error) {
                return done(null, false, { message: error.message });
            }
        }
    )
);

passport.use(
    "local-login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await User.findUserByUsernameAndPassWord(
                    email,
                    password
                );
                if (!user) {
                    return done(null, false, {
                        message: "Email and password not found",
                    });
                }
                if (user.state === "ban") {
                    return done(null, false, { message: "Account is banned" });
                }
                if (!user.verified) {
                    return done(null, false, { message: "Email not verified" });
                }
                return done(null, user);
            } catch (error) {
                return done(null, false, { message: error.message });
            }
        }
    )
);
// passport.use(
//     "facebook",
//     new FacebookStrategy(
//         {},
//         async (accessToken, refreshToken, profile, done) => {
//             console.log("Facebook profile:", profile);
//             try {
//                 let user = await User.findUserByUsername(profile.id);
//                 if (!user) {
//                     user = await User.createUser(
//                         profile.id,
//                         null,
//                         profile.displayName,
//                         null
//                     );
//                 }
//                 done(null, user);
//             } catch (error) {
//                 done(null, false, { message: error.message });
//             }
//         }
//     )
// );

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:4000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findUserBySocialId(profile.id);
                if (!user) {
                    const email = profile.emails && profile.emails[0].value;
                    const avatar = profile.photos[0].value;
                    user = await User.createUserGoogle(
                        profile.displayName,
                        profile.id,
                        email,
                        avatar
                    );
                }

                return done(null, user); // Trả về thông tin người dùng đã xác thực
            } catch (error) {
                return done(error, false, { message: error.message }); // Trả về lỗi nếu có
            }
        }
    )
);
passport.use(
    "github",
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:4000/auth/github/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findUserBySocialId(profile.id);
                if (!user) {
                    const email = profile.emails && profile.emails[0].value;
                    const avatar = profile.photos[0].value;
                    user = await User.createUserGithub(
                        profile.displayName,
                        profile.id,
                        email,
                        avatar
                    );
                }
                return done(null, user); // Trả về thông tin người dùng đã xác thực
            } catch (error) {
                return done(error, false, { message: error.message }); // Trả về lỗi nếu có
            }
        }
    )
);

passport.serializeUser((user, done) => {
    // Log user để kiểm tra
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findUserById(id); // Tìm người dùng dựa trên ID trong session
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
