# Todo List Web Application

A dynamic Todo List web application built with Express.js and EJS (Embedded JavaScript) that allows users to efficiently manage their tasks.

## Features

### Core Functionality
- ✅ **Add Tasks**: Create new tasks with priority levels (Low, Medium, High)
- ✏️ **Edit Tasks**: Update existing tasks and their priorities
- 🗑️ **Delete Tasks**: Remove tasks you no longer need
- ✅ **Complete Tasks**: Mark tasks as completed with checkboxes
- 🔄 **Toggle Completion**: Easily mark tasks as done or undo

### Organization & Management
- 🔍 **Search**: Real-time search to find tasks quickly
- 📊 **Sort**: Sort by date, priority, or name
- 🎯 **Filter**: Filter by status (All, Pending, Completed) and priority
- 📥 **Export**: Download all todos as JSON file
- 🗑️ **Bulk Actions**: Clear all completed tasks at once
- 🎨 **Drag & Drop**: Reorder tasks by dragging

### User Experience
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ⌨️ **Keyboard Shortcuts**: Quick actions with keyboard (N, S, /, etc.)
- 🔔 **Toast Notifications**: Beautiful notification system for all actions
- 📈 **Statistics**: View completion percentage and progress bar
- ⚠️ **Input Validation**: Smart validation with helpful error messages
- 🎨 **Modern UI**: Beautiful glassmorphism design with smooth animations

## Tech Stack

- **Backend**: Node.js, Express.js
- **Template Engine**: EJS (Embedded JavaScript)
- **Frontend**: HTML, CSS, JavaScript
- **Storage**: JSON file-based persistence (todos.json)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd "Assignment 7"
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
Assignment 7/
├── index.js              # Express server file
├── package.json          # Node.js dependencies
├── views/
│   └── index.ejs        # Main EJS template
├── public/
│   ├── css/
│   │   └── style.css    # Stylesheet
│   └── js/
│       └── main.js      # Client-side JavaScript
└── README.md            # Project documentation
```

## API Endpoints

- `GET /` - Render the main page with todos
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update an existing todo
- `PATCH /todos/:id/toggle` - Toggle todo completion status
- `DELETE /todos/:id` - Delete a todo
- `DELETE /todos/clear/completed` - Clear all completed todos
- `GET /todos/export` - Export todos as JSON file
- `POST /todos/reorder` - Reorder todos

## Deployment

The application can be deployed to various platforms. Choose one of the following:

### Option 1: Render (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Render**
   - Sign in to [Render](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `todo-list-app` (or your preferred name)
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start` or `node index.js`
   - Click "Create Web Service"
   - Wait for deployment to complete

**Note**: Render provides free tier with automatic deployments on git push.

### Option 2: Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   Or connect your GitHub repo at [vercel.com](https://vercel.com)

**Configuration**: The `.vercel.json` file is already configured.

### Option 3: Railway

1. **Push to GitHub** (same as Render steps)

2. **Deploy on Railway**
   - Sign in to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect the configuration

**Configuration**: The `railway.json` file is already configured.

### Option 4: Netlify

**⚠️ Important**: Netlify is optimized for static sites and serverless functions, not full Express apps with EJS. **For this app, Render or Railway are strongly recommended instead.**

If you still want to try Netlify, see `NETLIFY_DEPLOY.md` for details. However, you'll need significant refactoring to work with Netlify's serverless architecture.

**Better alternatives for Express apps:**
- Render (recommended) - See Option 1
- Railway - See Option 3
- Vercel - See Option 2

### Option 5: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Deploy**
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```

**Configuration**: The `Procfile` is already configured.

### Environment Variables

The app uses the `PORT` environment variable, which is automatically set by most platforms. No additional configuration needed.

### Post-Deployment

After deployment:
1. ✅ Your app will be accessible at the provided URL
2. ✅ Data persists using JSON file storage
3. ✅ Automatic HTTPS is enabled
4. ✅ All features are production-ready

## Deploy Link

🔗 **Live Application**: [Add your deployment URL here](https://your-app-name.onrender.com)

## Usage

1. **Adding a Task**:
   - Enter your task in the input field
   - Select a priority level (Low, Medium, High)
   - Click "Add Task" button
   - An alert will show if the input field is empty

2. **Editing a Task**:
   - Click the "Edit" button on any task
   - Modify the task or priority in the modal
   - Click "Update Task" to save changes

3. **Deleting a Task**:
   - Click the "Delete" button on any task
   - Confirm the deletion

4. **Filtering Tasks**:
   - Use the filter buttons to view tasks by priority
   - Click "All" to view all tasks

## Development

The application uses an in-memory array for data storage. All data will be lost when the server restarts. For production use, consider integrating a database like MongoDB or PostgreSQL.

## License

ISC

## Author

Built as part of the MERN Stack course - Assignment 7

