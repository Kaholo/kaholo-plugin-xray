const { bootstrap } = require("@kaholo/plugin-library");

const {
  injectXrayClient,
  getResultsDocumentContent,
} = require("./helpers");

async function importXrayJsonExecutionResults(xrayClient, params) {
  const { executionResultsDocument } = params;
  const resolvedResultsDocumentJson = await getResultsDocumentContent(executionResultsDocument);

  return xrayClient.importXrayJsonExecutionResults(resolvedResultsDocumentJson);
}

async function importCucumberJsonExecutionResults(xrayClient, params) {
  const { executionResultsDocument } = params;
  const resolvedResultsDocumentJson = await getResultsDocumentContent(executionResultsDocument);

  return xrayClient.importCucumberJsonExecutionResults(resolvedResultsDocumentJson);
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
  const resolvedResultsDocumentXml = await getResultsDocumentContent(executionResultsDocument);

  return xrayClient.importJunitXmlExecutionResults({
    xml: resolvedResultsDocumentXml,
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
