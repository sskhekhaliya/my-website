import { createClient } from "@sanity/client";

const isDevelopment = process.env.NODE_ENV === "development";

const config = {
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: "production",
  token: isDevelopment ? process.env.REACT_APP_SANITY_API_TOKEN : undefined,
  useCdn: !isDevelopment,
  apiVersion: "2023-05-03",
};

// ✅ Debugging: confirm if environment variables are loaded
console.log("🔍 Sanity Client Config:", {
  projectId: config.projectId,
  dataset: config.dataset,
  usingToken: !!config.token, // true = token loaded
  useCdn: config.useCdn,
  env: process.env.NODE_ENV,
});

export const client = createClient(config);
