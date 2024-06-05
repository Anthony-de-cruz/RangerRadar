const { Vonage } = require("@vonage/server-sdk");

const { Report } = require("../models/report");

class SmsController {
    /**
     * Vonage API details
     */
    static vonage = new Vonage({
        apiKey: process.env.VONAGE_API_KEY,
        apiSecret: process.env.VONAGE_API_SECRET,
    });
    /**
     * @param {string} to Target phone number
     * @param {string} from Organisation name
     * @param {string} text The message
     *
     * Don't use this too much as it costs us money
     *
     * @example
     * const to = "447758564873";
     * const from = "Ranger Radar";
     * const text = "A text message sent using the Vonage SMS API";
     *
     * sendSMS(to, from, text);
     */
    static async sendSMS(to, from, text) {
        await this.vonage.sms
            .send({ to, from, text })
            .then((resp) => {
                console.log("Message sent successfully");
                console.log(resp);
            })
            .catch((err) => {
                console.log("There was an error sending the messages.");
                console.error(err);
            });
    }

    /**
     * Middleware to handle incoming SMS http requests from Vonage. Builds a
     * Report from the text and inserts it into the database.
     */
    static handleInboundSms(request, response) {
        const params = Object.assign(request.query, request.body);
        console.log("Inbound SMS:", params);
        try {
            var new_report = Report.buildFromString(params.text);
            console.log(new_report);
            new_report.insertIntoDb();
        } catch (exception) {
            console.error(exception);
        }
        response.status(204).send();
    }
}

module.exports = SmsController;
