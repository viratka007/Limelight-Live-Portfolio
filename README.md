# Limelight Live

A real-time audience voting website created for Limelight, the drama club at IIIT Dharwad. The interface supports live polls during performances, timed voting, mood-based visual themes, poll results, and a backstage area for authorised organisers.

## Features

- Audience voting without requiring audience accounts
- Timed polls and live results powered by Firebase Realtime Database
- Four visual moods: Romantic, Funny, Sadness, and Horror
- Backstage sign-in through Firebase Authentication
- Role-based organiser controls stored in Realtime Database
- Past-question archive
- Browser-side image preparation for scene/poll images
- Netlify Function endpoints referenced by the master panel for creating and deleting backstage accounts

## Technology

- HTML, CSS, and vanilla JavaScript
- Firebase Authentication (compat SDK)
- Firebase Realtime Database (compat SDK)
- Netlify hosting and Netlify Functions for privileged account-management operations

## Important deployment note

This repository package currently contains the frontend only. The frontend calls these Netlify Function endpoints:

- `/.netlify/functions/create-user`
- `/.netlify/functions/delete-user`

The corresponding trusted server-side function source files, their dependencies, and the deployment configuration must be added and reviewed before deploying a complete working copy. Do not expose privileged service-account credentials in frontend code or commit them to GitHub.

## Local preview

Because Firebase is initialized by the page, opening `index.html` directly may not provide a complete working experience. You can inspect the layout locally, but test Firebase-backed features only in a separate test Firebase project with reviewed database rules and authorised test accounts.

## Before deploying your own copy

1. Create a **new Firebase project** for the public/demo copy; do not point it at Limelight's production data.
2. Configure Firebase Authentication and Realtime Database, and review the database rules so public visitors cannot write arbitrary data or read organiser-only data.
3. Add and review the Netlify Functions required by the master panel. Store privileged credentials only in Netlify environment variables.
4. Configure the frontend with the new Firebase project's web-app config. Firebase web config is not a server secret; security must be enforced by Authentication, database rules, and any required App Check configuration.
5. Test audience voting, timers, image uploads, archives, backstage roles, and account-management flows using test data.
6. Deploy to a separate Netlify site and confirm it does not connect to the existing production site or repository.

## Security

See [SECURITY.md](SECURITY.md) before using this code with real users. Never commit service-account JSON files, private keys, access tokens, passwords, or production secrets.

## Credits

Built for Limelight at IIIT Dharwad.
