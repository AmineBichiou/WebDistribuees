import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {

        const tokenParams = new URLSearchParams();
        tokenParams.append("grant_type", "password");
        tokenParams.append("client_id", process.env.REACT_APP_CLIENT_ID);
        if (process.env.REACT_APP_CLIENT_SECRET) {
          tokenParams.append("client_secret", process.env.REACT_APP_CLIENT_SECRET);
        }
        tokenParams.append("username", process.env.REACT_APP_USERNAME);
        tokenParams.append("password", process.env.REACT_APP_PASSWORD);

        const tokenResponse = await axios.post(
          `${process.env.REACT_APP_KEYCLOAK_URL}/realms/${process.env.REACT_APP_REALM}/protocol/openid-connect/token`,
          tokenParams,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const token = tokenResponse.data.access_token;

        const hotelsResponse = await axios.get("http://localhost:8090/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHotels(hotelsResponse.data);
        setError("");
      } catch (err) {
        console.error("Erreur Keycloak / Hotels API:", err.response?.data || err.message);
        setError("Impossible de récupérer les hôtels");
      }
    };

    fetchHotels();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Liste des Hôtels</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {hotels.map((hotel) => (
          <li key={hotel.id}>
            {hotel.name} - {hotel.city}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
