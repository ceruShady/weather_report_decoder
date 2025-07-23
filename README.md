# weather_report_decoder

## Description

This project creates a single page application for decoding METAR, TAF and SPECI weather reports, and display the decoded information in a readable format.

## Setup to run in local PC

To build and run backend

```
npm run build
npm start
```

To build and run frontend

```
npm run build
npm run preview
```

## Components

This project consists of a frontend and a backend component.

### Backend

Backend runs on Node.js using Express.js framework with TypeScript. This application runs port specified by "PORT" environment variable or 3000 by default.

#### Endpoint

##### /decoder/:reportCode

This end point receives request with "reportCode" param which is a string of encoded weather report in METAR, TAF or SPECI format and respond with a json of an array of string arrays.

### Frontend

Frontend is a single page application created using Vite with React and TypeScript. The application provides a textarea for input of weather report code and an area below that displays the decoded information.

## How it works

Before sending the request, the weather report code will replace all "/" characters to "\_", which will be reveresed by the backend application. The string is then split into an array of strings using whitespace as delimiter and parsed with the following:

- Check for "TEMPO", "BECMG", and "RMK" which signifies the start of a new group which is an array of string. All output will always have a main group where all subsequent results will be placed under in the event there is no new group created
- For each group, parse for important information such as report type, location, report time and report vailidity timeframe
- Parse the remaining code in each group as they are weather information
- Any remaining codes are marked as unknown
- Push all groups into an array. The response will be an array of string arrays
- Frontend will receive and display the decoded information, creating new sections for each group in the array
