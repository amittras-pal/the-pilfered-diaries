import admin from "firebase-admin";

const getServiceAccount = (): admin.ServiceAccount => {
  return {
    clientEmail: process.env.FB_SERVICE_ACCOUNT_CLIENT_EMAIL,
    projectId: process.env.FB_SERVICE_ACCOUNT_PROJECT_ID,
    privateKey: process.env.FB_SERVICE_ACCOUNT_PRIVATE_KEY
      ? process.env.FB_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined,
  };
};

if (!admin.apps.length) {
  try {
    const accountCreds = getServiceAccount();
    admin.initializeApp({
      credential: admin.credential.cert(accountCreds),
    });
  } catch (error) {
    console.error("Failed to initialize firebase admin", error);
  }
}

export default admin.firestore();
