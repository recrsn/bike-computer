# Bike Computer

This is a simple bike computer that uses device GPS and connected BLE sensors
to track your speed and distance. Supports connecting to any BLE heart rate, cadence
and speed sensors.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

Since we use Web Bluetooth and Geolocation which requires a secure context, to run the app
on your phone, you need to start the development server on HTTPS
using `HTTPS=true npm start`. This uses a self-signed certificate, so you will need to
accept the certificate warning on your phone.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section
about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.