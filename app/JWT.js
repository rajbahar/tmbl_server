"use strict";

var jwt = require("jsonwebtoken");
const UserService = require("./Service/UserService");
const AdminService = require("./Service/AdminService");
const userService = new UserService();
const _adminService=new AdminService();

class JWT {
  constructor() {}

  *genrateToken(user) {
    const token = jwt.sign(
      {
        user,
      },
      process.env.SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: '90 days'
      }
    );
    return token;
  }

  *genrateURL(user) {
    const token = jwt.sign(
      {
        user,
      },
      process.env.SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );
    return token;
  }

  *verifyUserToken(request, response, next) {
    try {
      let token =
        request.headers["x-access-token"] || request.headers["authorization"];
      // console.log(request.headers)
      if (token.startsWith("Bearer ")) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
        var decoded = yield jwt.verify(token, process.env.SECRET_KEY);

        // console.log("--", decoded);
        switch (decoded.user.Role) {
          case "User":
            // console.log(yield userService.getUserByID(decoded.user));
            let User_isLoggedin=yield userService.getUserByID(decoded.user);
          //  console.log(User_isLoggedin)
            if (User_isLoggedin.Success==true) {
            //   next();
            } else {
              response.status(403).json({
                Success: false,
                error: "error",
                data: "Authentication failed",
              });
            }
            break;
          case "Admin":
            let Admin_isLoggedin=yield _adminService.getUserByID(decoded.user);
            if (Admin_isLoggedin.Success==true) {
            //   next();
            } else {
              response.status(403).json({
                Success: false,
                error: "error",
                Data: "Authentication failed",
              });
            }
            break;
            default:
                response.status(403).json({
                    Success: false,
                    error: "error",
                    Data: "Authentication failed",
                  });
                  break; 
        }

      } else {
        response.status(403).json({
          Success: false,
          error: "error",
          data: "Token not found in request.",
        });
      }
    } catch (error) {
      response.status(403).json({
        Success: false,
        error: error.message,
        data: "Token verify error.",
      });
    }
  }
}

module.exports = JWT;
