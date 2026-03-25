# Docker Student Management System

A beginner-friendly Docker project that demonstrates containerization concepts through a practical student management web application.

## 🎯 Project Overview

This project is designed to teach Docker fundamentals through hands-on experience. It includes a complete web application with:

- **Backend API** (Node.js + Express + SQLite)
- **Frontend** (HTML + CSS + JavaScript)
- **Reverse Proxy** (Nginx)
- **Multi-container orchestration** (Docker Compose)

**Perfect for:** Beginners learning Docker, educators teaching containerization, and anyone wanting to understand Docker concepts practically.

---

## ✨ Features

### Application Features
- ➕ Add student records (name, age, father name, Aadhaar number, class)
- 📋 View all students in a responsive table
- ✏️ Edit student details
- 🗑️ Delete students
- 💾 Persistent data storage (SQLite with Docker volumes)

### Learning Features
- 🐳 Complete Docker setup with Dockerfile for each service
- 🔄 Nginx reverse proxy demonstrating container networking
- 📦 Docker Compose for multi-container management
- 📚 Comprehensive documentation explaining every concept
- 🔧 Practical examples of Docker commands
- 🛠️ Troubleshooting guides for common issues

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Docker** installed ([Download Docker Desktop](https://www.docker.com/products/docker-desktop))
- **Docker Compose** (included with Docker Desktop)
- Basic command line knowledge
- A text editor (VS Code, Notepad++, etc.)

**Check if Docker is installed:**
```bash
docker --version
docker-compose --version
```

**Expected output:**
```
Docker version 24.x.x
docker-compose version 2.x.x
```

---

## 🚀 Quick Start

Get the application running in 3 simple steps:

### 1. Clone or download this repository

```bash
git clone <repository-url>
cd docker-guide-
```

### 2. Start all services

```bash
docker-compose up -d
```

**What this does:**
- Builds Docker images for backend, frontend, and nginx
- Creates a custom Docker network
- Starts all three containers
- Sets up volume for database persistence

### 3. Access the application

Open your browser and go to:

**Main Application:** [http://localhost](http://localhost)

**Other access points:**
- Backend API: [http://localhost:3000](http://localhost:3000)
- Frontend (direct): [http://localhost:8080](http://localhost:8080)
- API Health Check: [http://localhost:3000/health](http://localhost:3000/health)

---

## 📁 Project Structure

```
docker-guide-/
├── README.md                          # This file
├── docker-compose.yml                 # Multi-container orchestration
├── .gitignore                         # Git ignore rules
│
├── docs/                              # Detailed documentation
│   ├── 01-docker-basics.md           # Docker concepts explained
│   ├── 02-docker-commands.md         # Command reference with flags
│   ├── 03-dockerfile-guide.md        # Dockerfile instructions
│   ├── 04-docker-compose-guide.md    # Multi-container management
│   ├── 05-networking-guide.md        # Container networking
│   ├── 06-volumes-guide.md           # Data persistence
│   └── 07-troubleshooting.md         # Common issues & solutions
│
├── backend/                           # Backend API service
│   ├── Dockerfile                     # Backend container definition
│   ├── .dockerignore                  # Build exclusions
│   ├── package.json                   # Node.js dependencies
│   ├── server.js                      # Express server
│   ├── database.js                    # SQLite setup
│   ├── routes/
│   │   └── students.js               # Student API endpoints
│   └── data/                          # Database storage (volume mount)
│       └── .gitkeep
│
├── frontend/                          # Frontend service
│   ├── Dockerfile                     # Frontend container definition
│   ├── index.html                     # Main HTML page
│   ├── styles.css                     # Styling
│   └── app.js                         # JavaScript logic
│
└── nginx/                             # Reverse proxy
    ├── Dockerfile                     # Nginx container definition
    └── nginx.conf                     # Routing configuration
```

---

## 🏗️ Architecture

The application uses a **three-tier architecture** with **Nginx as a reverse proxy**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Browser                             │
│                          ↓                                  │
│                    http://localhost                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓ Port 80
            ┌────────────────────────┐
            │   Nginx (Reverse       │
            │   Proxy Container)     │
            │   - Routes traffic     │
            │   - /api/* → Backend   │
            │   - /* → Frontend      │
            └───────┬──────────┬─────┘
                    │          │
        ┌───────────┘          └────────────┐
        │                                   │
        ↓ Port 3000                         ↓ Port 80
┌───────────────────┐            ┌──────────────────┐
│ Backend Container │            │ Frontend         │
│ (Node.js/Express) │            │ Container        │
│ - REST API        │            │ (Nginx)          │
│ - SQLite database │            │ - Static files   │
│ - Port: 3000      │            │ - Port: 80       │
└───────────────────┘            └──────────────────┘
        │
        ↓ Volume mount
┌───────────────────┐
│ ./backend/data/   │
│ (Your Computer)   │
│ - students.db     │
└───────────────────┘
```

**All containers communicate via `student-network` (Docker bridge network)**

---

## 🔌 API Endpoints

The backend provides a RESTful API for student management:

| Method | Endpoint | Description | Example Body |
|--------|----------|-------------|--------------|
| `GET` | `/health` | Health check | - |
| `GET` | `/students` | Get all students | - |
| `GET` | `/students/:id` | Get single student | - |
| `POST` | `/students` | Create new student | `{"name": "John", "age": 20, "father_name": "Mike", "aadhaar_number": "123456789012", "class": "10th"}` |
| `PUT` | `/students/:id` | Update student | `{"name": "John", "age": 21, ...}` |
| `DELETE` | `/students/:id` | Delete student | - |

**Example API call:**
```bash
# Get all students
curl http://localhost:3000/students

# Create a new student
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","age":20,"father_name":"Mike Doe","aadhaar_number":"123456789012","class":"10th"}'
```

---

## 🐳 Docker Commands Cheat Sheet

### Basic Commands

```bash
# Start all services (foreground)
docker-compose up

# Start all services (background)
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove everything including volumes (⚠️ deletes data!)
docker-compose down -v

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs backend

# List running containers
docker-compose ps

# Rebuild images and start
docker-compose up --build -d
```

### Container Management

```bash
# Stop a specific service
docker-compose stop backend

# Restart a specific service
docker-compose restart backend

# Execute command in running container
docker-compose exec backend sh

# Run a one-off command
docker-compose run backend npm test
```

### Debugging

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail 100

# Enter container shell
docker exec -it student-api sh

# Inspect container
docker inspect student-api

# View container resource usage
docker stats
```

**For complete command reference with detailed explanations, see [docs/02-docker-commands.md](./docs/02-docker-commands.md)**

---

## 📚 Documentation

Comprehensive guides are available in the `docs/` directory:

### Getting Started
- **[Docker Basics](./docs/01-docker-basics.md)** - Core concepts: images, containers, why use Docker
- **[Docker Commands](./docs/02-docker-commands.md)** - All commands with flags explained

### Deep Dive
- **[Dockerfile Guide](./docs/03-dockerfile-guide.md)** - Writing Dockerfiles, best practices
- **[Docker Compose Guide](./docs/04-docker-compose-guide.md)** - Multi-container orchestration
- **[Networking Guide](./docs/05-networking-guide.md)** - Container communication
- **[Volumes Guide](./docs/06-volumes-guide.md)** - Data persistence strategies

### Problem Solving
- **[Troubleshooting Guide](./docs/07-troubleshooting.md)** - Common issues and solutions

**Recommended reading order:**
1. Start with Docker Basics to understand fundamental concepts
2. Read Docker Commands to learn how to interact with Docker
3. Study Dockerfile Guide to understand how images are built
4. Explore Docker Compose Guide to manage multiple containers
5. Reference Networking and Volumes guides as needed
6. Use Troubleshooting guide when you encounter issues

---

## 🎓 Learning Objectives

By working through this project, you will learn:

### Docker Fundamentals
- ✅ Difference between images and containers
- ✅ How to write Dockerfiles
- ✅ Layer caching and optimization
- ✅ Building custom Docker images
- ✅ Running and managing containers

### Docker Compose
- ✅ Multi-container application setup
- ✅ Service definitions and configuration
- ✅ Environment variables
- ✅ Depends_on and startup order

### Networking
- ✅ Bridge networks
- ✅ Service name resolution
- ✅ Port mapping vs expose
- ✅ Container-to-container communication
- ✅ Reverse proxy pattern with Nginx

### Data Persistence
- ✅ Volumes vs bind mounts
- ✅ Data persistence across container restarts
- ✅ Volume management

### Best Practices
- ✅ Security considerations
- ✅ Image optimization
- ✅ .dockerignore usage
- ✅ Development vs production configurations

---

## 🔧 Development Workflow

### Making Code Changes

**Backend changes:**
```bash
# 1. Edit files in ./backend/
# 2. Rebuild backend
docker-compose up --build backend -d

# 3. Check logs
docker-compose logs -f backend
```

**Frontend changes:**
```bash
# 1. Edit files in ./frontend/
# 2. Rebuild frontend
docker-compose up --build frontend -d

# 3. Check changes at http://localhost:8080
```

### Adding New Dependencies

**Backend (Node.js):**
```bash
# 1. Add to package.json
# 2. Rebuild image
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Debugging

```bash
# Enter backend container
docker exec -it student-api sh

# Check environment variables
env

# Check if database exists
ls -la /app/data/

# Test API from inside
curl localhost:3000/health
```

---

## 🧹 Cleanup

### Stop and remove containers
```bash
docker-compose down
```

### Remove containers and volumes (⚠️ deletes all data!)
```bash
docker-compose down -v
```

### Remove images
```bash
docker-compose down --rmi all
```

### Complete cleanup (remove everything)
```bash
# Stop and remove containers, networks, volumes, images
docker-compose down -v --rmi all

# Remove orphaned images
docker image prune -a

# Remove orphaned volumes
docker volume prune

# Remove everything (nuclear option!)
docker system prune -a --volumes
```

---

## ❓ Troubleshooting

### Application won't start?

```bash
# Check logs
docker-compose logs

# Rebuild everything
docker-compose down
docker-compose up --build -d
```

### Port already in use?

```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Use different port in docker-compose.yml
ports:
  - "3001:3000"
```

### Can't access the application?

1. Check containers are running: `docker-compose ps`
2. Check logs: `docker-compose logs`
3. Verify port mapping: `docker ps` (look at PORTS column)
4. Try accessing directly: http://localhost:3000 (backend), http://localhost:8080 (frontend)

### Data not persisting?

- Check volume is mounted: `docker inspect student-api`
- Check `./backend/data/` folder exists
- Ensure you're not using `docker-compose down -v` (removes volumes)

**For more troubleshooting help, see [docs/07-troubleshooting.md](./docs/07-troubleshooting.md)**

---

## 🚀 Next Steps & Enhancements

Once you're comfortable with the basics, try these enhancements:

### Beginner
- [ ] Add more student fields (email, phone number)
- [ ] Add search/filter functionality
- [ ] Improve UI styling
- [ ] Add input validations

### Intermediate
- [ ] Replace SQLite with PostgreSQL (learn multi-container databases)
- [ ] Add authentication system
- [ ] Create separate dev/prod Docker Compose files
- [ ] Add health checks to services

### Advanced
- [ ] Add Redis for caching
- [ ] Implement CI/CD pipeline
- [ ] Create multi-stage Dockerfiles for smaller images
- [ ] Deploy to cloud (AWS, Azure, Google Cloud)
- [ ] Set up Docker Swarm or Kubernetes

---

## 🤝 Contributing

This is a learning project! Contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📖 Additional Resources

### Official Documentation
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)

### Tutorials
- [Docker Get Started Guide](https://docs.docker.com/get-started/)
- [Docker for Beginners](https://docker-curriculum.com/)

### Tools
- [Docker Hub](https://hub.docker.com/) - Public Docker image registry
- [Docker Desktop](https://www.docker.com/products/docker-desktop) - Docker for Windows/Mac

---

## 📝 License

This project is created for educational purposes. Feel free to use it for learning and teaching Docker concepts.

---

## 🎉 Acknowledgments

This project was created to make learning Docker easier and more practical. Special thanks to:

- The Docker community for excellent documentation
- All beginners learning Docker - your feedback helps improve this project
- Everyone who contributes to making containerization more accessible

---

## 💬 Questions or Feedback?

- **Found a bug?** Open an issue
- **Have a question?** Check the documentation in `docs/` first
- **Want to suggest an improvement?** Open a pull request or issue

---

**Happy Learning! 🐳🚀**

Start exploring Docker with this hands-on project. Remember: the best way to learn is by doing!
