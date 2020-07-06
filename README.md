# Electron-Chat-App
A desktop messaging app created using Electron and vanilla js, uses socket.io for realtime messaging.

## Getting Started
1. Clone the project and run `npm install` in the base directory.
2. Add a `.env` file in /backend containing your MongoDB cluster connection string in the form: `ATLAS_URI = <connection_string>` 
and run `node server`

## Launching the Electron Desktop App
Run `npm run dev` to launch an Electron window.

## Features
1. Realtime messaging between users on different groups
2. User registration and login
3. Message history 

## Future improvements
1. Multimedia Support
2. P2P messaging 
3. Adding/ removing users on groups

## References
- [Realtime Chat application using socket.io: Brad Traversy](https://youtu.be/kN1Czs0m1SU)
- Electron Documentation
- Socket.io Documentation
