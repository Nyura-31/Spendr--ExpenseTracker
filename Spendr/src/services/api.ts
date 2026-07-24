import axios from "axios";

interface ExchangeRateResponse {
  result: "success" | string;
  rates: Record<string, number>;
}

const exchangeRateClient = axios.create({
  baseURL: "https://open.er-api.com/v6/latest",
  timeout: 10000,
});

export async function fetchUsdRateFromInr(): Promise<number> {
  const response = await exchangeRateClient.get<ExchangeRateResponse>("/INR");
  const usdRate = response.data.rates.USD;

  if (response.data.result !== "success" || typeof usdRate !== "number") {
    throw new Error("The exchange-rate response did not include a USD rate.");
  }

  return usdRate;
}
