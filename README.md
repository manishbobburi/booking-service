# Booking Service

A dedicated microservice for managing flight bookings, passengers, tickets, and payments.  
This service integrates with a separate Flight Service to handle seat availability and uses a message queue for asynchronous notifications.

## Tech Stack

| Component | Technology | Description |
|------------|-------------|--------------|
| **Backend** | Node.js, Express.js | Core framework for building the API. |
| **Database ORM** | Sequelize | Promise-based ORM for MySQL. |
| **Messaging Queue** | AMQP (via amqplib) | Handles asynchronous message communication between services. |
| **Scheduling** | node-cron | Used for running periodic tasks such as booking cleanup. |
| **HTTP Client** | Axios | Facilitates communication with the external Flight Service. |
| **Configuration** | dotenv | Manages environment variables securely through a `.env` file. |
| **Containerization** | Docker | Dockerfile provided for containerized deployment. |

## Directory Structure

The application follows a modular and layered architecture (**Controller → Service → Repository → Model**):
```bash
└── src/
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── migrations/
    ├── models/
    ├── repositories/
    ├── routes/
    ├── services/
    └── utils/
```
## Installation and Setup

### Prerequisites

- Node.js (v18+)
- MySQL Database
- RabbitMQ (for message queue)
- External **Flight Service** (defined in `src/config/server-config.js`)

---

### Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/manishbobburi/booking-service.git
cd booking-service
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Environment Configuration

```bash
PORT=3000
FLIGHT_SERVICE=http://localhost:3001  # Example URL for external flight service

# Database credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=booking_service_db
```

#### 4.Run Database Migrations

Make sure your database is running and configured in src/config/config.json, then run:

```bash
# For development
npx sequelize db:migrate
```

#### 5. Start the Server

```bash
npm run dev
```
The server will:
- Start on the configured port (e.g., PORT=3000)
- Connect to the message queue
- Initialize the cron job for cancelling old bookings

## Docker Deployment

#### Build the Docker Image`
```bash
docker build -t booking-service .
```
#### Run the Container
```bash
# Example:
docker run -p 3000:3000 --name booking-app booking-service
```
> **Note**: Ensure your environment variables (especially FLIGHT_SERVICE and DB credentials) are correctly configured for Docker network access.

## API Endpoints

The API is versioned under `/api/v1`.

| Entity     | Method | Endpoint | Description | Middleware / Controller |
|-------------|---------|-----------|--------------|--------------------------|
| **Booking** | POST | `/api/v1/bookings` | Create new booking | `BookingController.createBooking` |
|              | POST | `/api/v1/bookings/payments` | Process payment request | `BookingController.makePayment` |
|              | GET | `/api/v1/bookings/mybookings/:userId` | Get user bookings | `BookingController.getBookingsByUserId` |
| **Passenger** | POST | `/api/v1/passenger` | Add new passenger | `PassengerMiddlewares.validatePassengerdata`, `PassengerController.createPassenger` |
| **Ticket** | POST | `/api/v1/ticket` | Generate flight ticket | `TicketMiddlewares.validateTicketdata`, `TicketController.createTicket` |
|              | PATCH | `/api/v1/ticket` | Cancel booked ticket | `TicketController.cancelTicket` |

## Scheduled Tasks
A cron job is configured to automatically cancel old, unpaid bookings and release seats.
Interval: Every 30 minutes
Timeout: Bookings older than 10 minutes are cancelled.

```javascript
// src/utils/common/cron-jobs.js
cron.schedule("*/30 * * * *", async function() {
    await BookingService.cancelOldBookings();
});
```