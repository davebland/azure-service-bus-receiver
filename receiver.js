const { ServiceBusClient } = require("@azure/service-bus");

class Receiver {
	constructor(topicName, subscriptionName) {
		this.topicName = topicName;
		this.subscriptionName = subscriptionName;
	}

	sbClient = new ServiceBusClient(process.env.SERVICEBUS_CONNECTION_STRING);

	async run() {
		console.log(`Starting receiver for topic ${this.topicName} on subscription ${this.subscriptionName}.`);
		const receiver = this.sbClient.createReceiver(this.topicName, this.subscriptionName);
		try {
			const subscription = receiver.subscribe({
				processMessage: async (brokeredMessage) => {
					console.log(`Received message: ${brokeredMessage.body}`);
				},

				processError: async (args) => {
					console.log(`Error from source ${args.errorSource} occurred: `, args.error);
					await subscription.close();
				}
			});

			console.log(`Receiving messages for 20 seconds before exiting...`);
			await delay(20000);

			console.log(`Closing...`);
			await receiver.close();
		} finally {
			await this.sbClient.close();
		}
	}
}

module.exports = Receiver;