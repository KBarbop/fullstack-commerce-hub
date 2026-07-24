import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const MAIL_HOST = process.env.MAIL_HOST || '';
const MAIL_FROM_USER = process.env.MAIL_FROM_USER || '';
const MAIL_FROM_USER_PASSWORD = process.env.MAIL_FROM_USER_PASSWORD || '';

const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: MAIL_FROM_USER,
        pass: MAIL_FROM_USER_PASSWORD,
    },
});

export const sendEmail = async (req, res) => {
    const { email, fullName, phone, subject, description } = req.body;

    const emailOptions = {
        from: MAIL_FROM_USER,
        to: email,
        subject: 'Logic in Flow - Contact Us form | ' + subject,
        html: `<p>${fullName}</p><p>email: ${email}</p><p>phone: ${phone}</p><p>${description}</p>`,
    };

    try {
        const info = await transporter.sendMail(emailOptions);
        console.log('Email sent:', info.response);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
};
