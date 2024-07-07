const axios = require("axios");

async function getGuestToken() {
  const headers = {
    Authorization:
      "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
  };

  try {
    const response = await axios.post(
      "https://api.twitter.com/1.1/guest/activate.json",
      null,
      { headers }
    );
    const guestToken = response.data.guest_token;
    console.log("Guest token:", guestToken);
    return guestToken;
  } catch (error) {
    console.error("Error fetching guest token:", error);
  }
}

module.exports = { getGuestToken };