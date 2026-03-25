const axios = require("axios");

exports.runCode = async (source_code, language_id, stdin = "") => {

  try {

    const response = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: source_code,
        language_id: language_id,
        stdin: stdin
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

  } catch (error) {

    console.error("Judge0 error:", error.response?.data || error.message);

    return null;

  }

};