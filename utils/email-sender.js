const nodemailer = require("nodemailer")

const emailSender = async ( email, code ) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: "hilolabegliyeva07@gmail.com",
                pass: process.env.APP_KEY
            },
        })

        const info = await transporter.sendMail({
            from: "hilolabegliyeva07@gmail.com",
            to: email,
            subject: "Tasdiqlash kodi",
            text: `Tasdiqlash kodi: ${code}`,
            html: `
                <h2>Salom!</h2>
                <p>Sizning tasdiqlash kodingiz:</p>
                <h1 style="color: blue;">${code}</h1>
            `,
        });


        console.log("Email yuborildi:", info.messageId);

        return true;

    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

module.exports = emailSender