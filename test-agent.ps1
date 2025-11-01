# Test Script for Telex AI Agent
# Run this after starting the server with: npm run dev

Write-Host "🧪 Testing Telex AI Agent..." -ForegroundColor Cyan
Write-Host ""

# Test Health Endpoint
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get
    Write-Host "✅ Health Check: PASSED" -ForegroundColor Green
    Write-Host "   Response: $($health | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health Check: FAILED" -ForegroundColor Red
    Write-Host "   Make sure the server is running (npm run dev)" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ""

# Test Agent Info Endpoint
Write-Host "2. Testing Agent Info Endpoint..." -ForegroundColor Yellow
try {
    $agent = Invoke-RestMethod -Uri "http://localhost:3000/api/telex/agent" -Method Get
    Write-Host "✅ Agent Info: PASSED" -ForegroundColor Green
    Write-Host "   Agent Name: $($agent.agent.name)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Agent Info: FAILED" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host ""

# Test Webhook Endpoint
Write-Host "3. Testing Webhook Endpoint (Code Review)..." -ForegroundColor Yellow
$testPayload = @{
    message = "review this code:`n```javascript`nfunction add(a, b) { return a + b; }`n```"
    channelId = "test-channel-id"
    userId = "test-user-id"
    messageId = "test-message-id"
} | ConvertTo-Json

try {
    $review = Invoke-RestMethod -Uri "http://localhost:3000/api/telex/webhook" -Method Post -Body $testPayload -ContentType "application/json"
    Write-Host "✅ Code Review Test: PASSED" -ForegroundColor Green
    Write-Host "   Response Type: $($review.response.type)" -ForegroundColor Gray
    if ($review.response.metadata.reviewScore) {
        Write-Host "   Review Score: $($review.response.metadata.reviewScore)/10" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Code Review Test: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   Check your GEMINI_API_KEY in .env file" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "🎉 All tests passed! Your agent is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Deploy to a public URL (Vercel/Railway/Render)" -ForegroundColor White
Write-Host "2. Configure webhook in Telex.im" -ForegroundColor White
Write-Host "3. Test in Telex.im by sending code snippets" -ForegroundColor White
Write-Host ""

