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
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
                <h2 style="color: #007BFF;">Chào mừng bạn đến với Dự án WEB Bán Hàng!</h2>
                <p>Nhấn vào nút bên dưới để xác thực email của bạn và bắt đầu trải nghiệm các dịch vụ tuyệt vời.</p>
                <a href='http://localhost:4000/auth/verify/${token}' 
                   style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">
                    Xác Thực Email
                </a>
                <p style="margin-top: 20px; font-size: 0.9em; color: #555;">
                    Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
                </p>
            </div>
            <footer style="margin-top: 20px; text-align: center; font-size: 0.8em; color: #777;">
                <p>&copy; 2024 Dự án WEB Bán Hàng. Tất cả các quyền được bảo lưu.</p>
                <p>Email: nhatmonsterhack@gmail.com</p>
            </footer>
        </div>`,
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
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 8px; border: 1px solid #ddd;">
                    <h2 style="color: #007BFF;">Yêu cầu đặt lại mật khẩu</h2>
                    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu từ bạn. Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
                    <a href='http://localhost:4000/auth/reset/${token}' 
                       style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">
                        Đặt Lại Mật Khẩu
                    </a>
                    <p style="margin-top: 20px; font-size: 0.9em; color: #555;">
                        Liên kết sẽ hết hạn sau 24 giờ.
                    </p>
                </div>
                <footer style="margin-top: 20px; text-align: center; font-size: 0.8em; color: #777;">
                    <p>&copy; 2024 Dự án WEB Bán Hàng. Tất cả các quyền được bảo lưu.</p>
                    <p>Email: nhatmonsterhack@gmail.com</p>
                </footer>
            </div>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {});
}

module.exports = { sendEmail, sendResetPassword };
