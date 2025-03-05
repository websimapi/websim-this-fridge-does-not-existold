class FridgeSocketManager {
    constructor() {
        this.room = new WebsimSocket();
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.room.onmessage = (event) => {
            const data = event.data;
            switch (data.type) {
                case "connected":
                    console.log(`Client ${data.clientId}, ${data.username} connected`);
                    break;
                case "disconnected":
                    console.log(`Client ${data.clientId}, ${data.username} disconnected`);
                    break;
                case "fridgeOpened":
                    this.handleFridgeOpenedEvent(data);
                    break;
                default:
                    console.log("Received event:", data);
            }
        };
    }

    handleFridgeOpenedEvent(data) {
        // This will be implemented in app.jsx to handle fridge open events
        if (typeof window.handleFridgeOpenedEvent === 'function') {
            window.handleFridgeOpenedEvent(data);
        }
    }

    sendFridgeOpenedEvent(fridgeId) {
        this.room.send({
            type: "fridgeOpened",
            fridgeId: fridgeId
        });
    }

    async createFridgeRecord(description, contents, imageUrl) {
        try {
            const fridge = await this.room.collection('fridge').create({
                description: description,
                contents: contents,
                imageUrl: imageUrl,
            });
            return fridge;
        } catch (error) {
            console.error("Error creating fridge record:", error);
            throw error;
        }
    }

    getFridgeList() {
        return this.room.collection('fridge').getList();
    }

    subscribeFridges(callback) {
        return this.room.collection('fridge').subscribe(callback);
    }

    async getCreatorUsername() {
        const creator = await window.websim.getCreatedBy();
        return creator.username;
    }
}

// Initialize the socket manager
const fridgeSocketManager = new FridgeSocketManager();

