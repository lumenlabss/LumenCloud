# LumenCloud

**LumenCloud** is a lightweight, self-hosted personal cloud solution developed by [LumenLabs](https://lumenlabs.org).  
Designed for simplicity and control, it allows users to securely store, manage, and access files through a clean web interface — all hosted on your own infrastructure.

---

## ✅ Features

- File upload and download
- Folder navigation (multi-user support planned)
- File renaming and deletion
- Clean, responsive web interface
- Easy configuration via `config.json`

---

## 🧱 Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** EJS
- **Database:** SQLite3
- **Storage:** Local filesystem

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/lumenlabss/LumenCloud.git
cd LumenCloud
````

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the application

Create a `config.json` file at the root of the project:

```json
{
  "port": 3000,
  "uploadDir": "/data",
  "jwtSecret": "your-secret-key",
}
```


### 4. Start the server

```bash
node lumencloud.js
```

> 💡 Default password and username is: admin, 123

---

## 🤝 Contributing

Contributions are welcome!

1. Fork this repository
2. Create a new branch: `feature/your-feature`
3. Submit a clear and well-documented pull request

---

## 📄 License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute it under the terms of this license.

---

## 📫 Contact

For questions, suggestions, or serious contributions, contact the team via:

* Official website: https://lumenlabs.pro
* Community Discord: https://discord.gg/ty92ffCYUC

---

**LumenCloud** — A fast, simple, transparent personal cloud.
