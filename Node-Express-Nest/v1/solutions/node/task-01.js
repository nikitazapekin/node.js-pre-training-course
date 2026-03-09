const EventEmitter = require("events");
 
class MessageSystem extends EventEmitter {
  constructor() {
    super();
   
    this.messages = [];
    this.users = new Set();
    this.messageId = 1;
  }
 
  sendMessage(type, content, sender = "System") {
    const message = {
      id: this.messageId++,
      type,
      content,
      timestamp: new Date(),
      sender,
    };

    this.messages.push(message);
 
    if (this.messages.length > 100) {
      this.messages.shift();
    }
 
    this.emit("message", message);
    this.emit(type, message);

    return message;
  }
 
  subscribeToMessages(callback) {
    this.on("message", callback);
  }
 
  subscribeToType(type, callback) {
    this.on(type, callback);
  }
 
  getUserCount() {
    return this.users.size;
  }
 
  getMessageHistory(count = 10) {
    return this.messages.slice(-count);
  }

  /**
   * Add a user to the system
   *
   * Add user to users set (avoid duplicates)
   * Create and emit user-joined event
   *
   * @param {string} username - Username to add
   */
  addUser(username) {
    if (!this.users.has(username)) {
      this.users.add(username);
      this.emit("user-joined", {
        id: this.messageId++,
        type: "user-joined",
        content: `${username} joined the system`,
        timestamp: new Date(),
        sender: username,
      });
    }
  }

  /**
   * Remove a user from the system
   *
   * Remove user from users set
   * Create and emit user-left event
   *
   * @param {string} username - Username to remove
   */
  removeUser(username) {
    if (this.users.has(username)) {
      this.users.delete(username);
      this.emit("user-left", {
        id: this.messageId++,
        type: "user-left",
        content: `${username} left the system`,
        timestamp: new Date(),
        sender: username,
      });
    }
  }

  /**
   * Get all active users
   *
   * Convert users Set to Array and return
   *
   * @returns {array} Array of usernames
   */
  getActiveUsers() {
    return Array.from(this.users);
  }

  /**
   * Clear all messages
   *
   * Clear messages array
   * Emit history-cleared event
   */
  clearHistory() {
    const clearedCount = this.messages.length;
    this.messages = [];
    this.emit("history-cleared", { clearedCount, timestamp: new Date() });
  }

  /**
   * Get system statistics
   *
   * Calculate and return statistics
   *
   * @returns {object} System stats
   */
  getStats() {
    const statsByType = {};
    for (const msg of this.messages) {
      statsByType[msg.type] = (statsByType[msg.type] || 0) + 1;
    }

    return {
      totalMessages: this.messages.length,
      userCount: this.users.size,
      activeUsers: this.users.size,
      messagesByType: statsByType,
    };
  }
}

// Export the MessageSystem class
module.exports = MessageSystem;
