# Rental Management System

**Team Segfault** - Odoo Hackathon 2025

## 🎥 Demo Video
[![Rental Management System Demo](https://img.youtube.com/vi/0J6QuiyV70Y/0.jpg)](https://youtu.be/0J6QuiyV70Y)

## 📋 Overview

A comprehensive rental management system built for the Odoo Hackathon 2025. RentalPro streamlines the entire rental business lifecycle, connecting rental providers with customers through an intuitive platform. The system facilitates inventory management, booking, customer management, payment processing, and real-time tracking of rental assets.

## ✨ Key Features & Highlights

### For Rental Business Owners
- **Inventory Management** - Track total and available quantities, damage pricing, and rental rates across multiple time periods (hourly, daily, weekly, monthly, yearly)
- **Multi-format Pricing** - Set flexible pricing models for different rental durations
- **Business Dashboard** - View key metrics including available inventory, currently rented items, and business performance
- **Order Management** - Track rental orders, customer details, and payment status
- **Product Listings** - Create detailed product listings with multiple images, specifications, and features

### For Customers
- **User-friendly Product Search** - Browse and filter products by category, pricing, availability, and more
- **Advanced Booking System** - Select rental dates, quantities, and delivery/pickup options
- **Interactive Product Detail Pages** - View high-quality images, specifications, features, pricing options, and availability
- **Streamlined Checkout** - Easy address entry with smart parsing and order confirmation
- **Order History** - Track past and current rentals with detailed information
- **Reviews & Ratings** - Leave feedback for rented products and view others' experiences

### Platform Features
- **Responsive Design** - Works seamlessly across desktop and mobile devices
- **Real-time Availability** - Up-to-date product availability information
- **Location-based Services** - Delivery and pickup location management
- **Secure Authentication** - PASETO-based token authentication with secure password storage
- **Image Management** - Multiple product images with gallery view
- **Analytics Dashboard** - Comprehensive business insights and performance metrics

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **PostgreSQL** - Robust relational database for data persistence
- **MinIO** - S3-compatible object storage for file management
- **Argon2** - Secure password hashing
- **PASETO** - Platform-agnostic security tokens for authentication
- **Pydantic** - Data validation and settings management

### Frontend
- **React** - Modern JavaScript library for building user interfaces
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Shadcn UI** - Component library for consistent design
- **Tailwind CSS** - Utility-first CSS framework


### Prerequisites
- Node.js 16+ and npm
- Python 3.9+
- PostgreSQL
- MinIO (or AWS S3)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.migrations migrate
python -m app.server
```

### Frontend Setup
```bash
npm install
npm run dev
```

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ for the Odoo Hackathon 2025
