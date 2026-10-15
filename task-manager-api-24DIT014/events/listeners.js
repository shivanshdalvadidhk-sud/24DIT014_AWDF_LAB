const taskEvents = require('./events');

/**
 * Event Listener for 'task-created'
 * Triggered asynchronously after POST /tasks creates a new task in MongoDB.
 * Simulates a background notification service (e.g., email / SMS / push dispatch)
 * with a 2-second non-blocking delay to visibly prove asynchronous execution.
 */
taskEvents.on('task-created', (task) => {
    const receivedTime = new Date().toISOString();
    console.log(`[Notification Listener] 'task-created' event received at ${receivedTime}`);
    console.log(`[Notification Listener] Processing background task notification for: "${task.title}" (User: ${task.user || 'unassigned'})...`);

    // Simulate slow notification processing (e.g., external email service / push webhook)
    setTimeout(() => {
        try {
            // Check for simulated error condition if triggered
            if (task.simulateError) {
                throw new Error(`Simulated notification delivery failure for task "${task.title}"`);
            }

            const completedTime = new Date().toISOString();
            console.log(`[Notification Listener] [BACKGROUND COMPLETE] Notification sent for task "${task.title}" (ID: ${task._id}) at ${completedTime} (Assigned User: ${task.user || 'unassigned'})`);
        } catch (err) {
            // Safely route listener errors to the centralized error listener
            taskEvents.emit('error', err);
        }
    }, 2000); // 2-second artificial delay to demonstrate non-blocking execution
});

/**
 * Supplementary Problem 1: Event Listener for 'task-deleted'
 * Triggered asynchronously after DELETE /tasks/:id removes a task.
 */
taskEvents.on('task-deleted', (task) => {
    const receivedTime = new Date().toISOString();
    console.log(`[Notification Listener] 'task-deleted' event received at ${receivedTime}`);

    setTimeout(() => {
        const completedTime = new Date().toISOString();
        console.log(`[Notification Listener] [BACKGROUND COMPLETE] Cleanup & audit log completed for deleted task "${task.title || task._id}" at ${completedTime}`);
    }, 1000); // 1-second artificial delay
});

/**
 * Supplementary Problem 2: Centralized Error Event Listener
 * Node.js EventEmitter throws an UnhandledException if an 'error' event is emitted
 * without any registered listeners, which would crash the entire process.
 * This listener catches and logs errors safely without crashing the server.
 */
taskEvents.on('error', (err) => {
    const errorTime = new Date().toISOString();
    console.error(`[TaskEvents Error Listener] [ERROR CAUGHT] at ${errorTime}: ${err.message || err}`);
});

console.log("[TaskEvents] Event listeners registered successfully (task-created, task-deleted, error).");

module.exports = taskEvents;
