const express = require("express");
const client = require("./twitter");
const path = require("path");
const app = express();
const { env, writeEnv } = require("./parser");

const PORT = process.env.PORT || 3000;

app.engine("html", require("ejs").renderFile);

app.get("/", async (_, res) => {
  const { oauth_token } = await client.getRequestToken(
    env.TWITTER_CALLBACK_URL
  );
  return res.render(path.join(__dirname, "views/index.html"), {
    oauth_token,
  });
});

app.get("/sessions/callback", async (req, res) => {
  try {
    const { oauth_token, oauth_verifier } = req.query;
    const {
      oauth_token: access_token,
      oauth_token_secret: access_token_secret,
    } = await client.getAccessToken({ oauth_verifier, oauth_token });
    env["TWITTER_ACCESS_TOKEN"] = access_token;
    env["TWITTER_ACCESS_TOKEN_SECRET"] = access_token_secret;
    writeEnv(env);
    return res.json({
      auth: {
        consumer_key: env.TWITTER_CONSUMER_SECRET,
        consumer_secret: env.TWITTER_CONSUMER_KEY,
        access_token,
        access_token_secret,
      },
    });
  } catch (error) {
    return res.redirect("/");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 on ${PORT}`);
});
