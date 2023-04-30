export default (): Record<string, unknown> => ({
  port: parseInt(process.env.PORT, 10),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  },
  exchange: process.env.EXCHANGE_RATE_API_KEY,
});
