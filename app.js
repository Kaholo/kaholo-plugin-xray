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

function createExecutionResult(xrayClient, params) {
  const {
    infoProject,
    infoSummary,
    infoDescription,
    infoUser,
    infoTimestamp,
    infoTestEnvironments,
    testComment,
    testStatus,
    testAssociatedTest,
  } = params;

  const executionResultsDocument = {
    info: {
      project: infoProject,
      summary: infoSummary,
      description: infoDescription,
      user: infoUser,
      startDate: infoTimestamp,
      finishDate: infoTimestamp,
      testEnvironments: infoTestEnvironments,
    },
    tests: [
      {
        testKey: testAssociatedTest,
        start: infoTimestamp,
        finish: infoTimestamp,
        comment: testComment,
        status: testStatus,
      },
    ],
  };

  return xrayClient.importXrayJsonExecutionResults(executionResultsDocument);
}

module.exports = bootstrap({
  importExecutionResults: injectXrayClient(importXrayJsonExecutionResults),
  importCucumberJsonExecutionResults: injectXrayClient(importCucumberJsonExecutionResults),
  importJunitXmlExecutionResults: injectXrayClient(importJunitXmlExecutionResults),
  createExecutionResult: injectXrayClient(createExecutionResult),
});
