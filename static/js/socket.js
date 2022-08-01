// Websocket Handler

document.addEventListener('DOMContentLoaded', async function () {

    const streamContainers = document.getElementsByClassName('stream-container');

    if ("WebSocket" in window) {
        for (let i = 0; i < streamContainers.length; i++) {
            // Open websocket to stream data from subscription receiver buffer

            streamContainers[i].prepend(createPElement('Opening socket...'));
            const socket = await new WebSocket(`ws://127.0.0.1:3000/streams/${streamContainers[i].id}`);

            socket.onopen = function () {
                streamContainers[i].prepend(createPElement('Socket connected.'));
            }

            socket.onmessage = function (event) {
                streamContainers[i].prepend(createPElement(event.data));
            }

            socket.onclose = function () {
                streamContainers[i].prepend(createPElement('Socket closed.'));
            }

            socket.onerror = function (error) {
                console.log(error)
                streamContainers[i].prepend(createPElement(`Socket error: ${error}`));
            }
        }
    }
    else {
        for (let i = 0; i < streamContainers.length; i++) {
            streamContainers[i].textContent = 'Websocket not supported!';
        }
    }
})

function createPElement(textContent) {
    element = document.createElement("p");
    element.textContent = textContent;
    return element
}