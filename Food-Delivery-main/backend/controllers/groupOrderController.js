import groupOrderModel from "../models/groupOrderModel.js";

// Start a group order
const startGroupOrder = async (req, res) => {
    try {
        const { adminName, adminId } = req.body;
        const newGroup = new groupOrderModel({
            adminId,
            adminName,
            members: [{ userId: adminId, name: adminName }]
        });
        await newGroup.save();
        res.json({ success: true, groupId: newGroup._id });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error starting group order" });
    }
};

// Join a group order
const joinGroupOrder = async (req, res) => {
    try {
        const { groupId, name, userId } = req.body;
        const group = await groupOrderModel.findById(groupId);
        if (!group) return res.json({ success: false, message: "Group not found" });

        // Add member if not exists
        const exists = group.members.find(m => m.userId === userId);
        if (!exists) {
            group.members.push({ userId, name });
            await group.save();
        }
        res.json({ success: true, group });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error joining group" });
    }
};

// Add item to group cart
const addItemToGroup = async (req, res) => {
    try {
        const { groupId, item, userName, userId } = req.body;
        const group = await groupOrderModel.findById(groupId);
        if (!group) return res.json({ success: false, message: "Group not found" });

        group.items.push({
            foodId: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            addedBy: userName,
            addedByUserId: userId
        });
        await group.save();
        res.json({ success: true, message: "Item added to group cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding item" });
    }
};

// Remove item from group cart
const removeItemFromGroup = async (req, res) => {
    try {
        const { groupId, itemId } = req.body;
        const group = await groupOrderModel.findById(groupId);
        if (!group) return res.json({ success: false, message: "Group not found" });

        group.items = group.items.filter(i => i._id.toString() !== itemId);
        await group.save();
        res.json({ success: true, message: "Item removed from group cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing item" });
    }
};

// Send chat message
const sendGroupMessage = async (req, res) => {
    try {
        const { groupId, userId, name, text } = req.body;
        const group = await groupOrderModel.findById(groupId);
        if (!group) return res.json({ success: false, message: "Group not found" });

        group.messages.push({ userId, name, text });
        // Keep only last 100 messages for performance
        if (group.messages.length > 100) group.messages.shift();
        
        await group.save();
        res.json({ success: true, message: "Message sent" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error sending message" });
    }
};

// Get current group data (for polling)
const getGroupData = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await groupOrderModel.findById(groupId);
        if (!group) return res.json({ success: false, message: "Group not found" });
        res.json({ success: true, group });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching data" });
    }
};

export { startGroupOrder, joinGroupOrder, addItemToGroup, removeItemFromGroup, getGroupData, sendGroupMessage };
