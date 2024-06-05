const { Vonage } = require("@vonage/server-sdk");

const DatabaseController = require("../controllers/databaseController");
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
     *
     * An SMS text http request can be synthesised with the following:
     * @example
     * curl -G 'http://localhost:8080/webhooks/inbound-sms' \
     *   --data-urlencode 'msisdn=110000000000' \
     *   --data-urlencode 'to=110000000000' \
     *   --data-urlencode 'messageId=ABCDEF0123456789' \
     *   --data-urlencode $'text=logging\nlow\n1.1\n1.1' \
     *   --data-urlencode 'type=text' \
     *   --data-urlencode $'keyword=LOGGING\nLOW\n1.1\n1.1' \
     *   --data-urlencode 'api-key=api-key' \
     *   --data-urlencode 'message-timestamp=2024-06-05+13:53:25'
     */
    static async handleInboundSms(request, response) {
        const params = Object.assign(request.query, request.body);
        try {
            await SmsController.logInboundSms(params);
            var new_report = Report.buildFromString(params.text);
            console.log("Generated report:", new_report);
            await new_report.insertIntoDb();
        } catch (err) {
            console.error("Exception in handling sms:", err);
        }
        response.status(204).send();
    }

    /**
     * Save the SMS message to the database. The text is expected in json format
     * as:
     *
     *
     * @example
     *
     * SmsController.loInboundSms({
     *      msisdn: '11000000000',
     *      to: '11000000000',
     *      messageId: 'ABCDEF0123456789',
     *      text: 'logging\nlow\n1.1\n1.2',
     *      type: 'text',
     *      keyword: 'LOGGING\nLOW\n1.1\n1.2',
     *      'api-key': 'your-key',
     *      'message-timestamp': '2024-06-05 13:53:25'
     * });
     *
     */
    static async logInboundSms(text) {
        console.log("Inbound SMS:", text);
        try {
            const result = await DatabaseController.query(
                `INSERT INTO sms_messages 
            (msisdn, 
                recipient, 
                api_message_id,
                text, 
                type,
                keyword, 
                api_key, 
                message_timestamp) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
                Object.values(text),
            );
        } catch (err) {
            throw err;
        }
    }
}

module.exports = SmsController;
