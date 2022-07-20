const { bootstrap } = require("@kaholo/plugin-library");
const XrayClient = require("./xray-client");

async function importExecutionResults({
  clientId,
  clientSecret,
  executionResultsDocument,
}) {
  const xrayClient = new XrayClient();
  await xrayClient.authenticate({ clientId, clientSecret });

  return xrayClient.makeAuthorizedApiCall({
    path: "/api/v2/import/execution",
    method: "POST",
    data: executionResultsDocument,
  });
}

module.exports = bootstrap({
  importExecutionResults,
});
