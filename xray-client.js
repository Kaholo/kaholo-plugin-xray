const { default: axios } = require("axios");

class XrayClient {
  static XRAY_CLOUD_BASE_URL = "https://xray.cloud.getxray.app";

  static createApiUrl(path) {
    return new URL(path, XrayClient.XRAY_CLOUD_BASE_URL).href;
  }

  token = null;

  async authenticate(credentials) {
    const {
      clientId,
      clientSecret,
    } = credentials;
    const url = XrayClient.createApiUrl("/api/v2/authenticate");
    const data = {
      client_id: clientId,
      client_secret: clientSecret,
    };

    const { data: token } = await axios({
      method: "POST",
      url,
      data,
    });

    this.token = token;
    return { token };
  }

  async importXrayJsonExecutionResults(results) {
    return this.makeAuthorizedApiCall({
      path: "/api/v2/import/execution",
      method: "POST",
      data: results,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async importCucumberJsonExecutionResults(results) {
    return this.makeAuthorizedApiCall({
      path: "/api/v2/import/execution/cucumber",
      method: "POST",
      data: results,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async importJunitXmlExecutionResults(params) {
    const {
      xml,
      pathParameters,
    } = params;

    const urlSearchParams = new URLSearchParams();
    Object.entries(pathParameters).forEach(([key, value]) => {
      if (value) {
        urlSearchParams.append(key, value);
      }
    });

    const junitXmlEndpoint = "/api/v2/import/execution/junit";
    const path = (
      urlSearchParams.keys().length > 0
        ? `${junitXmlEndpoint}?${urlSearchParams.toString()}`
        : junitXmlEndpoint
    );

    return this.makeAuthorizedApiCall({
      path,
      method: "POST",
      data: xml,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }

  async makeAuthorizedApiCall(options) {
    this.checkAuth();

    const {
      path,
      data,
      method,
      headers: additionalHeaders,
    } = options;
    const url = XrayClient.createApiUrl(path);
    const headers = {
      Authorization: `Bearer ${this.token}`,
      ...additionalHeaders,
    };

    try {
      const { data: xrayResponseData } = await axios({
        method,
        url,
        headers,
        data,
      });
      return xrayResponseData;
    } catch (axiosError) {
      const errorInfo = axiosError.response.data?.info;
      const errorsDetails = axiosError.response.data?.errors?.join(", ");
      throw new Error(`API error: ${errorInfo}, errors: ${errorsDetails}`);
    }
  }

  checkAuth() {
    if (!this.token) {
      throw new Error("Xray Client is not authenticated.");
    }
  }
}

module.exports = XrayClient;
