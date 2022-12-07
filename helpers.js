const fs = require("fs");
const { access, readFile } = require("fs/promises");
const isInvalidPath = require("is-invalid-path");

const XrayClient = require("./xray-client");

function injectXrayClient(pluginMethod) {
  return async (params, ...restParams) => {
    const {
      clientId,
      clientSecret,
    } = params;

    const xrayClient = new XrayClient();
    await xrayClient.authenticate({ clientId, clientSecret });

    return pluginMethod(xrayClient, params, ...restParams);
  };
}

async function getResultsDocumentContent(parameterValue) {
  const isParameterPath = !isInvalidPath(parameterValue);
  return (
    isParameterPath
      ? safeReadFile(parameterValue)
      : parameterValue
  );
}

async function pathExists(path) {
  try {
    await access(path, fs.constants.F_OK);
  } catch {
    return false;
  }
  return true;
}

async function safeReadFile(path) {
  if (!await pathExists(path)) {
    throw new Error(`Path ${path} does not exist`);
  }

  const fileContent = await readFile(path);
  return fileContent.toString();
}

module.exports = {
  getResultsDocumentContent,
  injectXrayClient,
  safeReadFile,
};
