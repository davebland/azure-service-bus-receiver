const webserver = require('./ui');
const Receiver = require('./receiver');

require("dotenv").config();

const subscriptionsToProcess = require('./subscriptions.json');
console.log(subscriptionsToProcess);

const queuesToProcess = require('./queues.json');
console.log(queuesToProcess);

function main() {
	console.log("Setting up receivers...")
	subscriptionsToProcess.forEach(async (sub) => {
		try {
			subscriptionReceiver = new Receiver({"topicName":sub.TOPIC_NAME,"subscriptionName":sub.SUBSCRIPTION_NAME});
			await subscriptionReceiver.run();
		}
		catch(err) {
			console.log(`Receiver for topic ${sub.TOPIC_NAME} on subscription ${sub.SUBSCRIPTION_NAME} failed: ${err}`);
		}
	})
	queuesToProcess.forEach(async (q) => {
		try {
			queueReceiver = new Receiver({"queueName":q.QUEUE_NAME});
			await queueReceiver.run();
		}
		catch(err) {
			console.log(`Receiver for queue ${q.QUEUE_NAME} failed: ${err}`);
		}
	})
}

main();