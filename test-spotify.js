// Test Spotify API credentials
const clientId = "e7b084553d51471fbc32cb2e8a90936d";
const clientSecret = "5db1a269182b45c5ba59406192bfa704";
const refreshToken = "AQDJ1d_74Td9rg8aiCadUkl6EJm1E9ewEk58ALOzBHRSrbZsOrnDnfr3lCxYkWg33XDjo2Y2HNGbR2p6O0XFseCDrW5KER6A1sOv4rCZYEHZ4NisDsnCYshwcVEmO2ITQDs";

async function testSpotifyAuth() {
  console.log("Testing Spotify credentials...");
  console.log("Client ID:", clientId);
  console.log("Client Secret:", clientSecret.substring(0, 10) + "...");
  console.log("Refresh Token:", refreshToken.substring(0, 20) + "...");

  try {
    const authHeader = "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    console.log("\nAuth Header:", authHeader.substring(0, 30) + "...");

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    console.log("\nMaking request to Spotify...");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": authHeader,
      },
      body: body,
    });

    console.log("\nResponse Status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("\n❌ Error Response:", errorText);
      try {
        const errorJson = JSON.parse(errorText);
        console.error("Error Details:", JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.error("Raw Error:", errorText);
      }
      return;
    }

    const data = await response.json();
    console.log("\n✅ Success! Got access token");
    console.log("Access Token:", data.access_token.substring(0, 20) + "...");
    console.log("Token Type:", data.token_type);
    console.log("Expires In:", data.expires_in, "seconds");

    // Test the access token by fetching user profile
    console.log("\n\nTesting access token by fetching user profile...");
    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        "Authorization": `Bearer ${data.access_token}`,
      },
    });

    console.log("Profile Response Status:", profileResponse.status);

    if (profileResponse.ok) {
      const profile = await profileResponse.json();
      console.log("\n✅ User Profile:");
      console.log("Display Name:", profile.display_name);
      console.log("Email:", profile.email);
      console.log("User ID:", profile.id);
      console.log("Country:", profile.country);
      console.log("Product:", profile.product);
    } else {
      const profileError = await profileResponse.text();
      console.error("\n❌ Profile Error:", profileError);
    }

  } catch (error) {
    console.error("\n❌ Exception:", error.message);
    console.error("Stack:", error.stack);
  }
}

testSpotifyAuth();
