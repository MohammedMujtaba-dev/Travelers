# Travelers

A full-stack stay-listing web app (Airbnb-style). Users can browse stays, filter by category, view locations on a map, list their own residence with up to 5 photos, and leave star-rated reviews.

## Features

- Sign up / log in / log out (Passport local strategy, sessions stored in MongoDB)
- Browse all listings and filter by category: Rooms, Cabins, Mountains, Pools, Camping, Castles, Farms, Arctic, Domes, Boats
- Listing page with auto-rotating image carousel, thumbnails, related listings (same category) and an interactive map
- Create / edit listings with up to 5 images (Cloudinary), address geocoded via Mapbox
- Reviews with star ratings; only the author can delete their review
- Only the owner can edit or delete a listing
- Prices in INR with a "Display total after tax" toggle (+18% GST)
- Joi validation and flash messages (success / info / error)
- Custom 404 and error page

## Tech Stack

| Area | Tools |
|------|-------|
| Runtime | Node.js (ES modules) |
| Server  | Express 5 |
| Views   | EJS + ejs-mate layouts, Bootstrap 5, Font Awesome, Starability |
| Database| MongoDB + Mongoose |
| Auth    | passport, passport-local, passport-local-mongoose, express-session, connect-mongo, connect-flash |
| Uploads | multer + multer-storage-cloudinary + Cloudinary |
| Maps    | Mapbox GL JS + @mapbox/mapbox-sdk (geocoding) |
| Validation | Joi |
| Other   | method-override, dotenv |

## Project Structure

```
├── app.js                   
├── cloudConfig.js              Cloudinary + multer storage
├── db/listings.js              MongoDB connection
├── controllers/                listing, review, user controllers
├── models/                     listingModel, reviewsModel, userModel
├── routes/                     listingRoutes, reviewRoutes, userRoutes
├── utils/
│   ├── ExpressError.js
│   ├── wrapAsync.js
│   ├── Middleware.js           loggedIn, isOwner, isReviewOwner, validators
│   └── SchemaValidator.js      Joi schemas
├── views/
│   ├── layouts/boilerplate.ejs
│   ├── includes/               navbar, page (flash), footer
│   ├── listing/                index, singlelisting, newlisting, editlisting
│   ├── user/                   login, signup
│   └── error.ejs
└── public/                     css/, js/map.js, js/script.js
```

## Getting Started

### Prerequisites

- Node.js 
- MongoDB (local or Atlas)
- Cloudinary account
- Mapbox access token

### Install

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

### Environment variables

Create `.env` in the project root:

```env
MONGODB_URL=<mongodb connection string>
SECRET=<long random string, used for sessions>
MAP_TOKEN=<mapbox access token>
CLOUD_NAME=<cloudinary cloud name>
CLOUD_API_KEY=<cloudinary api key>
CLOUD_API_SECRET=<cloudinary api secret>
```

Never commit `.env`.

### Run

```bash
node app.js      
```

Open `http://localhost:8080`.

## Routes

### Listings (`/listings`)

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/listings` | Public | All listings |
| GET | `/listings/individual/:id` | Public | Single listing, reviews, map |
| GET | `/listings/category/:id` | Public | Listings by category |
| GET | `/listings/new` | Logged in | New listing form |
| POST | `/listings/new` | Logged in | Create listing (max 5 images) |
| GET | `/listings/edit/:id` | Owner | Edit form |
| PUT | `/listings/edit/:id` | Owner | Update listing |
| DELETE | `/listings/:id` | Owner | Delete listing (and its reviews) |

### Reviews (`/listings/:id/reviews`)

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/` | Logged in | Add review |
| DELETE | `/:reviewId` | Review owner | Delete review |

### Auth (`/auth`)

| Method | Route | Description |
|--------|-------|-------------|
| GET, POST | `/auth/signup` | Register |
| GET, POST | `/auth/login` | Login |
| GET | `/auth/logout` | Logout |

## Deployment (Render)

1. Push the repo to GitHub.
2. Create a Web Service on Render, connect the repo.
3. Build command: `npm install`
4. Start command: `node app.js` <confirm>
5. Add all environment variables from above.
6. In MongoDB Atlas, allow Render's IPs (Network Access).

**Dependency note:** `multer-storage-cloudinary@4` needs `cloudinary@^1.x`. Keep Cloudinary on v1 or replace the wrapper before moving to v2.

