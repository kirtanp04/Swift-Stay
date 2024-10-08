# **Swift Stay**

Swift Stay is a modern platform designed for booking and managing various types of properties such as hotels, resorts, apartments, and bungalows. Property owners can host their properties, manage bookings, and provide excellent customer service through the platform's integrated chat system. This project includes an admin panel for property management, real-time chat, and property listing features.

<!-- ![Swift Stay Preview](./public/swiftstay-preview.png) -->

## **Features**

- 🏨 **Property Listings**: Easily browse and book a wide variety of properties like hotels, resorts, apartments, and bungalows.
- 🔧 **Admin Management**: Property owners can list, manage, and maintain their properties, making them live for users to book.
- 💬 **Real-Time Chat System**: Users can chat with property teams for support and inquiries directly from the platform.
- 📊 **Analytics**: Admins can view insights and reports about bookings and customer interactions.
- 💼 **Booking Management**: Admins can handle all bookings and schedules through a streamlined interface.
- 🔐 **Secure Payments**: Integration with Stripe for smooth and secure payments.

---

# **About Swift Stay**

Welcome to **Swift Stay**, your go-to platform for booking the perfect stay, whether you're looking for a luxurious hotel, a cozy resort, an elegant apartment, or a private bungalow retreat. At Swift Stay, we aim to simplify your travel experience by offering a wide range of properties tailored to your preferences, all under one roof.

### What We Offer:

- **Hotels**: Experience world-class hospitality with premium amenities and services.
- **Resorts**: Indulge in a relaxing getaway at some of the most serene and scenic destinations.
- **Apartments**: Stay in modern, well-equipped apartments for short or long-term stays.
- **Bungalows**: Enjoy a private and spacious stay with personalized services in beautiful locations.

### Property Management for Hosts:

For property owners and managers, Swift Stay provides a comprehensive platform to manage listings effortlessly. With our **Admin Dashboard**, property owners can:

- **Host and Manage Properties**: List your properties, set availability, update pricing, and make them live for users to book.
- **Monitor Bookings**: Keep track of all bookings and manage your calendar to ensure smooth operations.
- **Analytics and Reports**: Get insights into bookings, revenue, and customer feedback to improve your business.
- **Chat System**: Directly communicate with guests through our integrated chat system, offering timely responses to customer inquiries and providing a personalized service.

### Seamless Communication:

Our platform features a built-in **chat system** that allows users to connect directly with the property management team. Whether it's a question about amenities or a special request, communication is simple and fast, ensuring a seamless booking experience.

---

# **Tech Stack Overview**

### **Backend (Server-Side)**

- **Framework**: [Express.js](https://expressjs.com/) - Fast and minimalist web framework for Node.js.
- **Database**: [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modeling for Node.js.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript superset.

#### **Features & Integrations**

- **PDF Generation**: [pdfkit](http://pdfkit.org/) - A PDF generation library for Node.js, used for creating dynamic PDFs.
- **Task Scheduling**: [node-cron](https://www.npmjs.com/package/node-cron) - Task scheduler for running jobs at specific intervals (e.g., sending emails).

#### **Payment Integration**

- **Stripe Checkout**: Seamless payment experience with Stripe’s hosted payment page.
- **Stripe Webhooks**: Secure and reliable way to handle payment notifications and events.

#### **Real-Time Communication**

- **Socket.io**: Enabling real-time, bidirectional communication between web clients and servers for chat and notifications.

#### **Authentication & Security**

- **Email Authentication**: Implemented via [Nodemailer](https://nodemailer.com/), enabling email verification and password reset flows.
- **Security**:
  - **CORS**: Cross-Origin Resource Sharing to control access.
  - **crypto-ts**: Strong encryption and decryption of sensitive data.
  - **dotenv**: For environment variable management.
  - **helmet**: Secure HTTP headers.
  - **jsonwebtoken**: JWT-based authentication for user sessions.
  - **express-rate-limit**: Protects against abuse by limiting API calls per time frame.

#### **Scaling & Optimization**

- **Cluster Mode**: Utilize all CPU cores for better performance under heavy traffic.
- **Redis Pub/Sub**: Efficient handling of real-time chat and notifications through Redis' publish/subscribe mechanism.
- **Async Queues**: Manage background tasks like sending emails or processing notifications concurrently.
- **Compression**: Use gzip/deflate compression to reduce response sizes.
- **Node Cache**: Caching frequently used data to enhance response time and reduce load.

---

### **Frontend (Client-Side)**

- **Framework**: [ReactJS](https://reactjs.org/) - Building the UI with a component-based approach.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe development on the client side.

#### **Routing & State Management**

- **React Router Dom**: For dynamic routing and page navigation within the application.
- **Axios**: Promise-based HTTP client for making requests to the backend.

#### **Forms & File Uploads**

- **React Hook Form**: For managing form states and validations.
- **React Dropzone**: Simplified drag-and-drop file uploads.

#### **Real-Time Communication**

- **Socket.io**: Bi-directional real-time communication for chat and updates.

#### **Validation**

- **Yup**: Schema-based form validation for easy and powerful data validation.

#### **Security & Optimization**

- **crypto-ts**: For encrypting and decrypting sensitive data on the frontend.
- **Lazy Load**: Loading components and images only when needed to improve performance.
- **Image Compression**: Compressing images to improve load times without compromising quality.
