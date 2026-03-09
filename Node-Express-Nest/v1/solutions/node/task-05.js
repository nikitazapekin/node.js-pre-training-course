 

const http = require("http");
const url = require("url");
const { EventEmitter } = require("events");
 
function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(data);
}

function parseIdFromPath(pathname) {
  const m = pathname.match(/^\/todos\/(\d+)$/);
  return m ? Number(m[1]) : null;
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function nowISO() {
  return new Date().toISOString();
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}
 
class AnalyticsTracker {
  constructor() {
    this.stats = {
      totalCreated: 0,
      totalUpdated: 0,
      totalDeleted: 0,
      totalViews: 0,
      errors: 0,
      dailyStats: {},
    };
  }

  _bumpDaily(field) {
    const today = getTodayKey();
    if (!this.stats.dailyStats[today]) {
      this.stats.dailyStats[today] = {
        created: 0,
        updated: 0,
        deleted: 0,
        views: 0,
      };
    }
    if (this.stats.dailyStats[today][field] !== undefined) {
      this.stats.dailyStats[today][field]++;
    }
  }

  trackCreated() {
    this.stats.totalCreated++;
    this._bumpDaily("created");
  }

  trackUpdated() {
    this.stats.totalUpdated++;
    this._bumpDaily("updated");
  }

  trackDeleted() {
    this.stats.totalDeleted++;
    this._bumpDaily("deleted");
  }

  trackViewed() {
    this.stats.totalViews++;
    this._bumpDaily("views");
  }

  trackError() {
    this.stats.errors++;
  }

  getStats() {
    return {
      ...this.stats,
    };
  }
}
 

class ConsoleLogger {
  todoCreated(data) {
    console.log(
      `📝 [${data.timestamp}] Created "${data.todo.title}" (ID: ${data.todo.id})`
    );
  }

  todoUpdated(data) {
    console.log(
      `✏️  [${data.timestamp}] Updated ID ${
        data.newTodo.id
      }; changed: ${data.changes.join(", ")}`
    );
  }

  todoDeleted(data) {
    console.log(
      `🗑️  [${data.timestamp}] Deleted "${data.todo.title}" (ID: ${data.todo.id})`
    );
  }

  todoViewed(data) {
    console.log(`👁️  [${data.timestamp}] Viewed ID ${data.todo.id}`);
  }

  todosListed(data) {
    console.log(`📃 [${data.timestamp}] Listed todos count=${data.count}`);
  }

  todoNotFound(data) {
    console.warn(
      `⚠️  [${data.timestamp}] Not found: id=${data.todoId} op=${data.operation}`
    );
  }

  validationError(data) {
    console.error(
      `❌ [${data.timestamp}] Validation error: ${data.errors.join(", ")}`
    );
  }

  serverError(data) {
    console.error(
      `💥 [${data.timestamp}] Server error in ${data.operation}: ${
        data.error && data.error.message
      }`
    );
  }
}
 
function validateTodoPayload(payload, isCreate = false) {
  const errors = [];
  const out = {};
 
  if (isCreate) {
    if (payload.title === undefined || payload.title === null) {
      errors.push("Title is required");
    } else if (typeof payload.title !== "string") {
      errors.push("Title must be a string");
    } else if (payload.title.trim().length === 0) {
      errors.push("Title cannot be empty");
    } else {
      out.title = payload.title.trim();
    }
  } else if (payload.title !== undefined) {
    if (typeof payload.title !== "string") {
      errors.push("Title must be a string");
    } else if (payload.title.trim().length === 0) {
      errors.push("Title cannot be empty");
    } else {
      out.title = payload.title.trim();
    }
  } 
  if (payload.description !== undefined) {
    if (typeof payload.description !== "string") {
      errors.push("Description must be a string");
    } else {
      out.description = payload.description;
    }
  }
 
  if (payload.completed !== undefined) {
    if (typeof payload.completed !== "boolean") {
      errors.push("Completed must be a boolean");
    } else {
      out.completed = payload.completed;
    }
  }

  return { errors, values: out };
}

class TodoServer extends EventEmitter {
  constructor(port = 3000) {
    super();
    this.port = port;
    this.todos = [];
    this.nextId = 1;
 
    this.analytics = new AnalyticsTracker();
   
    this.logger = new ConsoleLogger();
   
    this.recentEvents = [];

    this.server = null;

    this._wireDefaultListeners();
  }

  _wireDefaultListeners() {
    const remember = (eventType) => (data) => {
      this.recentEvents.push({ eventType, timestamp: nowISO(), data });
      if (this.recentEvents.length > 100) this.recentEvents.shift();
    };
   
    [
      "todoCreated",
      "todoUpdated",
      "todoDeleted",
      "todoViewed",
      "todosListed",
      "todoNotFound",
      "validationError",
      "serverError",
    ].forEach((evt) => this.on(evt, remember(evt)));
 
    this.on("todoCreated", (d) => this.logger.todoCreated(d));
    this.on("todoUpdated", (d) => this.logger.todoUpdated(d));
    this.on("todoDeleted", (d) => this.logger.todoDeleted(d));
    this.on("todoViewed", (d) => this.logger.todoViewed(d));
    this.on("todosListed", (d) => this.logger.todosListed(d));
    this.on("todoNotFound", (d) => this.logger.todoNotFound(d));
    this.on("validationError", (d) => this.logger.validationError(d));
    this.on("serverError", (d) => this.logger.serverError(d));
 
    this.on("todoCreated", () => this.analytics.trackCreated());
    this.on("todoUpdated", () => this.analytics.trackUpdated());
    this.on("todoDeleted", () => this.analytics.trackDeleted());
    this.on("todoViewed", () => this.analytics.trackViewed());
    this.on("validationError", () => this.analytics.trackError());
    this.on("serverError", () => this.analytics.trackError());
  }
 
  async start() {
    return new Promise((resolve) => {
      this.server = http.createServer((req, res) => {
        this._handleRequest(req, res);
      });
      this.server.listen(this.port, () => {
        console.log(`Todo server running on http://localhost:${this.port}`);
        resolve();
      });
    });
  }
 
  async stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log("Server stopped");
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
 
  async _handleRequest(req, res) {
    try {
      const parsedUrl = url.parse(req.url, true);
      const pathname = parsedUrl.pathname;
      const method = req.method;

     
      if (method === "OPTIONS") {
        sendJson(res, 204, {});
        return;
      }

      
      if (pathname === "/todos" && method === "GET") {
        await this.handleGetAllTodos(req, res, parsedUrl.query);
      } else if (pathname === "/todos" && method === "POST") {
        await this.handleCreateTodo(req, res);
      } else if (pathname === "/analytics" && method === "GET") {
        await this.handleGetAnalytics(req, res);
      } else if (pathname === "/events" && method === "GET") {
        await this.handleGetEvents(req, res);
      } else {
        const id = parseIdFromPath(pathname);
        if (id !== null) {
          if (method === "GET") {
            await this.handleGetTodoById(req, res, id);
          } else if (method === "PUT") {
            await this.handleUpdateTodo(req, res, id);
          } else if (method === "DELETE") {
            await this.handleDeleteTodo(req, res, id);
          } else {
            sendJson(res, 404, { success: false, error: "Not Found" });
          }
        } else {
          sendJson(res, 404, { success: false, error: "Not Found" });
        }
      }
    } catch (error) {
      
      if (error.message === "Invalid JSON") {
        this.emit("validationError", {
          timestamp: nowISO(),
          errors: ["Invalid JSON"],
        });
        sendJson(res, 400, { success: false, errors: ["Invalid JSON"] });
        return;
      }

      this.emit("serverError", {
        timestamp: nowISO(),
        operation: "_handleRequest",
        error,
      });
      sendJson(res, 500, { success: false, error: error.message });
    }
  }

  async handleGetAllTodos(req, res, query) {
    let filteredTodos = [...this.todos];

    if (query.completed !== undefined) {
      const completedFilter = query.completed === "true";
      filteredTodos = filteredTodos.filter(
        (todo) => todo.completed === completedFilter
      );
    }

    this.emit("todosListed", {
      timestamp: nowISO(),
      count: filteredTodos.length,
    });

    sendJson(res, 200, {
      success: true,
      data: filteredTodos,
      count: filteredTodos.length,
    });
  }

  async handleGetTodoById(req, res, id) {
    const todo = this.todos.find((t) => t.id === id);

    if (!todo) {
      this.emit("todoNotFound", {
        timestamp: nowISO(),
        todoId: id,
        operation: "getById",
      });
      sendJson(res, 404, { success: false, error: "Todo not found" });
      return;
    }

    this.emit("todoViewed", {
      timestamp: nowISO(),
      todo,
    });

    sendJson(res, 200, { success: true, data: todo });
  }

  async handleCreateTodo(req, res) {
    const body = await parseBody(req);
    const validation = validateTodoPayload(body, true);

    if (validation.errors.length > 0) {
      this.emit("validationError", {
        timestamp: nowISO(),
        errors: validation.errors,
      });
      sendJson(res, 400, { success: false, errors: validation.errors });
      return;
    }

    const newTodo = {
      id: this.nextId++,
      title: validation.values.title,
      description: validation.values.description || "",
      completed: validation.values.completed !== undefined ? validation.values.completed : false,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };

    this.todos.push(newTodo);

    this.emit("todoCreated", {
      timestamp: nowISO(),
      todo: newTodo,
    });

    sendJson(res, 201, { success: true, data: newTodo });
  }

  async handleUpdateTodo(req, res, id) {
    const todoIndex = this.todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      this.emit("todoNotFound", {
        timestamp: nowISO(),
        todoId: id,
        operation: "update",
      });
      sendJson(res, 404, { success: false, error: "Todo not found" });
      return;
    }

    const body = await parseBody(req);
    const validation = validateTodoPayload(body, false);

    if (validation.errors.length > 0) {
      this.emit("validationError", {
        timestamp: nowISO(),
        errors: validation.errors,
      });
      sendJson(res, 400, { success: false, errors: validation.errors });
      return;
    }

    const existingTodo = this.todos[todoIndex];
    const changes = [];

    if (validation.values.title !== undefined) {
      existingTodo.title = validation.values.title;
      changes.push("title");
    }
    if (validation.values.description !== undefined) {
      existingTodo.description = validation.values.description;
      changes.push("description");
    }
    if (validation.values.completed !== undefined) {
      existingTodo.completed = validation.values.completed;
      changes.push("completed");
    }

    existingTodo.updatedAt = nowISO();

    this.emit("todoUpdated", {
      timestamp: nowISO(),
      newTodo: existingTodo,
      changes,
    });

    sendJson(res, 200, { success: true, data: existingTodo });
  }

  async handleDeleteTodo(req, res, id) {
    const todoIndex = this.todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      this.emit("todoNotFound", {
        timestamp: nowISO(),
        todoId: id,
        operation: "delete",
      });
      sendJson(res, 404, { success: false, error: "Todo not found" });
      return;
    }

    const deletedTodo = this.todos[todoIndex];
    this.todos.splice(todoIndex, 1);

    this.emit("todoDeleted", {
      timestamp: nowISO(),
      todo: deletedTodo,
    });

    sendJson(res, 200, { success: true, message: "Todo deleted successfully" });
  }

  async handleGetAnalytics(req, res) {
    const stats = this.analytics.getStats();
    sendJson(res, 200, { success: true, data: stats });
  }

  async handleGetEvents(req, res) {
    sendJson(res, 200, { success: true, data: this.recentEvents });
  }
}

module.exports = { TodoServer, AnalyticsTracker, ConsoleLogger, validateTodoPayload };
