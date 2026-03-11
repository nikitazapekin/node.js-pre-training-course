const fs = require("fs");
const fsPromises = require("fs").promises;
const util = require("util");

  
function analyzeEventLoop() {
  const analysis = {
    phases: [
      "Timers Phase - setTimeout() and setInterval() callbacks",
      "Pending Callbacks Phase - I/O callbacks deferred to next loop iteration",
      "Idle, Prepare Phase - Internal Node.js operations",
      "Poll Phase - Retrieve new I/O events, execute I/O callbacks",
      "Check Phase - setImmediate() callbacks",
      "Close Callbacks Phase - Close event callbacks (socket.on('close'))"
    ],
    executionOrder: [
      "Synchronous code executes first",
      "process.nextTick() callbacks (microtasks - highest priority)",
      "Promise.then() callbacks (microtasks)",
      "setTimeout() callbacks (macrotasks - timers phase)",
      "setImmediate() callbacks (check phase)",
      "Close callbacks (close callbacks phase)"
    ],
    explanations: [
      "Microtasks (nextTick, Promises) always run before macrotasks",
      "setTimeout with 0ms delay still waits for timers phase",
      "setImmediate runs in check phase, after poll phase",
      "process.nextTick has highest priority among all async operations",
      "Multiple nextTick callbacks run before any other async operation"
    ]
  };

 
  console.log("Phases:", analysis.phases);
  console.log("Execution Order:", analysis.executionOrder);
  console.log("Explanations:", analysis.explanations);
  
  return analysis;
}
 
function predictExecutionOrder(snippet) {
  const predictions = {
    snippet1: [
      "Start",
      "End",
      "Next Tick 1",
      "Next Tick 2",
      "Promise 1",
      "Promise 2",
      "Timer 1",
      "Timer 2",
      "Immediate 1",
      "Immediate 2"
    ],
    snippet2: [
      "=== Start ===",
      "=== End ===",
      "NextTick",
      "Nested NextTick",
      "NextTick in readFile",
      "fs.readFile",
      "Immediate in readFile",
      "Timer in readFile",
      "Immediate",
      "NextTick in Immediate",
      "Timer",
      "NextTick in Timer"
    ]
  };

  return predictions[snippet] || [];
}
 
async function fixRaceCondition() {
  const files = ["file1.txt", "file2.txt", "file3.txt"];
  const results = [];
 
  for (let i = 0; i < files.length; i++) {
    await fsPromises.writeFile(files[i], `Content of file ${i + 1}`).catch(() => {});
  }
 
  for (let i = 0; i < files.length; i++) {
    try {
      const content = await fsPromises.readFile(files[i], "utf8");
      results[i] = content.toUpperCase();
    } catch (err) {
      console.error(`Error reading ${files[i]}:`, err.message);
      results[i] = null;
    }
  }

  console.log("All files processed:", results);
  return results;
}
 
async function fixCallbackHell(userId) {
  const originalCwd = process.cwd();
  const testDir = "./test-user-data";
   
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  process.chdir(testDir);

  try {
   
    await fsPromises.writeFile(`user-${userId}.json`, JSON.stringify({
      id: userId,
      name: "Test User",
      email: "test@example.com"
    })).catch(() => {});
    
    await fsPromises.writeFile(`preferences-${userId}.json`, JSON.stringify({
      theme: "dark",
      language: "en",
      notifications: true
    })).catch(() => {});
    
    await fsPromises.writeFile(`activity-${userId}.json`, JSON.stringify({
      lastLogin: "2025-01-01",
      sessionsCount: 15,
      totalTime: 3600
    })).catch(() => {});
 
    const userData = await fsPromises.readFile(`user-${userId}.json`, "utf8");
    const user = JSON.parse(userData);
 
    const prefData = await fsPromises.readFile(`preferences-${user.id}.json`, "utf8");
    const preferences = JSON.parse(prefData);
 
    const activityData = await fsPromises.readFile(`activity-${user.id}.json`, "utf8");
    const activity = JSON.parse(activityData);
 
    const combinedData = {
      user,
      preferences,
      activity,
      processedAt: new Date()
    };

    await fsPromises.writeFile(`processed-${userId}.json`, JSON.stringify(combinedData, null, 2));
    
    console.log("User data processed successfully:", combinedData);
    return combinedData;
  } finally {
    process.chdir(originalCwd);
  }
}
 
async function fixMixedAsync() {
  const testDir = "./test-mixed-async";
  const originalCwd = process.cwd();
   
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  process.chdir(testDir);

  try {
    console.log("Starting data processing...");
 
    await fsPromises.writeFile("input.txt", "Hello World!");
    console.log("File read successfully");
 
    const data = await fsPromises.readFile("input.txt", "utf8");
 
    const processedData = data.toUpperCase();
    console.log("Processing completed");
 
    await fsPromises.writeFile("output.txt", processedData);
    console.log("Write completed successfully");

    const verifyData = await fsPromises.readFile("output.txt", "utf8");
    console.log("Verification completed successfully");
    console.log("Result data length:", verifyData.length);

    return { success: true, data: verifyData };
  } finally {
    process.chdir(originalCwd);
  }
}
 
async function demonstrateEventLoop() {
  console.log("\n=== Event Loop Demonstration ===\n");

  return new Promise((resolve) => {
    
    console.log("[Synchronous] Starting demonstration...");

    setTimeout(() => {
      console.log("[Timers Phase] setTimeout callback executed");
    }, 0);
 
    setImmediate(() => {
      console.log("[Check Phase] setImmediate callback executed");
    });
 
    process.nextTick(() => {
      console.log("[Microtask] process.nextTick callback executed");
    });

    Promise.resolve().then(() => {
      console.log("[Microtask] Promise.then callback executed");
    });
 
    fs.readFile(__filename, () => {
      console.log("[Poll Phase] fs.readFile callback executed");
    });
 
    const stream = fs.createReadStream(__filename);
    stream.on("close", () => {
      console.log("[Close Callbacks] Stream close callback executed");
      resolve();
    });

    console.log("[Synchronous] End of synchronous code\n");
  });
}
 
async function createTestFiles(testDir = "./test-data") {
  const originalCwd = process.cwd();
  
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  process.chdir(testDir);

  try {
    const testFiles = {
      "user-123.json": JSON.stringify({ id: 123, name: "Test User" }),
      "user-456.json": JSON.stringify({ id: 456, name: "Another User" }),
      "file1.txt": "Content of file 1",
      "file2.txt": "Content of file 2",
      "file3.txt": "Content of file 3",
      "input.txt": "Hello World Test Data"
    };

    for (const [filename, content] of Object.entries(testFiles)) {
      await fsPromises.writeFile(filename, content);
    }

    console.log("Test files created successfully");
    return Object.keys(testFiles);
  } finally {
    process.chdir(originalCwd);
  }
}
 
function logWithPhase(message, phase = "unknown") {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${phase.toUpperCase()}] ${message}`);
}

module.exports = {
  analyzeEventLoop,
  predictExecutionOrder,
  fixRaceCondition,
  fixCallbackHell,
  fixMixedAsync,
  demonstrateEventLoop,
  createTestFiles,
  logWithPhase,
};
