const { bootstrap } = require("@kaholo/plugin-library");

const { injectXrayClient } = require("./helpers");

async function importXrayJsonExecutionResults(xrayClient, params) {
  const { executionResultsDocument } = params;

  return xrayClient.importXrayJsonExecutionResults(executionResultsDocument);
}

async function importCucumberJsonExecutionResults(xrayClient, params) {
  const { executionResultsDocument } = params;

  return xrayClient.importCucumberJsonExecutionResults(executionResultsDocument);
}

async function importJunitXmlExecutionResults(xrayClient, params) {
  const {
    executionResultsDocument,
    projectKey,
    testExecKey,
    testPlanKey,
    testEnvironments,
    revision,
    fixVersion,
  } = params;

  return xrayClient.importJunitXmlExecutionResults({
    xml: executionResultsDocument,
    pathParameters: {
      projectKey,
      testExecKey,
      testPlanKey,
      testEnvironments,
      revision,
      fixVersion,
    },
  });
}

module.exports = bootstrap({
  importExecutionResults: injectXrayClient(importXrayJsonExecutionResults),
  importCucumberJsonExecutionResults: injectXrayClient(importCucumberJsonExecutionResults),
  importJunitXmlExecutionResults: injectXrayClient(importJunitXmlExecutionResults),
});
