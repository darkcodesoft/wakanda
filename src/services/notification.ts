import nodemailer from 'nodemailer'

/**
 *
 * EmailInput interface definition
 */
interface EmailInput {
    to: string
    subject: string
    text?: string
    html?: string
}

/**
 *
 * Configure transport object ( email service to use to send from )
 * Using Gmail for now...
 */
const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'wapi.darkcode.software@gmail.com',
        pass: 'ma210329*'
    }
})

/**
 *
 * Parse email inputs
 * @param string message text
 * @return EmailInput
 */
function parseEmailInputs(text?:string) : EmailInput {
    return {
        to: 'darkcode.software@icloud.com',
        from: 'darkcode.software.@icloud.com',
        subject: 'Wapi Notification',
        text
    } as EmailInput
}

/**
 *
 * Send mail function
 * @param EmailInput
 * @async
 * @return any
 *
 */
async function mail(options: EmailInput) : Promise<any> {
    return await transport.sendMail(options, (err, info) => {
        const now = new Date().toISOString()
        if(err) {
            console.log('[-] email send error at ' + now)
            console.log(err)
            return err
        }

        console.log('[+] email send success at ' + now)
        console.log(info)
        return info
    })
}

/**
 *
 * Send text mail
 * @param string email text
 */
export function send(text: string) {
    const input = parseEmailInputs(text)
    return mail(input)
}
