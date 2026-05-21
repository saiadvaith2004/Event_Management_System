# Campus Events Management System

A comprehensive, full-stack web application designed to streamline the organization, moderation, and discovery of events within a university campus ecosystem.

## Overview

The Campus Events Management System solves the chaotic nature of university event planning. It provides a centralized, secure platform where:
- **Students** can browse and register for upcoming campus events.
- **Club Heads** can create, organize, and track the status of their event proposals.
- **Administrators** can moderate users, approve/reject events, and manage campus resources.

## Key Features

### Role-Based Access Control & Security
- **Stateless JWT Authentication:** Secure login using JSON Web Tokens and BCrypt password hashing.
- **Three-Tier Roles:** Distinct workflows for Students, Club Heads, and Admins.
- **Registration Moderation:** New Club Head accounts require Admin approval before they can log in.
- **Admin Protection:** Public registration is restricted to Student and Club Head roles only — Admin accounts cannot be created from the frontend.

### Event Management
- **Event Creation:** Club Heads can draft events with titles, descriptions, date/time, max participants, and promotional poster images.
- **Event Moderation:** All submitted events enter a Pending queue. Admins approve or reject them before they go live.
- **Overlap Prevention:** The system automatically blocks double-booking of venues — if a resource is already reserved for a timeframe, no other event can be booked there.
- **Personalized Dashboards:** Students see upcoming events; Club Heads see the status of their submitted requests.

### Campus Resources
- **Resource Directory:** A visual directory of campus facilities (Auditoriums, Labs, etc.) with capacity and real-time availability status.

## Technology Stack

**Frontend:**
- React 18 (Vite)
- Tailwind CSS (Glassmorphism dark-mode UI)
- React Router v6
- Lucide React (Icons)
- Axios (API Client)

**Backend:**
- Java 17
- Spring Boot 4.x
- Spring Security + JWT
- Spring Data JPA / Hibernate

**Database:**
- MySQL 8.0

## Getting Started

### Prerequisites
- Node.js (v18+)
- Java Development Kit (JDK 17+)
- MySQL Server 8.0+

### Backend Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE campus_events;
   ```

2. Update `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Create the uploads directory:
   ```bash
   mkdir uploads/events
   ```

4. Run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   > The database will automatically seed itself with demo accounts and sample data on the first run.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## UI Design

The platform features a modern, responsive **mobile-first** design built with Tailwind CSS. It incorporates:
- Dark mode glassmorphism aesthetics
- Smooth micro-animations and hover effects
- Fully responsive layouts that adapt from mobile phones to desktops
- Real-time form validation with descriptive error messages
