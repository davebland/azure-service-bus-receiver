const { ServiceBusClient } = require("@azure/service-bus");
const fs = require('fs/promises');

class Receiver {
	constructor({queueName, topicName, subscriptionName}) {
		this.queueName = queueName;
		this.topicName = topicName;
		this.subscriptionName = subscriptionName;
	}

	sbClient = new ServiceBusClient(process.env.SERVICEBUS_CONNECTION_STRING);

	async run() {

		let receiver;

		if (this.queueName == undefined) {
			console.log(`Starting receiver for topic ${this.topicName} on subscription ${this.subscriptionName}.`);
			receiver = this.sbClient.createReceiver(this.topicName, this.subscriptionName);
		} else {
			console.log(`Starting receiver for queue ${this.queueName}.`);
			receiver = this.sbClient.createReceiver(this.queueName);
		}

		try {
			const subscription = receiver.subscribe({
				processMessage: async (message) => {
					// Write recieved message into buffer file & append a new line
					console.log(`Received message: ${message.body}`);
					message.body += '\n';
					await fs.writeFile(`buffers/${this.queueName || this.subscriptionName}`, message.body, { flag: 'a' }, err => {
						console.log(`Error writing message to buffer file for ${this.queueName || this.subscriptionName}: ${err}`)
					});
					receiver.abandonMessage(message); // Leave in queue for testing
				},

				processError: async (args) => {
					console.log(`Error from source ${args.errorSource} occurred: `, args.error);
					await subscription.close();
				}
			});

			console.log(`Receiving messages for 60 seconds before exiting...`);
			await delay(60000);

			console.log(`Closing subscription...`);
			await receiver.close();
		} finally {
			await this.sbClient.close();
		}
	}
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = Receiver;