import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: process.env.FBSA_CLIENT_EMAIL,
        projectId: process.env.FBSA_PROJECT_ID,
        privateKey: process.env.FBSA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } catch (error) {
    console.error("Failed to initialize firebase admin", error);
  }
}

export default admin;
