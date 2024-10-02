from openai import OpenAI

client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = "$API_KEY_REQUIRED_IF_EXECUTING_OUTSIDE_NGC"
)

def findRestaurantsCuisine(restaurantName):
  completion = client.chat.completions.create(
    model="meta/llama-3.1-405b-instruct",
    messages=[{"role":"user","content":f"What kind of cuisine is served at {restaurantName}? Make sure your response takes up at most 1 token."}],
    temperature=0.2,
    top_p=0.7,
    max_tokens=1024,
    stream=True
  )
  return completion

# for chunk in completion:
#   if chunk.choices[0].delta.content is not None:
#     print(chunk.choices[0].delta.content, end="")
