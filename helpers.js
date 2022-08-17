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

module.exports = {
  injectXrayClient,
};
