# Docker Beginner's Guide

## 1. Introduction

### What is Docker?

Docker is like a **lightweight virtual box** that packages your application with everything it needs to run - code, libraries, and system tools. Think of it as a container that holds your app and all its dependencies together.

**Real-world analogy:** Imagine shipping a physical product. You put it in a container with all the packaging materials it needs. No matter where you ship it, the product arrives safely and works the same way. Docker does the same for software.

### Why Use Docker?

- **Works everywhere:** "It works on my machine" problem solved! If it runs in a Docker container on your laptop, it will run the same way on any server.
- **Easy setup:** No need to install tons of dependencies. Just run the container.
- **Isolated environments:** Each container runs independently without affecting others.
- **Saves time:** Share your work with others easily, and they can run it instantly.

---

## 2. Basic Docker Commands

### Check Docker Version

```bash
docker --version
```

**What it does:** Shows which version of Docker you have installed.

**Example output:**
```
Docker version 24.0.7, build afdd53b
```

---

### Run Hello World

```bash
docker run hello-world
```

**What it does:** Downloads and runs a test container to verify Docker is working correctly.

**Use case:** This is your first Docker command to confirm everything is set up properly.

---

### Pull an Image

```bash
docker pull nginx
```

**What it does:** Downloads an image from Docker Hub (online storage for Docker images) to your computer.

**Example:** This downloads the nginx web server image.

**Why use it:** Before running a container, you need its image. This command downloads it without running it immediately.

---

### Docker Hub Basics

#### What is Docker Hub?

Docker Hub is like the "App Store" for Docker images. It's an online library where you can find thousands of pre-built images.

**Website:** https://hub.docker.com

#### Finding Images

**Search from command line:**
```bash
docker search nginx
```

**Search on Docker Hub website:**
- Go to hub.docker.com
- Search for "nginx", "postgres", "node", etc.

#### Understanding Image Tags

Images have versions called **tags**.

**Format:** `image-name:tag`

**Examples:**
```bash
docker pull nginx:latest        # Latest version (default)
docker pull nginx:1.25.3        # Specific version
docker pull postgres:15         # Postgres version 15
docker pull node:18-alpine      # Node.js 18 on Alpine Linux (smaller)
```

**Why use specific tags:**
- `latest` might change, breaking your app
- Specific versions ensure consistency
- Good practice: always specify the version

**Example:**
```bash
# Not recommended (unpredictable)
docker pull nginx:latest

# Recommended (predictable)
docker pull nginx:1.25.3
```

---

### Run a Container

```bash
docker run nginx
```

**What it does:** Creates and starts a container from an image.

**Better example with port mapping:**
```bash
docker run -p 8080:80 nginx
```

**Explanation:**
- `-p 8080:80` maps port 80 inside the container to port 8080 on your computer
- Now you can visit `http://localhost:8080` in your browser to see nginx running!

**Run in background:**
```bash
docker run -d -p 8080:80 nginx
```
- `-d` runs the container in detached mode (background)

---

### Name Your Container

```bash
docker run -d -p 8080:80 --name my-web-server nginx
```

**What it does:** Gives your container a friendly name instead of a random one.

**Why use it:**
- Easier to remember than random IDs
- Easier to stop/start: `docker stop my-web-server`
- Makes command clearer: You know what the container does

**Example:**
```bash
# Without name - hard to identify
docker stop silly_einstein

# With name - clear and easy
docker stop my-web-server
```

---

### List Running Containers

```bash
docker ps
```

**What it does:** Shows all currently running containers.

**Example output:**
```
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                  NAMES
abc123def456   nginx     "nginx -g 'daemon of…"   2 minutes ago   Up 2 minutes   0.0.0.0:8080->80/tcp   silly_einstein
```

---

### List All Containers (Including Stopped)

```bash
docker ps -a
```

**What it does:** Shows all containers, both running and stopped.

**Use case:** See containers that have exited or stopped.

---

### Stop a Container

```bash
docker stop abc123def456
```

**What it does:** Gracefully stops a running container.

**Example:** Replace `abc123def456` with the actual container ID from `docker ps`.

**Tip:** You can use just the first few characters of the ID:
```bash
docker stop abc
```

---

### Start a Stopped Container

```bash
docker start abc123def456
```

**What it does:** Restarts a container that was previously stopped.

**Difference from `docker run`:** This starts an existing container. `docker run` creates a new one.

---

### Remove a Container

```bash
docker rm abc123def456
```

**What it does:** Deletes a stopped container.

**Note:** The container must be stopped first. To force remove:
```bash
docker rm -f abc123def456
```

---

### Remove an Image

```bash
docker rmi nginx
```

**What it does:** Deletes an image from your computer.

**Use case:** Free up disk space by removing images you no longer need.

**Note:** All containers using this image must be removed first.

---

### Execute Command Inside Container

```bash
docker exec -it abc123def456 bash
```

**What it does:** Opens a terminal inside a running container.

**Explanation:**
- `-it` makes it interactive (you can type commands)
- `bash` opens a bash shell
- Now you're "inside" the container!

**Example use case:**
```bash
docker exec -it abc123def456 ls
```
This lists files inside the container without entering it.

**To exit:** Type `exit` and press Enter.

---

### View Container Logs

```bash
docker logs abc123def456
```

**What it does:** Shows the output (logs) from a container.

**Use case:** Debugging - see what's happening inside your container, find errors.

**Example:**
```bash
# See all logs
docker logs my-web-server

# Follow logs in real-time (like tail -f)
docker logs -f my-web-server

# Show only last 50 lines
docker logs --tail 50 my-web-server
```

**Real-world use:**
```bash
docker run -d --name test-nginx nginx
docker logs test-nginx
```

You'll see nginx startup messages, access logs, and any errors.

---

### Common Docker Run Flags

Here's a quick reference of the most useful flags:

| Flag | What it Does | Example |
|------|-------------|---------|
| `-d` | Run in background (detached) | `docker run -d nginx` |
| `-p` | Map ports (host:container) | `docker run -p 8080:80 nginx` |
| `--name` | Give container a name | `docker run --name web nginx` |
| `-e` | Set environment variable | `docker run -e API_KEY=secret nginx` |
| `-v` | Mount volume (share files) | `docker run -v ./data:/app/data nginx` |
| `-it` | Interactive terminal | `docker run -it ubuntu bash` |
| `--rm` | Auto-remove when stopped | `docker run --rm nginx` |
| `--network` | Connect to network | `docker run --network my-net nginx` |

**Combine multiple flags:**
```bash
docker run -d -p 8080:80 --name my-app -e NODE_ENV=production my-image
```

---

## 3. Docker Images

### What is a Docker Image?

An image is like a **blueprint** or **recipe** for creating containers. It contains:
- Your application code
- Dependencies and libraries
- System tools
- Configuration files

**Analogy:** If a container is a cake, then an image is the recipe for that cake.

---

### Creating Your Own Image with Dockerfile

A **Dockerfile** is a text file with instructions to build an image.

#### Simple Dockerfile Example

Let's create a simple web application:

**Dockerfile:**
```dockerfile
# Use an existing image as the base
FROM nginx:latest

# Copy your files into the container
COPY index.html /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Command to run when container starts
CMD ["nginx", "-g", "daemon off;"]
```

#### What Each Line Does:

1. **FROM nginx:latest**
   - Start with the official nginx image
   - `latest` means the newest version

2. **COPY index.html /usr/share/nginx/html/**
   - Copy your `index.html` file from your computer into the container
   - `/usr/share/nginx/html/` is where nginx looks for web files

3. **EXPOSE 80**
   - Tell Docker this container will listen on port 80
   - This is documentation, not actual port mapping

4. **CMD ["nginx", "-g", "daemon off;"]**
   - The command to run when the container starts
   - This starts the nginx web server

---

### Building an Image

Create a simple `index.html` file first:

**index.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Docker App</title>
</head>
<body>
    <h1>Hello from Docker!</h1>
    <p>This is my first Docker application.</p>
</body>
</html>
```

**Build command:**
```bash
docker build -t my-nginx-app .
```

**Explanation:**
- `build` creates an image from Dockerfile
- `-t my-nginx-app` gives your image a name (tag)
- `.` means look for Dockerfile in current directory

**Run your custom image:**
```bash
docker run -d -p 8080:80 my-nginx-app
```

Now visit `http://localhost:8080` to see your custom page!

---

## 4. Intermediate Concepts

### 4.1 Docker Networking (Basic)

#### What is Docker Networking?

Networking allows containers to talk to each other and to the outside world.

**Simple explanation:** Just like computers on a network can communicate, Docker containers can too.

#### Basic Example

By default, containers can communicate with each other if they're on the same network.

**Create a network:**
```bash
docker network create my-network
```

**Run containers on the same network:**
```bash
docker run -d --name database --network my-network postgres
docker run -d --name webapp --network my-network nginx
```

Now the `webapp` container can connect to the `database` container using the name `database` as the hostname.

**That's it!** For beginners, just know that Docker networks help containers communicate.

---

### 4.2 Docker Volumes (Data Persistence)

#### What are Docker Volumes?

When a container stops, all data inside it is **lost**. Volumes let you save data permanently.

**Real-world problem:** You run a database container, add data, then stop it. When you start again, all data is gone!

**Solution:** Use volumes to save data outside the container.

#### Types of Volumes

**1. Named Volumes (Recommended)**

Docker manages the storage for you.

```bash
# Create and use a volume
docker run -d --name my-database -v my-data:/var/lib/postgresql/data postgres
```

**Explanation:**
- `-v my-data:/var/lib/postgresql/data`
- `my-data` = volume name (Docker manages where it's stored)
- `/var/lib/postgresql/data` = path inside container where data is saved

**List volumes:**
```bash
docker volume ls
```

**2. Bind Mounts (Simple File Sharing)**

Share a folder from your computer with the container.

```bash
# Share your local folder with container
docker run -d -p 8080:80 -v ./my-website:/usr/share/nginx/html nginx
```

**Explanation:**
- `./my-website` = folder on your computer
- `:/usr/share/nginx/html` = folder inside container
- Any changes you make to files are instantly visible!

#### Practical Example: Database with Persistent Data

```bash
# Run MySQL with data saved in volume
docker run -d \
  --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=secret123 \
  -v mysql-data:/var/lib/mysql \
  -p 3306:3306 \
  mysql

# Your data is safe even after stopping container
docker stop my-mysql
docker start my-mysql  # Data is still there!
```

#### Example: Edit Files Without Rebuilding

```bash
# Create a project folder
mkdir my-website
echo "<h1>Hello World</h1>" > my-website/index.html

# Run nginx with your folder
docker run -d -p 8080:80 -v ./my-website:/usr/share/nginx/html nginx

# Edit my-website/index.html on your computer
# Refresh browser - changes appear instantly!
```

**Key Points:**
- Use **named volumes** for databases and important data
- Use **bind mounts** for development (edit files easily)
- Data in volumes survives container removal

---

### 4.3 Environment Variables

#### What are Environment Variables?

Variables that configure your container without changing the code.

**Common uses:**
- Database passwords
- API keys
- Configuration settings (production vs development)

#### Using Environment Variables

**Simple example:**
```bash
docker run -d -e MY_VAR=hello nginx
```

**Multiple variables:**
```bash
docker run -d \
  -e MYSQL_ROOT_PASSWORD=secret123 \
  -e MYSQL_DATABASE=myapp \
  -e MYSQL_USER=john \
  -e MYSQL_PASSWORD=pass456 \
  mysql
```

#### Real Example: MySQL Database

```bash
docker run -d \
  --name my-database \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=shop_db \
  -e MYSQL_USER=shopuser \
  -e MYSQL_PASSWORD=shoppass \
  -p 3306:3306 \
  mysql
```

**What happens:**
- MySQL creates a database called `shop_db`
- Creates user `shopuser` with password `shoppass`
- Sets root password to `rootpass`

#### Using Environment Files

For many variables, use a file:

**Create `.env` file:**
```env
MYSQL_ROOT_PASSWORD=rootpass
MYSQL_DATABASE=shop_db
MYSQL_USER=shopuser
MYSQL_PASSWORD=shoppass
```

**Use it:**
```bash
docker run -d --name my-database --env-file .env mysql
```

#### In Dockerfile

```dockerfile
FROM node:18

# Set default environment variable
ENV NODE_ENV=production
ENV PORT=3000

COPY . /app
WORKDIR /app

CMD ["node", "server.js"]
```

**Override when running:**
```bash
docker run -d -e NODE_ENV=development -e PORT=8080 my-node-app
```

**Key Points:**
- Never hardcode passwords in Dockerfiles
- Use `-e` for single variables
- Use `--env-file` for multiple variables
- Keep `.env` files out of version control (add to `.gitignore`)

---

### 4.4 Docker Compose (IMPORTANT)

#### What is Docker Compose?

Docker Compose is a tool for running **multiple containers** together. Instead of running many `docker run` commands, you write one configuration file.

**Why use it:**
- Manage multiple containers easily
- One command to start everything
- Easy to share your full application setup

#### Simple docker-compose.yml Example

Let's create a web app with nginx and a database:

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  # Web server
  web:
    image: nginx:1.25.3
    container_name: my-nginx
    ports:
      - "8080:80"
    volumes:
      - ./index.html:/usr/share/nginx/html/index.html
    networks:
      - app-network

  # Database
  database:
    image: mysql:8.0
    container_name: my-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpass123
      MYSQL_DATABASE: myapp_db
      MYSQL_USER: appuser
      MYSQL_PASSWORD: apppass123
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - app-network

# Define volumes
volumes:
  mysql-data:

# Define networks
networks:
  app-network:
```

#### What Each Part Does:

- **version: '3.8'** - Docker Compose file format version
- **services:** - List of containers to run
- **web:** - Name of our service
- **image: nginx:1.25.3** - Use specific nginx version
- **container_name:** - Custom name for the container
- **ports:** - Map port 8080 on your computer to port 80 in container
- **volumes:** - Share files between your computer and container
- **environment:** - Set environment variables for the database
- **networks:** - Connect services to the same network (so web can talk to database)
- **volumes: mysql-data:** - Define named volume for database persistence

---

#### Docker Compose Commands

**Start all services:**
```bash
docker-compose up
```

**Start in background:**
```bash
docker-compose up -d
```

**Stop and remove all services:**
```bash
docker-compose down
```

**View running services:**
```bash
docker-compose ps
```

---

## Quick Reference

### Common Workflow

1. **Pull an image:** `docker pull nginx:1.25.3`
2. **Run a container:** `docker run -d -p 8080:80 --name web nginx`
3. **Check if running:** `docker ps`
4. **View logs:** `docker logs web`
5. **Stop container:** `docker stop web`
6. **Start container:** `docker start web`
7. **Remove container:** `docker rm web`

### Run with All Options

```bash
docker run -d \
  --name my-app \
  -p 8080:80 \
  -e API_KEY=secret \
  -v ./data:/app/data \
  --network my-network \
  nginx:1.25.3
```

### Build Your Own Image

1. Create `Dockerfile`
2. Write your instructions
3. Build: `docker build -t my-app:1.0 .`
4. Run: `docker run -d -p 8080:80 --name app my-app:1.0`

### Use Docker Compose

1. Create `docker-compose.yml`
2. Define your services (with ports, volumes, environment)
3. Run: `docker-compose up -d`
4. View logs: `docker-compose logs -f`
5. Stop: `docker-compose down`

### Docker Volumes

```bash
# Create volume
docker volume create my-data

# Use volume
docker run -v my-data:/app/data nginx

# List volumes
docker volume ls

# Remove volume
docker volume rm my-data
```

### Useful Commands

| Command | Purpose |
|---------|---------|
| `docker ps` | List running containers |
| `docker ps -a` | List all containers |
| `docker images` | List images |
| `docker logs <container>` | View container logs |
| `docker exec -it <container> bash` | Enter container |
| `docker stop $(docker ps -q)` | Stop all containers |
| `docker system prune -a` | Clean up everything |

---

## Practice Exercise

### Exercise 1: Basic Container

Try this step-by-step:

1. Create a folder called `my-docker-app`
2. Create an `index.html` file with some HTML
3. Create a `Dockerfile` using the nginx example above
4. Build your image: `docker build -t my-first-app:1.0 .`
5. Run it: `docker run -d -p 8080:80 --name first-app my-first-app:1.0`
6. Open `http://localhost:8080` in your browser
7. Check logs: `docker logs first-app`
8. Success! You've built and run your own Docker container!

### Exercise 2: Using Volumes

Try editing files without rebuilding:

1. Create a folder: `mkdir my-site`
2. Create `my-site/index.html`:
   ```html
   <h1>Version 1</h1>
   ```
3. Run nginx with volume:
   ```bash
   docker run -d -p 8080:80 -v ./my-site:/usr/share/nginx/html --name site nginx
   ```
4. Visit `http://localhost:8080`
5. Edit `my-site/index.html` to say "Version 2"
6. Refresh browser - see instant changes!

### Exercise 3: Docker Compose

Create a full application:

1. Create `docker-compose.yml` with the example above
2. Create `index.html` in the same folder
3. Run: `docker-compose up -d`
4. Check: `docker-compose ps`
5. View logs: `docker-compose logs web`
6. Stop: `docker-compose down`

---

## Tips for Beginners

- **Start simple:** Don't try to learn everything at once
- **Use official images:** They're well-tested and documented
- **Read error messages:** Docker's errors are usually helpful
- **Clean up:** Remove old containers and images to save space
- **Use Docker Hub:** Find thousands of pre-built images at hub.docker.com

---

## Troubleshooting

**Container won't start?**
- Check logs: `docker logs <container-name>`
- Check if image exists: `docker images`
- Try running without `-d` to see errors in real-time

**Port already in use?**
- Use a different port: `-p 8081:80` instead of `-p 8080:80`
- Find what's using port: `netstat -ano | grep 8080` (Linux/Mac) or `netstat -ano | findstr 8080` (Windows)
- Stop other container using that port

**Can't connect to container?**
- Make sure it's running: `docker ps`
- Check port mapping is correct
- Try `localhost` or `127.0.0.1` in browser
- Check container logs for errors

**Permission denied errors?**
- On Linux: May need `sudo` or add user to docker group
- On Windows: Make sure Docker Desktop is running
- Check file permissions for volumes

**"No space left on device"?**
- Clean up: `docker system prune -a`
- Remove unused volumes: `docker volume prune`
- Remove unused images: `docker image prune -a`

**Container keeps restarting?**
- Check logs: `docker logs <container-name>`
- Application inside might be crashing
- Check environment variables are correct

**Can't find command inside container?**
```bash
# Some containers use sh instead of bash
docker exec -it <container> sh

# Or check what shell is available
docker exec -it <container> ls /bin
```

**Docker Compose not working?**
- Check YAML syntax (indentation matters!)
- Make sure file is named `docker-compose.yml`
- Try: `docker-compose up` without `-d` to see errors
- Check if ports are available

**Volume data not persisting?**
- Use named volumes, not anonymous ones
- Check volume is properly defined in docker-compose.yml
- List volumes: `docker volume ls`
- Inspect volume: `docker volume inspect <volume-name>`
