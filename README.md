# chat-app

### Overview

This project is a chat application designed to explore and understand the architecture of a three-layered application. The application comprises a frontend built with React, a backend powered by Go, and utilizes a Postgres SQL database.


### Features

* **Servers, Channels, and Chat Pages:** The application is structured around servers, which can host multiple channels. Each channel has its dedicated chat page where users can exchange messages.
* **Voice Channels:** Users can communicate directly with each other using WebRTC technology.
* **Text Channels:** Users can send messages through text channels, and these messages are relayed to all users within that specific server, fostering group communication.


### Three-Layer Architecture

#### The application follows a three-layer architecture, dividing the system into the following components:
* **Frontend (React):** The user interface is developed using React, providing an interactive and responsive user experience.
* **Backend (Go):** The backend, written in Go, manages the application's logic, handles requests from the frontend, and interacts with the database.
* **Database (SQL):** A SQL database stores and retrieves data, including information about servers, channels, messages, and user interactions.


### Project Goals

#### The primary objectives of this project are:
* **Learning Project Architecture:** The project serves as a learning experience for understanding the architecture of a modern web application, including the interactions between frontend, backend, and databases.
* **Backend-Frontend Interaction:** It aims to explore the communication and interaction patterns between the frontend and backend components.
* **Database Integration:** The project delves into integrating a SQL database to store and retrieve data, enhancing data persistence and management.
