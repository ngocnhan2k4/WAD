const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN, // refresh token đã có
});

async function findAcessToken() {
    const accessToken = await oAuth2Client.getAccessToken().catch((error) => {
        console.error("Failed to fetch access token", error);
        return null;
    });
    return accessToken;
}

function createTransporter(accessToken) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "nhatmonsterhack@gmail.com",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken,
        },
    });
    return transporter;
}

async function sendEmail(email, token) {
    const accessToken = await findAcessToken();
    const transporter = createTransporter(accessToken);
    let mailOptions = {
        from: "Dự án WEB Bán Hàng <nhatmonsterhack@gmail.com>",
        to: `${email}`,
        subject: "Verify your email",
        text: "Click the link below to verify your email",
        html: `<a href='http://localhost:4000/auth/verify/${token}'>ẤN VÀO ĐÂY ĐỂ ĐƯỢC TOÀN BÚ CU</a>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {});
}

async function sendResetPassword(email, token) {
    const accessToken = await findAcessToken();
    const transporter = createTransporter(accessToken);
    let mailOptions = {
        from: "Dự án WEB Bán Hàng <nhatmonsterhack@gmail.com>",
        to: `${email}`,
        subject: "Reset your password",
        text: "Click the link below to verify your email",
        html: `<a href='http://localhost:4000/auth/reset/${token}'>Reset</a>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {});
}

module.exports = { sendEmail, sendResetPassword };
