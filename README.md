# Realtime Chat Application

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

## Project Dependencies 

Run the following command:

```
npm install
```
This will install all the dependencies listed in the `package.json` file.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Firebase Configuration

To make the project work, you need to create a project on Firebase and copy the configuration object into the environment files.

## Environment Files

Create an environments folder in the `src` directory. Then create `environment.ts` and `environments.prod.ts` into the environments folder.
There is a .env.example file that contains an example of how both environment file must be.

If you will use AngularFire library configuration will be automatically done by Firebase.

## AngularFire

This project uses AngularFire to interact with Firebase. AngularFire is the official library for Firebase and Angular. You can find more information about AngularFire [here](https://github.com/angular/angularfire).
