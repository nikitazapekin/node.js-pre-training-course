const http = require("http");
const url = require("url");
 
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (error) {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}
 
function parsePathParams(pattern, path) {
  const params = {};
  
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");

  if (patternParts.length !== pathParts.length) {
    return params;
  }

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      const paramName = patternParts[i].slice(1);
      params[paramName] = pathParts[i];
    }
  }

  return params;
}
 
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}
 
function validateTodo(todoData, isUpdate = false) {
  const errors = [];
 
  if (!isUpdate && (todoData.title === undefined || todoData.title === null)) {
    errors.push("Title is required");
  } else if (todoData.title !== undefined && todoData.title !== null) {
    if (typeof todoData.title !== "string") {
      errors.push("Title must be a string");
    } else if (todoData.title.trim().length === 0) {
      errors.push("Title cannot be empty or whitespace only");
    } else if (todoData.title.length > 100) {
      errors.push("Title must be 100 characters or less");
    }
  } 
  if (todoData.description !== undefined && todoData.description !== null) {
    if (typeof todoData.description !== "string") {
      errors.push("Description must be a string");
    } else if (todoData.description.length > 500) {
      errors.push("Description must be 500 characters or less");
    }
  }
 
  if (todoData.completed !== undefined && todoData.completed !== null) {
    if (typeof todoData.completed !== "boolean") {
      errors.push("Completed must be a boolean");
    }
  }

  return { isValid: errors.length === 0, errors };
}
 
class TodoServer {
  constructor(port = 3000) {
    this.port = port;
    this.todos = [];
    this.nextId = 1;

    
    this.initializeSampleData();

    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });
  }
 
  initializeSampleData() {
    const sampleTodos = [
      {
        id: this.nextId++,
        title: "Learn Node.js",
        description: "Study Node.js fundamentals",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: this.nextId++,
        title: "Build REST API",
        description: "Create a REST API with Express",
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    this.todos = sampleTodos;
  }
 
  start() {
    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        console.log(`Todo server running on http://localhost:${this.port}`);
        resolve();
      });
    });
  }
 
  stop() {
    return new Promise((resolve) => {
      this.server.close(() => {
        console.log("Server stopped");
        resolve();
      });
    });
  }
 
  async handleRequest(req, res) {
    try {
      const parsedUrl = url.parse(req.url, true);
      const pathname = parsedUrl.pathname;
      const method = req.method;

      
      if (method === "OPTIONS") {
        this.handleCORS(req, res);
        return;
      }

     
      if (pathname === "/todos" && method === "GET") {
        await this.getAllTodos(req, res, parsedUrl.query);
      } else if (pathname.match(/^\/todos\/\d+$/) && method === "GET") {
        const params = parsePathParams("/todos/:id", pathname);
        await this.getTodoById(req, res, params);
      } else if (pathname === "/todos" && method === "POST") {
        await this.createTodo(req, res);
      } else if (pathname.match(/^\/todos\/\d+$/) && method === "PUT") {
        const params = parsePathParams("/todos/:id", pathname);
        await this.updateTodo(req, res, params);
      } else if (pathname.match(/^\/todos\/\d+$/) && method === "DELETE") {
        const params = parsePathParams("/todos/:id", pathname);
        await this.deleteTodo(req, res, params);
      } else {
        sendResponse(res, 404, {
          success: false,
          error: "Not Found",
        });
      }
    } catch (error) {
      console.error("Request handling error:", error);
      sendResponse(res, 500, {
        success: false,
        error: "Internal server error",
      });
    }
  }
 
  async getAllTodos(req, res, query) {
    let filteredTodos = [...this.todos];

    
    if (query.completed !== undefined) {
      const completedFilter = query.completed === "true";
      filteredTodos = filteredTodos.filter(
        (todo) => todo.completed === completedFilter
      );
    }

    sendResponse(res, 200, {
      success: true,
      data: filteredTodos,
      count: filteredTodos.length,
    });
  }
 
  async getTodoById(req, res, params) {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid ID format",
      });
      return;
    }

    const todo = this.todos.find((t) => t.id === id);

    if (!todo) {
      sendResponse(res, 404, {
        success: false,
        error: "Todo not found",
      });
      return;
    }

    sendResponse(res, 200, {
      success: true,
      data: todo,
    });
  }
 
  async createTodo(req, res) {
    const body = await parseBody(req);

    const validation = validateTodo(body, false);

    if (!validation.isValid) {
      sendResponse(res, 400, {
        success: false,
        errors: validation.errors,
      });
      return;
    }

    const newTodo = {
      id: this.nextId++,
      title: body.title.trim(),
      description: body.description || "",
      completed: body.completed || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.todos.push(newTodo);

    sendResponse(res, 201, {
      success: true,
      data: newTodo,
    });
  }
 
  async updateTodo(req, res, params) {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid ID format",
      });
      return;
    }

    const todoIndex = this.todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      sendResponse(res, 404, {
        success: false,
        error: "Todo not found",
      });
      return;
    }

    const body = await parseBody(req);

    const validation = validateTodo(body, true);

    if (!validation.isValid) {
      sendResponse(res, 400, {
        success: false,
        errors: validation.errors,
      });
      return;
    }
 
    const existingTodo = this.todos[todoIndex];

    if (body.title !== undefined) {
      existingTodo.title = body.title.trim();
    }
    if (body.description !== undefined) {
      existingTodo.description = body.description;
    }
    if (body.completed !== undefined) {
      existingTodo.completed = body.completed;
    }

    existingTodo.updatedAt = new Date().toISOString();

    sendResponse(res, 200, {
      success: true,
      data: existingTodo,
    });
  }
 
  async deleteTodo(req, res, params) {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid ID format",
      });
      return;
    }

    const todoIndex = this.todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      sendResponse(res, 404, {
        success: false,
        error: "Todo not found",
      });
      return;
    }

    this.todos.splice(todoIndex, 1);

    sendResponse(res, 200, {
      success: true,
      message: "Todo deleted successfully",
    });
  }
 
  handleCORS(req, res) {
    sendResponse(res, 204, {});
  }
}
 
module.exports = TodoServer;
module.exports.parseBody = parseBody;
module.exports.parsePathParams = parsePathParams;
module.exports.sendResponse = sendResponse;
module.exports.validateTodo = validateTodo;
