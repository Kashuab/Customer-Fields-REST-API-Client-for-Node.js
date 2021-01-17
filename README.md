# Customer Fields Rest API Client for Node.js

This package is currently experimental, expect multiple breaking changes to occur until the first stable release (version `1.0.0`)

The purpose of this library is to abstract the burden of manually dispatching web requests to the Customer Fields REST API. We want to make the API easier and more accessible for developers, so they can focus on the more important things in software development.

Features:

- Intuitive API with `async` functions
- Automatic request retries when a `429 (Too many requests)` status code is returned
- Written in TypeScript for your auto-completion pleasure
