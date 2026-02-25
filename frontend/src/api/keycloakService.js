import axios from "axios";

const KEYCLOAK_URL = process.env.REACT_APP_KEYCLOAK_URL;
const REALM = process.env.REACT_APP_REALM;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const USERNAME = process.env.REACT_APP_USERNAME;
const PASSWORD = process.env.REACT_APP_PASSWORD;

export const getToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("client_id", CLIENT_ID);
    if (CLIENT_SECRET) params.append("client_secret", CLIENT_SECRET);
    params.append("username", USERNAME);
    params.append("password", PASSWORD);

    const response = await axios.post(
      `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur Keycloak:", error.response?.data || error.message);
    throw error;
  }
};
