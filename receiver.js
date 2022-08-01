const { ServiceBusClient } = require("@azure/service-bus");

class Receiver {
	constructor({queueName, topicName, subscriptionName}) {
		this.queueName = queueName;
		this.topicName = topicName;
		this.subscriptionName = subscriptionName;
	}

	sbClient = new ServiceBusClient(process.env.SERVICEBUS_CONNECTION_STRING);

	async run() {

		let receiver;
		console.log(this.queueName)

		if (this.queueName == undefined) {
			console.log(`Starting receiver for topic ${this.topicName} on subscription ${this.subscriptionName}.`);
			receiver = this.sbClient.createReceiver(this.topicName, this.subscriptionName);
		} else {
			console.log(`Starting receiver for queue ${this.queueName}.`);
			receiver = this.sbClient.createReceiver(this.queueName);
		}

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