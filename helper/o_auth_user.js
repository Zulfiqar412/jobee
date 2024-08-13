const userModel = require("../model/user_model");
class UserDataHandler {
  userStrategyData(profile, provider) {
    switch (provider) {
      case "google":
        return this.googleUserData(profile);
        break;
      case "twitter":
        return this.twitterUserData(profile);
        break;
      case "github":
        return;
    }
  }

  googleUserData(input) {
    const { accessToken, profile } = input;

    try {
      const email =
        profile.emails && profile.emails[0] && profile.emails[0].value;
      const image =
        profile.photos && profile.photos[0] && profile.photos[0].value;

      if (!email) {
        throw new Error("Email is required");
      }
      if (!image) {
        throw new Error("image is required");
      }

      const user = new userModel({
        google: {
          email: email,
          name: profile.displayName,
          accountId: profile.id,
          provider: profile.provider,
          image: image,
          accessToken: accessToken
        }
      });

      return user;
    } catch (e) {
      console.log("Error is " + e.message);
      throw e;
    }
  }

  twitterUserData(input) {
    const { accessToken, profile } = input;
    const user = new userModel({
      twitter: {
        email:
          profile.emails[0].value ||
          `${profile.displayName.replaceAll(" ", "")}@gmail.com`,
        accountId: profile.id,
        image: profile.photos[0].value,
        provider: profile.provider,
        name: profile.displayName,
        accessToken: accessToken
      }
    });
    return user;
  }
  githubUserData(input) {
    const { accessToken, profile } = input;
    const user = userModel({
      github: {
        name: profile.username.replaceAll("-", " ") || profile.displayName,
        accountId: profile.id,
        image: profile.photos[0].value,
        email:
          profile.emails[0].value ||
          `${profile.displayName.replaceAll(" ", "")}@gmail.com`,
        provider: profile.provider,
        accessToken: accessToken,
        isEmailVerified: profile.verified
      }
    });
    return user;
  }
}

module.exports = new UserDataHandler();
