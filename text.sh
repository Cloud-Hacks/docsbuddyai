# Ensure the text variable is non-empty and replace newline characters with spaces
text="Your input text here"
if [[ -z "$text" ]]; then
  echo "Error: Input text cannot be empty."
  exit 1
fi

# Replace newline characters in the input text
formatted_text=$(echo "$text" | tr '\n' ' ')

# Curl command to request embeddings from Vultr
curl "https://api.vultrinference.com/v1/embeddings" \
  -X POST \
  -H "Authorization: Bearer RWQA6U3KKSXMJUE2CH4ER3CDI3DHOPWM4UVA" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "llama2-7b-chat-Q5_K_M", 
        "input": "'"${formatted_text}"'",
        "encoding_format": "float"
      }'
