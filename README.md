# LEWOCO – Lower Eastern Women Cooperative Union

**An Organizational Information Management System**

LEWOCO is a web-based organizational information management system designed to strengthen the digital presence and administrative operations of the Lower Eastern Women Cooperative Union.

The platform provides a public website where visitors can learn about the organization, explore its programmes and projects, access resources, and make enquiries. It is being developed alongside an administrative system to support the management of organizational information and activities.

## Project Objectives

- Establish a professional online presence for LEWOCO.
- Improve access to organizational information.
- Support the management of programmes, projects and announcements.
- Improve communication between LEWOCO and its stakeholders.
- Centralize organizational records and administrative information.
- Provide a foundation for future reporting and information management.

## Key Features

### Public Website

- Organizational homepage and introduction.
- About LEWOCO section.
- Programmes and projects presentation.
- News and announcements section.
- Resources and informational materials section.
- Contact information and enquiry form.
- Responsive design for desktop, tablet and mobile devices.

### Administrative System

The administrative system is planned to support:

- Secure administrator authentication.
- Management of organizational information.
- Programme and project management.
- News and announcement management.
- Resource management.
- Enquiry management.
- Member and organizational records.
- Administrative reports.

*Administrative features are under development and should not be considered fully operational.*

## Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| JavaScript | Frontend application logic |
| CSS | Styling and responsive layouts |
| Laravel | Backend application and REST API |
| PHP | Backend programming language |
| PostgreSQL | Relational database |
| Vite | Frontend development and build tooling |
| Git and GitHub | Version control and source code management |

## Project Structure

```text
LEWOCO/
│
├── backend/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── tests/
│   ├── .env.example
│   ├── artisan
│   ├── composer.json
│   └── composer.lock
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- PHP
- Composer
- PostgreSQL

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/LEWOCO.git
cd LEWOCO
```

Replace `YOUR-GITHUB-USERNAME` with your GitHub username.

### 2. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL displayed in your terminal, usually:

`http://localhost:5173`

### 3. Set Up the Laravel Backend

Open a separate terminal:

```bash
cd LEWOCO/backend
composer install
```

Create the environment configuration:

```bash
cp .env.example .env
```

Configure the database credentials in the backend `.env` file using your own local PostgreSQL setup.

Generate the Laravel application key:

```bash
php artisan key:generate
```

Run database migrations after configuring the database:

```bash
php artisan migrate
```

Start the Laravel development server:

```bash
php artisan serve
```

The backend will normally be available at:

`http://127.0.0.1:8000`

## Development Status

| Component | Status |
|---|---|
| Public website layout | Completed |
| Responsive frontend design | Completed |
| Navigation and website sections | Completed |
| Contact enquiry form interface | Completed; backend integration pending |
| Laravel backend foundation | Set up |
| PostgreSQL database foundation | Set up |
| REST API integration | Pending |
| Administrative dashboard | Planned |
| Database-backed content management | Planned |
| Authentication and authorization | Planned |

## Future Improvements

- Integrate the React frontend with the Laravel REST API.
- Implement secure administrative authentication and role management.
- Connect the enquiry form to PostgreSQL.
- Implement dynamic programme, project and announcement management.
- Add downloadable organizational resources.
- Implement member and organizational records management.
- Introduce administrative reporting and analytics.
- Add automated testing and deployment workflows.

## Project Purpose

LEWOCO aims to use technology to improve organizational communication, information accessibility and administrative efficiency while supporting the organization's broader community development objectives.

---

**Project:** LEWOCO – Lower Eastern Women Cooperative Union  
**Development:** Ongoing  
**Repository:** GitHub