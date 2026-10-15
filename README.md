# Limelight Live — Real-Time Audience Polling

A real-time audience polling platform built for **Limelight, the Drama Club at IIIT Dharwad**, to make live performances more interactive through audience participation.

## Highlights

- **Live audience participation:** Audience members can vote during performances without creating accounts.
- **Timed polls:** Organisers can open polls for a limited duration and view responses in real time.
- **Live results:** Votes and results synchronise through Firebase Realtime Database.
- **Mood-based interface:** Romantic, Funny, Sadness, and Horror themes.
- **Backstage controls:** Firebase Authentication and role-based organiser access.
- **Event-ready experience:** Built to support interactive polling during live college performances.

## Real-World Use

The platform was deployed for a Limelight college event and used to bring audience participation into the live performance. It was designed to let attendees respond to poll questions while organisers managed the polls backstage.

## Tech Stack

- HTML, CSS, JavaScript
- Firebase Authentication
- Firebase Realtime Database
- Netlify and Netlify Functions

## Repository Structure

- `index.html` — frontend application
- `netlify/functions/` — server-side account-management functions
- `netlify.toml` — Netlify configuration
- `package.json` — backend dependency configuration
- `NETLIFY-SETUP.md` — setup notes for a separate demo deployment
- `SECURITY.md` — security considerations

## Security Notes

This repository is a portfolio copy. The backend functions require server-side environment variables and appropriate Firebase permissions. Do not publish service-account credentials or connect this copy to the production backend without reviewing its configuration and security rules.

## Live Website

[Visit Limelight Live](https://limelightiiitdwd.netlify.app/)

## Credits

Built for Limelight by Virat K.A., IIIT Dharwad.
