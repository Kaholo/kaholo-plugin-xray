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

  async makeAuthorizedApiCall(options) {
    this.checkAuth();

    const {
      path,
      data,
      method,
    } = options;
    const url = XrayClient.createApiUrl(path);
    const headers = {
      Authorization: `Bearer ${this.token}`,
    };

    const { data: xrayResponseData } = await axios({
      method,
      url,
      headers,
      data,
    });

    return xrayResponseData;
  }

  checkAuth() {
    if (!this.token) {
      throw new Error("Xray Client is not authenticated.");
    }
  }
}

module.exports = XrayClient;
