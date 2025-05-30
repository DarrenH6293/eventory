# Eventory

**Eventory** is an event tracker platform that allows users to create threads, post updates, and be updated on the latest news. It supports Google OAuth for authentication and is deployed using Vercel and AWS Lambda.

## Live Site

[https://www.eventory.site](https://www.eventory.site)

## Tech Stack

### Frontend

- **Next.js**
- **React + TypeScript**
- **Tailwind CSS**
- **NextAuth.js** (Google OAuth)

### Backend

- **AWS Lambda** (Node.js)
- **API Gateway**
- **Prisma ORM**
- **Amazon RDS** (PostgreSQL)
- **Serverless Framework**

### Infrastructure

- **Cloudflare** (DNS, HTTPS, rate limiting)
- **Vercel** (Frontend hosting)

---

## Current Features

- Google Login with user creation
- Create threads with categories (Music, Sports, Games, News)
- Post updates to threads (thread owners only)
- Search threads and posts

## Work-In-Progress Features

- Notification System
- Timeline/Calendar Implementation
- Post Tag System
- Mobile UI Improvements
- Analytics Dashboard
