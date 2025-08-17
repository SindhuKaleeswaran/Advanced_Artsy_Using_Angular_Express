# Advanced_Artsy_Using_Angular_Express

https://sindhu-artsy-assgnmini-3.uw.r.appspot.com/

Discover, explore, and favorite artists from Artsy with a fast Angular SPA and a secure Express/Node backend. Search artists, open rich profiles, browse artworks and their categories (“genes”), see similar artists when logged in, and manage a favorites list backed by MongoDB—all with responsive UI and smooth UX. Secrets stay server-side in .env; the server handles XAPP token retrieval & caching. 

##Features

Artist search with card grid, empty states, and loading indicators

Artist details with tabs: Info and Artworks

Artwork categories (“genes”) via per-artwork modal

Similar artists (requires authentication)

Favorites: add/remove anywhere, dedicated page, newest-first ordering, “time ago” timestamps

Authentication: register, login, logout, delete account; JWT in HttpOnly cookies; Gravatar avatars

Server-side Artsy integration: XAPP token retrieval and caching; X-Xapp-Token header; no client-side secrets

MongoDB persistence for users and favorites; cascade cleanup on account deletion

Responsive UI built with Bootstrap; accessible components; mobile-friendly layouts

Global notifications for actions; consistent error handling and empty-state messaging

Angular SPA proxied to Express for local development (4200 → 8080)

Production-ready deployment: serve Angular build from Express or deploy client/server separately with CORS

Configuration via environment variables (.env on server) and a checked-in .env.example for teammates

.gitignore excludes secrets and build artifacts to keep the repo clean
