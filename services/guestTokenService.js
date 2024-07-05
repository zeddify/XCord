const { exec } = require("child_process");
const fs = require("fs");

function execPromise(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  async function unblockFile() {
    try {
      await execPromise("powershell Unblock-File -Path ./getGuestToken.ps1");
    } catch (error) {
      console.error("Error unblocking the file:", error);
    }
  }
  
  async function getGuestToken() {
    try {
      await execPromise("powershell -File ./getGuestToken.ps1");
      const token = fs.readFileSync("./guestToken.txt", "utf8");
      return token.trim().split("\n")[0];
    } catch (error) {
      console.error("Error in getGuestToken:", error);
      return null;
    }
  }

module.exports = { getGuestToken, unblockFile };
