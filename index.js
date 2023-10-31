/** @format */

const express = require("express");
const app = express();
const axios = require("axios");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
app.set("view engine", "ejs");


const username = "apitest";
const password = "test123";

app.use("/", async (req, res) => {
  try {
    // Token alma isteği
    const tokenResponse = await axios.post(
      "https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/sessions",
      {},
      {
        auth: {
          username: username,
          password: password,
        },
      }
    );

    if (
      tokenResponse.data &&
      tokenResponse.data.response &&
      tokenResponse.data.response.token
    ) {
      const token = tokenResponse.data.response.token;
      console.log("Token alındı:", token);

      // API verilerini çekme işlemi
      const apiResponse = await axios.patch(
        "https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/layouts/testdb/records/1",
        {
          fieldData: {},
          script: "getData",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let responseData = apiResponse.data.response.scriptResult;
      try {
        responseData = JSON.parse(responseData);

        res.render("index", { liste: responseData });
      } catch (error) {
        console.error("Veri işleme hatası:", error);
      }
  
    } else {
      console.error("Token alınamadı.");
    }
  } catch (error) {
    console.error("API Hata:", error);
  }
});

app.listen(3000, () => {
  console.log("Port 3000'de çalışıyor...");
});
