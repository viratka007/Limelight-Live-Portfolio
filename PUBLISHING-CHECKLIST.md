# Publishing checklist

- [ ] Review the source and remove any private information or real user data.
- [ ] Confirm no service-account JSON, private key, password, access token, or other privileged secret is included.
- [ ] Decide whether to include the Netlify Function source; the current frontend calls `create-user` and `delete-user` endpoints.
- [ ] Create a new public GitHub repository; do not push the old repository history.
- [ ] Upload only the reviewed files from this package.
- [ ] Use a separate Firebase project for any live demo.
- [ ] Use a separate Netlify site for any demo deployment.
- [ ] Verify database rules and server-side authorisation before testing with real visitors.
- [ ] Test the complete audience and backstage flows with dummy accounts and data.
- [ ] Review the README and attribution before publishing.
