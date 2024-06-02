const { Vonage } = require("@vonage/server-sdk");

class SmsController {
  /**
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
}

module.exports = SmsController;
