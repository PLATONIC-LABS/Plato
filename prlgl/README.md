# Prlgl Local Setup Instructions

Welcome to the setup guide for Prlgl. This guide is for individuals without coding experience to get the application running locally. Our application has two main parts: the frontend (what you see in the browser) and the server (which handles the data behind the scenes).

## Prerequisites

Before starting, please install the following:

1. **Node.js and npm**: Download and install Node.js from [Node.js Downloads](https://nodejs.org/en/download/). npm is included in the installation.
2. **Python**: Download and install Python from [Python Downloads](https://www.python.org/downloads/).
3. **Visual Studio Code (VSCode)**: Download and install VSCode from [VSCode Downloads](https://code.visualstudio.com/download).

## Running the Application

### Setting Up the Frontend

1. Open VSCode.
2. In VSCode, go to `File` > `Open Folder`, find the project folder, select the `frontend` folder, and click `Open`.
3. In VSCode, open the integrated terminal by going to `Terminal` > `New Terminal`.
4. Install the frontend dependencies. In the terminal, type:

    ```sh
    npm install
    ```

    and press `Enter`. Wait for the installation to complete.

5. Start the frontend application. In the terminal, type:

    ```sh
    npm start
    ```

    and press `Enter`. The frontend should open in your default web browser after a moment.

### Setting Up the Server

1. Open a new VSCode window so the frontend remains running.
2. In the new window, go to `File` > `Open Folder`, find the project folder, select the `server` folder, and click `Open`.
3. Open the integrated terminal as before.
4. Create a virtual environment for the Python project. In the terminal, type:

    - On Windows:

        ```sh
        py -m venv env
        ```

    - On macOS/Linux:

        ```sh
        python3 -m venv env
        ```

    and press `Enter`.

5. Activate the virtual environment. In the terminal, type:

    - On Windows:

        ```sh
        .\env\Scripts\activate
        ```

    - On macOS/Linux:

        ```sh
        source env/bin/activate
        ```

    and press `Enter`.

6. Install the server dependencies. Ensure that you have Rust and Cargo installed in your system. In the terminal, type:

    ```sh
    pip install -r requirements.txt
    ```

    and press `Enter`. Wait for the installation to complete.

7. Start the server. In a brand new terminal, type:

    ```sh
    python manage.py runserver
    ```

    and press `Enter`. Your server is now running.

## Using the Application

With the server and frontend both running, you can use the application in your web browser at `http://localhost:3000`.

To stop the server or frontend, go to the terminal where they are running and press `Ctrl+C`.

If you need help or have questions, feel free to ask for support.
