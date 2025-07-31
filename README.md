# Policy Insurance -  Frontend

This is the frontend for the Policy Insurance application, built with ReactJs, axios, MUI library. It provides a List of Policies Data and which user can create a new policy, Also we have a list of illustration data components.
This README provides detailed, step-by-step instructions to set up and run the application locally on an Ubuntu system.

## Prerequisites

Before setting up the project, ensure you have the following installed:

* **Node.js** : Version 18.x or higher (LTS recommended)
* **npm** : Comes bundled with Node.js
* **Git** : For cloning the repository
* **Text Editor** : (e.g., VS Code, for editing configuration files)

## Setup Instructions

Follow these steps to set up and run the AI Avatar frontend application on your Ubuntu machine.

### 1. Clone the Repository

Clone the project repository from GitHub to your local machine.

```bash
git clone https://github.com/Amit-4582/policy-frontend.git
```

Go to the directory
```bash
cd policy-frontend
```

### 3. Install Project Dependencies

Install the required Node.js dependencies listed in `package.json`.

```bash
npm install
```

This will install common React dependencies such as `react`, `react-dom`, `axios`, and others. If you encounter issues, ensure `package-lock.json` is present, or delete it and rerun `npm install`.

### 4. Create and Configure Environment File

The frontend uses a `.env` file to manage environment-specific configuration, such as API URLs.

#### 4.1 Create `.env` File

Create a `.env` file in the project root:

```bash
touch .env
```

#### 4.2 Add Environment Variables

Open the `.env` file in a text editor (e.g., `nano`):

```bash
nano .env
```

Add the following configuration:

```
# API
REACT_APP_NODE_API_URL=http://localhost:8080/api/v1
```

Save and close the file (e.g., in `nano`, press `Ctrl+O`, `Enter`, then `Ctrl+X`).

#### 4.3 Secure the `.env` File

Restrict access to the `.env` file:

```bash
chmod 600 .env
```

#### 4.4 Notes on Environment Variables

* The `REACT_APP_` prefix is required for React environment variables to be accessible in the application via `process.env.REACT_APP_*`.
* Ensure the API URLs (`REACT_APP_NODE_API_URL`) are correct and accessible. These URLs appear to use ngrok, which may be temporary. Check the backend documentation or repository for the latest API URLs.
* If additional environment variables are required (e.g., for authentication or other services), consult the repository's documentation.

### 5. Start the Application

Run the application using the scripts defined in `package.json`. Assuming a standard React setup, the following commands are typically available.

* **Development Environment** :

```bash
  npm start
```

  This starts the development server, typically on `http://localhost:3000`. Open a browser and navigate to this URL to view the application.

### 6. Test the Application

1. **Access the Frontend** :
   After running `npm start`, open `http://localhost:3000` in a browser. Check the browser's developer console (F12) for any errors related to API calls or rendering.
2. **Check Repository Documentation** :
   Refer to the repository's documentation or `src/` folder for specific routes, components, or features to test.

