const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
})

// Call this method in map.html to get the cuisine name and then use chunk.choices[0]?.delta?.content for the result
async function GetCuisineName(restaurantName) {
  const completion = await openai.chat.completions.create({
    model: "meta/llama-3.1-405b-instruct",
    messages: [{"role":"user","content":`What kind of cuisine is ${restaurantName}? Your response should be a maximum of one token.`}],
    temperature: 0.2,
    top_p: 0.7,
    max_tokens: 1024,
    stream: true
  });

  for await (const chunk of completion) {
    return chunk.choices[0]?.delta?.content || '';
  }
}

