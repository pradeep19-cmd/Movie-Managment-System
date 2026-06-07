 Movie Management System

A backend application developed using **Spring Boot**, **Spring Data JPA**, **Hibernate**, and **MySQL** for managing movie information. The application provides RESTful APIs for performing CRUD operations on movie records while following a layered architecture.

 Features

* Add new movies
* View all movies
* View a movie by ID
* Update movie details
* Delete movies
* MySQL database integration
* RESTful API design
* Layered architecture (Controller, Service, Repository)

## 🛠️ Tech Stack

### Backend

* Java
* Spring Boot
* Spring MVC
* Spring Data JPA
* Hibernate
* Maven

### Database

* MySQL

### Tools

* IntelliJ IDEA
* Postman
* Git & GitHub
 Project Structure

```text
src/main/java/com/moviemanagement

├── controller
├── service
├── repository
├── entity
└── MovieManagementApplication
```

 🏗️ Architecture

```text
Client
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
MySQL Database
```

## 📌 API Endpoints

| Method | Endpoint     | Description     |
| ------ | ------------ | --------------- |
| GET    | /movies      | Get all movies  |
| GET    | /movies/{id} | Get movie by ID |
| POST   | /movies      | Add new movie   |
| PUT    | /movies/{id} | Update movie    |
| DELETE | /movies/{id} | Delete movie    |

## ⚙️ Setup Instructions


### Configure Database

Create a MySQL database and update:

```properties
application.properties
```

with your database credentials.

### Run Application

```bash
mvn spring-boot:run
```

Application will start on:

```text
http://localhost:8080
```

## 📖 Learning Outcomes

Through this project I gained hands-on experience with:

* Spring Boot application development
* REST API design
* Spring Data JPA
* Hibernate ORM
* MySQL integration
* Layered Architecture
* Maven dependency management
* Postman API testing

## 👨‍💻 Author

**Ram Pradeep Raju Konduru**

Computer Science and Engineering (AI & ML)

Aspiring Java Backend Developer
