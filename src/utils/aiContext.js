import OpenAI from "openai";

const providers = [
  {
    name: "Groq",
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
  },
  {
    name: "OpenRouter",
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    model: "meta-llama/llama-3.2-3b-instruct:free",
  },
];

const provider = providers.find(item => item.apiKey);

const client = provider
  ? new OpenAI({
      baseURL: provider.baseURL,
      apiKey: provider.apiKey,
      dangerouslyAllowBrowser: true,
    })
  : null;

const formatINR = (value = 0) => {
  if (value >= 1e7) return `Rs ${(value / 1e7).toFixed(2)} Cr`;
  if (value >= 1e5) return `Rs ${(value / 1e5).toFixed(2)} L`;
  return `Rs ${Number(value).toLocaleString("en-IN")}`;
};

const parseSummary = (summary) => {
  if (typeof summary !== "string") return summary;

  try {
    return JSON.parse(summary);
  } catch {
    return null;
  }
};

const findCity = (data, cityName) =>
  data?.cityBreakdown?.find(
    city => city.city.toLowerCase() === cityName.toLowerCase()
  );

const getFallbackAnswer = (question, summary) => {
  const data = parseSummary(summary);
  const q = question.toLowerCase();

  if (!data) return "Analytics service temporarily unavailable.";

  if (q.includes("top") || q.includes("highest") || q.includes("collection") || q.includes("revenue")) {
    const city = data.cityBreakdown?.reduce((best, current) =>
      current.collection_INR > (best?.collection_INR || 0) ? current : best
    , null);

    if (city) {
      return `${city.city} has the highest collection at ${formatINR(city.collection_INR)}.`;
    }
  }

  const cityMatch = data.cityBreakdown?.find(city =>
    q.includes(city.city.toLowerCase())
  );

  if (cityMatch && (q.includes("reject") || q.includes("rejected"))) {
    return `${cityMatch.city} has ${cityMatch.rejected} rejected properties.`;
  }

  if (cityMatch && (q.includes("approval") || q.includes("%") || q.includes("rate"))) {
    return `${cityMatch.city}'s approval rate is ${cityMatch.approvalRate_pct}%, with ${cityMatch.approved} approved properties out of ${cityMatch.total}.`;
  }

  if (cityMatch && q.includes("pending")) {
    return `${cityMatch.city} has ${cityMatch.pending} pending approvals.`;
  }

  if (q.includes("pending")) {
    return `There are ${data.national.pending} pending approvals across all cities.`;
  }

  if (q.includes("approved")) {
    return `There are ${data.national.approved} approved properties across all cities.`;
  }

  if (q.includes("rejected")) {
    return `There are ${data.national.rejected} rejected properties across all cities.`;
  }

  if (q.includes("total")) {
    return `The dataset contains ${data.national.total} total properties across all cities.`;
  }

  return `Current view: ${data.currentView.total} properties, ${data.currentView.approved} approved, ${data.currentView.rejected} rejected, and ${data.currentView.pending} pending.`;
};

export async function askAnalytics(question, summary) {
  const fallbackAnswer = getFallbackAnswer(question, summary);

  try {
    if (!client) {
      return fallbackAnswer;
    }

    const datasetSummary =
      typeof summary === "string" ? summary : JSON.stringify(summary, null, 2);

    const completion = await client.chat.completions.create({
      model: provider.model,
      messages: [
        {
          role: "system",
          content: `
You are a municipal analytics assistant.

Use this dataset summary to answer questions briefly and clearly.

${datasetSummary}
          `,
        },
        {
          role: "user",
          content: question,
        },
      ],
      max_tokens: 120,
    });

    return (
      completion.choices?.[0]?.message?.content?.trim() ||
      fallbackAnswer
    );
  } catch (error) {
    console.error(error);

    return fallbackAnswer;
  }
}
