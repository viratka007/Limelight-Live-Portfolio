# Security and configuration notes

This is a browser-based application backed by Firebase and Netlify Functions. Treat the frontend as public: visitors can inspect every value and every client-side operation.

## Required safeguards

- Use a separate Firebase project for any public demo or portfolio deployment. Do not reuse production data.
- Review Firebase Realtime Database rules before enabling writes. Do not rely on hidden buttons or client-side role checks as the security boundary.
- Keep privileged credentials and administrative operations on trusted server-side code only.
- Configure Netlify Function secrets through Netlify environment variables. Never put service-account keys, private keys, passwords, or bearer tokens in this repository or in frontend JavaScript.
- Restrict account-management functions to authenticated, authorised administrators, and validate all input on the server.
- Test that unauthenticated visitors cannot access backstage profiles or modify roles, settings, polls, or archives beyond the intended public voting flow.
- Consider Firebase App Check and abuse/rate controls where appropriate.

## Backend function status

The package includes `netlify/functions/create-user.mjs` and `netlify/functions/delete-user.mjs`, plus shared authorization/configuration helpers. They require a separate demo Firebase project and server-side environment variables. They have been statically reviewed and syntax-checked, but have not been integration-tested against Netlify or Firebase. Follow `NETLIFY-SETUP.md` before deploying. Do not attach this repository to the existing production site.

## Firebase web config

Firebase web-app configuration values are normally visible to browser users and are not equivalent to service-account credentials. Their exposure is expected, but a public API key does not protect your data by itself. Proper Authentication, database rules, API restrictions where applicable, and server-side authorisation are essential.
