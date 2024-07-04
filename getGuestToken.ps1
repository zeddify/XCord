$headers = @{
    "Authorization" = "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"
}

$response = Invoke-WebRequest -Uri 'https://api.twitter.com/1.1/guest/activate.json' -Method Post -Headers $headers

$guestToken = ($response.Content | ConvertFrom-Json).guest_token
$guestToken | Out-File -FilePath "guestToken.txt" -Encoding utf8