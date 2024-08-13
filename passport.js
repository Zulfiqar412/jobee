const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const twitterStrategy = require("passport-twitter").Strategy;
const githubStrategy = require("passport-github").Strategy;
const axios = require("axios");
const userModel = require("./model/user_model");
const userDataHandler = require("./helper/o_auth_user");
require("dotenv").config();

const callBackUrl = (strat) => {
  const url = `http://localhost:3000/auth/${strat}/callback`;
  console.log(`url is ${url}`);
  return url;
};
const providers = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    options: {
      scope: ["profile", "email"],
    },
  },
  twitter: {
    clientID: process.env.TWITTER_CLIENTID,
    clientSecret: process.env.TWITTERCLIENT_SECRET,
    options: {
      failureRedirect: "/login",
    },
  },

  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    options: {
      scope: ["user:email"],
      failureRedirect: "/login",
    },
  },
};

const passportfun = () => {
  passport.use(
    new googleStrategy(
      {
        clientID: providers.google.clientID,
        clientSecret: providers.google.clientSecret,
        callbackURL: callBackUrl("google"),
      },

      async function (accessToken, refreshToken, profile, done) {
        let users = await userModel.findOne({ email: profile.emails[0].value });
        const user = {
          accessToken,
          profile,
        };
        if (users) {
          users.accessToken = accessToken;

          users.save();
          return done(null, users);
        } else {
          let newUser = userDataHandler.userStrategyData(user, "google");

          newUser = newUser.save();
          return done(null, newUser);
        }
      }
    )
  );
  passport.use(
    new twitterStrategy(
      {
        consumerKey: process.env.TWITTER_CLIENTID,
        consumerSecret: process.env.TWITTERCLIENT_SECRET,
        callbackURL: "http://www.localhost:3000/auth/twitter/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        let user = userModel.findOne({
          "twitter.email": profile.emails[0].value,
        });

        let User = {
          accessToken,
          profile,
        };
        if (user) {
          user.accessToken = accessToken;
          (user.provider = profile.provider), user.save();
          return done(null, user);
        } else {
          let newUser = userDataHandler.userStrategyData(User, "google");
          newUser = newUser.save();
          return done(null, newUser);
        }
      }
    )
  );

  passport.use(
    new githubStrategy(
      {
        clientID: providers.github.clientID,
        clientSecret: providers.github.clientSecret,
        callbackURL: callBackUrl("github"),
      },
      async function (accessToken, refreshToken, profile, done) {
        //  console.log("profile is " + JSON.stringify(profile));
        if (
          providers.github.options &&
          providers.github.options.scope &&
          providers.github.options.scope.includes("user:email")
        ) {
          try {
            const response = await axios.get(
              "https://api.github.com/user/emails",
              {
                headers: {
                  Authorization: `token ${accessToken}`,
                },
              }
            );
            for (let e of response.data) {
              // console.log("email is " + JSON.stringify(e));
              if (e.verified) {
                profile.emails = [{ value: e.email }];
                profile.verified = e.verified;
                break;
              }
            }

            let user = await userModel.findOne({
              "github.email": profile.emails[0].value,
              provider: profile.provider,
            });
            let us = {
              profile,
              accessToken,
            };
            if (user) {
              user.accessToken = accessToken;
              (user.provider = profile.provider), user.save();
              return done(null, user);
            } else {
              let newUser = userDataHandler.userStrategyData(us, "github");
              newUser = newUser.save();
              return done(null, newUser);
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log("Scope field is not found");
        }
      }
    )
  );

  return passport;
};

module.exports = {
  providers,
  passportfun,
};
