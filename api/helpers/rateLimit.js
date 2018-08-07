module.exports = {
        wordCount : (body) => (body.trim().replace(/\s+/gi, ' ').split(' ').length),
        rateLimitCount : (rateLimit, wordNum) => (rateLimit - wordNum)
}