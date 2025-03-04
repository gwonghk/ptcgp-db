/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest, pubsub } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
// import { initializeApp } from "firebase/app";
import * as admin from "firebase-admin";

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello log frogs!!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const helloEveryFiveMinutes = pubsub
  .schedule("every 5 minutes")
  .onRun(() => {
    console.log("Hello from Firebase!");
  });
