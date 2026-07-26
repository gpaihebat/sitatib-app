// Replace with your Google Apps Script Web App URL
export const GAS_URL = "ISI_DENGAN_URL_WEB_APP_GAS_ANDA_DISINI";

export const fetchFromGas = async (action: string, payload: any = {}) => {
  if (GAS_URL === "ISI_DENGAN_URL_WEB_APP_GAS_ANDA_DISINI") {
    console.warn("GAS_URL is not set. Please update it in src/api.ts");
    // Throw an error so the frontend knows to handle it, or return a mock.
    throw new Error("URL Web App GAS belum diatur di src/api.ts. Silakan deploy GAS dan paste URL-nya.");
  }

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({ action, payload }),
    });
    
    // Some GAS endpoints return redirects for POST, but fetch handles them if configured correctly.
    // However, google apps script Web Apps need `text/plain` returned to avoid CORS issues sometimes.
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling GAS API:", error);
    throw error;
  }
};
