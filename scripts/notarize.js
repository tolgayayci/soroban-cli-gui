require("dotenv").config();
const { notarize } = require("@electron/notarize");

exports.default = async function notarizing(context) {
  try {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== "darwin") {
      return;
    }

    const appName = context.packager.appInfo.productFilename;

    await notarize({
      appBundleId: "com.tolgayayci.sora",
      appPath: `${appOutDir}/${appName}.app`,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.TEAM_ID,
    });
  } catch (error) {
    console.error("Notarization failed:", error);
    if (error.response) {
      console.error("HTTP Response:", error.response);
    }
    throw error;
  }
};
