// A single source of truth for your secret key
module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || "my_super_secret_fallback_key_123"
};