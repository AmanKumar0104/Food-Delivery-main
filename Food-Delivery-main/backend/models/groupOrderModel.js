import mongoose from "mongoose";

const groupOrderSchema = new mongoose.Schema({
    adminId: { type: String, required: true },
    adminName: { type: String, required: true },
    status: { type: String, default: "active" }, // active, completed
    members: [{
        userId: { type: String },
        name: { type: String },
        isJoined: { type: Boolean, default: true }
    }],
    items: [{
        foodId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        addedBy: { type: String, required: true },
        addedByUserId: { type: String, required: true },
        image: { type: String }
    }],
    messages: [{
        userId: { type: String, required: true },
        name: { type: String, required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

const groupOrderModel = mongoose.models.groupOrder || mongoose.model("groupOrder", groupOrderSchema);
export default groupOrderModel;
