import {createTransport} from "nodemailer";

export const transporter = createTransport({
    host: 'host.docker.internal',
    port: 1025,
    secure: false,
    requireTLS: false,
    // auth: {
    //     user: username,
    //     pass: password,
    // },
    logger: true
});


export const sendMessage = async (to: string, subject: string, content: string) => {
    await transporter.sendMail({
        from: 'from@example.com',
        to,
        subject,
        html: content,
    })
}

export const close = async () => {
    await transporter.close()
}

export const MailerService = {
    sendMessage,
    close
}