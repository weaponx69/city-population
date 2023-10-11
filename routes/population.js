const fs = require("fs/promises");
const path = require("path");
const DATA_PATH = path.join(__dirname, "../data/state_city_population.json");
const populationByStateAndCity = require(DATA_PATH);

const StateCityParams = {
  type: "object",
  properties: {
    state: { type: "string", minLength: 1 },
    city: { type: "string", minLength: 1 },
  },
  required: ["state", "city"],
};

async function routes(fastify) {
  fastify.get(
    "/api/population/state/:state/city/:city",
    {
      schema: {
        params: StateCityParams,
      },
      response: {
        200: { type: "object", properties: { population: { type: "number" } } },
      },
    },
    (req, res) => {
      const state = req.params.state.toLowerCase();
      const city = req.params.city.toLowerCase();

      if (isNaN(populationByStateAndCity[state]?.[city])) {
        res
          .code(400)
          .send(
            `No population found for city "${req.params.city}" in state "${req.params.state}"`
          );
      } else {
        res
          .code(200)
          .send({ population: populationByStateAndCity[state][city] });
      }
    }
  );

  fastify.put(
    "/api/population/state/:state/city/:city",
    {
      schema: {
        params: StateCityParams,
        body: { type: "number" },
      },
    },
    async (req, res) => {
      const state = req.params.state.toLowerCase();
      const city = req.params.city.toLowerCase();
      const population = Number(req.body);

      if (isNaN(population)) {
        res.code(400).send(`Invalid population value "${req.body}"`);
      }

      res.code(isNaN(populationByStateAndCity[state]?.[city]) ? 201 : 200);
      populationByStateAndCity[state] = {
        ...(populationByStateAndCity[state] || {}),
        [city]: population,
      };
      await fs.writeFile(DATA_PATH, JSON.stringify(populationByStateAndCity));

      res.send();
    }
  );
}

module.exports = routes;
