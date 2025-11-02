const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Data persistence file
const DATA_FILE = path.join(__dirname, 'todos.json');

// In-memory database (array)
let todos = [];
let todoIdCounter = 1;

// Load todos from file
async function loadTodos() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    todos = parsed.todos || [];
    todoIdCounter = parsed.counter || 1;
    // Ensure all todos have completion status
    todos.forEach(todo => {
      if (todo.completed === undefined) {
        todo.completed = false;
      }
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, start with empty array
      todos = [];
      todoIdCounter = 1;
    } else {
      console.error('Error loading todos:', error);
      todos = [];
      todoIdCounter = 1;
    }
  }
}

// Save todos to file
async function saveTodos() {
  try {
    const data = {
      todos: todos,
      counter: todoIdCounter
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving todos:', error);
  }
}

// Initialize data on startup
loadTodos();

// Validation helper
const validatePriority = (priority) => {
  return ['low', 'medium', 'high'].includes(priority);
};

const validateTask = (task) => {
  const trimmed = task ? task.trim() : '';
  if (trimmed === '') {
    return { valid: false, error: 'Task cannot be empty' };
  }
  if (trimmed.length > 200) {
    return { valid: false, error: 'Task cannot exceed 200 characters' };
  }
  return { valid: true, task: trimmed };
};

// Check for duplicate task
const isDuplicate = (task, excludeId = null) => {
  return todos.some(todo => 
    todo.id !== excludeId && 
    todo.task.toLowerCase() === task.toLowerCase()
  );
};

// Routes
app.get('/', (req, res) => {
  try {
    const filter = req.query.filter || 'all';
    const statusFilter = req.query.status || 'all'; // all, completed, pending
    const sortBy = req.query.sort || 'date-desc'; // date-desc, date-asc, priority, name
    let filteredTodos = todos;

    // Filter by priority
    if (filter !== 'all' && validatePriority(filter)) {
      filteredTodos = filteredTodos.filter(todo => todo.priority === filter);
    }

    // Filter by completion status
    if (statusFilter === 'completed') {
      filteredTodos = filteredTodos.filter(todo => todo.completed === true);
    } else if (statusFilter === 'pending') {
      filteredTodos = filteredTodos.filter(todo => todo.completed !== true);
    }

    // Sort todos
    filteredTodos = [...filteredTodos]; // Create a copy to avoid mutating
    filteredTodos.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
          if (priorityDiff !== 0) return priorityDiff;
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name':
          return a.task.localeCompare(b.task);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    // Calculate statistics
    const completedCount = todos.filter(todo => todo.completed === true).length;
    const pendingCount = todos.filter(todo => todo.completed !== true).length;

    res.render('index', {
      todos: filteredTodos,
      filter: filter,
      statusFilter: statusFilter,
      sortBy: sortBy,
      allTodos: todos,
      completedCount: completedCount,
      pendingCount: pendingCount,
      success: req.query.success
    });
  } catch (error) {
    console.error('Error rendering page:', error);
    res.status(500).send('Internal server error');
  }
});

// Add new todo
app.post('/todos', async (req, res) => {
  try {
    const { task, priority } = req.body;

    // Validate task
    const taskValidation = validateTask(task);
    if (!taskValidation.valid) {
      return res.status(400).json({ error: taskValidation.error });
    }

    // Validate priority
    const validPriority = validatePriority(priority) ? priority : 'medium';

    // Check for duplicates
    if (isDuplicate(taskValidation.task)) {
      return res.status(409).json({ error: 'This task already exists' });
    }

    const newTodo = {
      id: todoIdCounter++,
      task: taskValidation.task,
      priority: validPriority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    await saveTodos();
    res.redirect('/?success=added');
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { task, priority } = req.body;

    // Validate task
    const taskValidation = validateTask(task);
    if (!taskValidation.valid) {
      return res.status(400).json({ error: taskValidation.error });
    }

    const todoId = parseInt(id);
    if (isNaN(todoId)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const todoIndex = todos.findIndex(todo => todo.id === todoId);

    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Check for duplicates (excluding current todo)
    if (isDuplicate(taskValidation.task, todoId)) {
      return res.status(409).json({ error: 'This task already exists' });
    }

    todos[todoIndex].task = taskValidation.task;
    todos[todoIndex].updatedAt = new Date().toISOString();
    
    if (priority && validatePriority(priority)) {
      todos[todoIndex].priority = priority;
    }

    await saveTodos();
    res.json({ success: true, todo: todos[todoIndex] });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle todo completion status
app.patch('/todos/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const todoIndex = todos.findIndex(todo => todo.id === todoId);

    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todos[todoIndex].completed = !todos[todoIndex].completed;
    if (todos[todoIndex].completed) {
      todos[todoIndex].completedAt = new Date().toISOString();
    } else {
      delete todos[todoIndex].completedAt;
    }

    await saveTodos();
    res.json({ success: true, todo: todos[todoIndex] });
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const todoIndex = todos.findIndex(todo => todo.id === todoId);

    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todos.splice(todoIndex, 1);
    await saveTodos();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear all completed todos
app.delete('/todos/clear/completed', async (req, res) => {
  try {
    const initialLength = todos.length;
    todos = todos.filter(todo => !todo.completed);
    const deletedCount = initialLength - todos.length;
    
    if (deletedCount > 0) {
      await saveTodos();
    }
    
    res.json({ success: true, deletedCount: deletedCount });
  } catch (error) {
    console.error('Error clearing completed todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export todos as JSON
app.get('/todos/export', (req, res) => {
  try {
    const exportData = {
      todos: todos,
      exportDate: new Date().toISOString(),
      totalTasks: todos.length,
      completedTasks: todos.filter(t => t.completed).length,
      pendingTasks: todos.filter(t => !t.completed).length
    };
    
    const fileName = `todos-${new Date().toISOString().split('T')[0]}.json`;
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Set headers before sending
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', Buffer.byteLength(jsonString, 'utf8'));
    
    // Send the JSON string
    res.send(jsonString);
  } catch (error) {
    console.error('Error exporting todos:', error);
    res.status(500).setHeader('Content-Type', 'application/json');
    res.json({ error: 'Internal server error', message: error.message });
  }
});

// Reorder todos
app.post('/todos/reorder', async (req, res) => {
  try {
    const { todoIds } = req.body;
    
    if (!Array.isArray(todoIds)) {
      return res.status(400).json({ error: 'Invalid todo IDs array' });
    }
    
    // Create a map for quick lookup
    const todoMap = new Map(todos.map(todo => [todo.id, todo]));
    
    // Reorder todos based on provided IDs
    const reorderedTodos = todoIds
      .map(id => todoMap.get(parseInt(id)))
      .filter(todo => todo !== undefined);
    
    // Add any todos that weren't in the reorder list (shouldn't happen, but safety check)
    const reorderedIds = new Set(todoIds.map(id => parseInt(id)));
    const remainingTodos = todos.filter(todo => !reorderedIds.has(todo.id));
    
    todos = [...reorderedTodos, ...remainingTodos];
    await saveTodos();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error reordering todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download Assignment-7.zip
app.get('/download/assignment-7.zip', (req, res) => {
  try {
    const zipPath = path.join(__dirname, 'Assignment-7.zip');
    res.download(zipPath, 'Assignment-7.zip', (err) => {
      if (err) {
        console.error('Error downloading zip file:', err);
        if (!res.headersSent) {
          res.status(404).send('File not found');
        }
      }
    });
  } catch (error) {
    console.error('Error serving zip file:', error);
    res.status(500).send('Internal server error');
  }
});

// 404 handler for API routes - must come AFTER all routes
app.use('/todos', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Static files - must come AFTER API routes to avoid conflicts
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  // Only send JSON if it's an API request
  if (req.path.startsWith('/todos')) {
    res.status(500).json({ error: 'Internal server error', message: err.message });
  } else {
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

