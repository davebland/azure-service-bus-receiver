const webserver = require('./ui');
const Receiver = require('./receiver');

require("dotenv").config();

const subscriptionsToProcess = require('./subscriptions.json');
console.log(subscriptionsToProcess);

function main() {
	console.log("Setting up receivers...")
	subscriptionsToProcess.forEach(async (sub) => {
		try {
			subscriptionReceiver = new Receiver(sub.TOPIC_NAME,sub.SUBSCRIPTION_NAME);
			await subscriptionReceiver.run();
		}
		catch(err) {
			console.log(`Receiver for topic ${sub.TOPIC_NAME} on subscription ${sub.SUBSCRIPTION_NAME} failed: ${err}`);
		}
	})
}

main();