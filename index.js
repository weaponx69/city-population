/**
 * Notes on processed data from:
 * - Double quotes removed from line 2449 (Islamorada, Village of Islands village)
 * - Ignored line 3864 as it has an invalid population number (South Ottawaship,Illinois,s)
 */
const fastify = require("fastify")({ logger: true });

fastify.register(require("./routes/population"));

fastify.listen({ port: 5555 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
