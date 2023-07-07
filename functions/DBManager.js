const User = require("./User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const SECRET_KEY =
  "mcodvhrnfolfgohlrhfugoypfnr7593hf9tgg5eego069gkrnkgordlfvbhgptktgei";
const HASH_PASSWORD_KEY =
  "kj98ufo2ihfofjseof03i4598glfkkahofiweprkkldfnvowert9w0epgojldkfnvlksdmfgpowjret";

const splitBearerToken = (token) => {
  token = token + "";
  token = token.replace("Bearer ", "");

  return token;
};

const STATUS_CODE = {
  SUCCESS: 200,
  FAILED: 401,
  NO_AUTH_TOKEN: 402,
  INVALID_CREDENTIALS: 403,
  USERNAME_ALREADY_EXISTED: 404,
  EMAIL_ALREADY_EXISTED: 405,
  PASSWORD_NOT_MATCHING: 406,
  TOKEN_EXPIRED: 407,
  NOT_FOUND: 408,
  SERVER_ERROR: 500,
  BAD_REQUEST: 501,
  UNAUTHORIZED: 501,
};

const generateHashPassword = (password) => {
  const hash = crypto
    .pbkdf2Sync(password, HASH_PASSWORD_KEY, 10000, 64, "sha512")
    .toString("hex");
  return hash;
};
const testAPI = (req, res, next) => {
  // res.send(generateToken());
  res.send(checkIfUserAlreadyExist("sflksdjf"));
};
var checkIfUserAlreadyExist = async (email) => {};

const verifyToken = (res, token, response) => {
  if (!token) {
    res.status(401).json({
      status: 401,
      message: "No Token Found In Header",
    });
    return false;
  }
  // if (!response) {
  //   res.status(401).json({
  //     status: 401,
  //     message: "Invalid/Expired Token",
  //   });
  //   return false;
  // }
  return true;
  // // Verify and decode the token
  // jwt.verify(token, SECRET_KEY, (err, decoded) => {
  //   if (err) {
  //     return res
  //       .status(403)
  //       .json({message: "Invalid/Expired Token", token: token, error: err});
  //   }

  //   // Store the decoded token data for future use (if needed)
  //   req.user = decoded;
  //   res.status(200).json({
  //     status: 200,
  //     message: "Authentication Successful",
  //     token: token,
  //   });
  // });
};

var generateToken = (email, password) => {
  const payload = {
    email: email,
    password: password,
  };
  return (token = jwt.sign(payload, SECRET_KEY));
};

const check = (req, res, next) => {
  console.log("API is Running");
  res.status(200);
  res.json({
    status: 200,
    message: "API Is Running",
  });
};

const index = (req, res, next) => {
  User.find()
    .then((response) => {
      res.json({response});
    })
    .catch((error) => {
      res.json({message: "Error :" + error});
    });
};

const show = (req, res, next) => {
  let userId = req.body.userId;
  console.log("Request By user To Show Data :", req.body.userId);
  User.findById(userId)
    .then((response) => {
      res.json({response});
    })
    .catch((error) => {
      res.json({message: "Error :" + error});
    });
};

const register = (req, res, next) => {
  var _name = req.body.name;
  var _email = req.body.email;
  var _phoneNo = req.body.phoneNo;
  var _password = generateHashPassword(req.body.password);
  var _token = generateToken(req.body.email, _password);

  validateAndRegistration((status) => {
    if (!status) {
      let data = new User({
        name: _name,
        email: _email,
        phoneNo: _phoneNo,
        password: _password,
        token: _token,
      });
      data
        .save()
        .then(() => {
          res.status(STATUS_CODE.SUCCESS);
          res.json({
            status: STATUS_CODE.SUCCESS,
            message: "Registration Successful",
            token: _token,
          });
        })
        .catch((error) => {
          res.status(401);
          res.json({message: "Error :" + error});
        });
    } else {
      res.status(STATUS_CODE.EMAIL_ALREADY_EXISTED);
      res.json({
        status: STATUS_CODE.EMAIL_ALREADY_EXISTED,
        message: "User already exist. Please sign in to continue",
      });
    }
  }, _email);
};
const validateAndRegistration = async (callback, _email) => {
  try {
    const query = {email: _email};
    const result = await User.findOne(query);
    console.log;
    callback(result);
  } catch (e) {
    callback(null);
    console.log(e);
  }
};

const loginWithToken = (req, res, next) => {
  let _token = splitBearerToken(req.headers.authorization);

  User.findOne({token: _token})
    .then((response) => {
      if (!response) {
        res.json({
          status: STATUS_CODE.TOKEN_EXPIRED,
          message: "Invalid/Expired Token",
        });
        return;
      }

      res.json({
        status: STATUS_CODE.SUCCESS,
        message: "Authentication Using Token Successful",
        data: {
          name: response.name,
          phoneNo: response.phoneNo,
          email: response.email,
          inventory: response.inventory,
        },
      });
    })
    .catch((error) => {
      res.json(() => {
        res.json({
          status: STATUS_CODE.TOKEN_EXPIRED,
          message: "Invalid/Expire Token",
          error: {
            message: error,
          },
        });
      });
    });
};

const update = (req, res, next) => {
  let emailId = req.body.email;
  let data = {
    name: req.body.name,
    email: req.body.email,
    phoneNo: req.body.phoneNo,
    password: req.body.password,
  };
  User.findOneAndUpdate({email: emailId}, {$set: data}, {returnOriginal: false})
    .then(() => {
      res.json({message: "User Update Successful"});
    })
    .catch((error) => {
      res.json({Error: error});
    });
};

const find = (req, res, next) => {
  let emailId = req.body.email;
  User.findOne({email: emailId})
    .then((response) => {
      res.json({message: response || "No User Found"});
    })
    .catch((err) => {
      res.json({message: err});
    });
};
const remove = (req, res, next) => {
  let userId = req.body.userId;
  User.findByIdAndRemove(userId)
    .then(() => {
      res.json({message: "User Delete Successfully"});
    })
    .catch((error) => {
      res.json({message: "Error :" + error});
    });
};

const login = (req, res, next) => {
  let emailId = req.body.email;
  let password = generateHashPassword(req.body.password);
  const token = generateToken();

  User.findOne({email: emailId})
    .then((response) => {
      if (response.password === password) {
        return User.updateOne({email: emailId}, {$set: {token: token}})
          .then(() => {
            res.status(STATUS_CODE.SUCCESS);
            res.json({
              status: STATUS_CODE.SUCCESS,
              message: "Login Successful",
              token: token,
            });
          })
          .catch((error) => {
            console.error("Error updating token:", error);
            res.status(STATUS_CODE.FAILED);
            res.json({
              status: STATUS_CODE.FAILED,
              message: "An error occurred during token update.",
              error: {
                message: error,
              },
            });
          });
      } else {
        res.status(STATUS_CODE.FAILED);
        res.json({
          status: STATUS_CODE.PASSWORD_NOT_MATCHING,
          message: "Password Incorrect",
        });
      }
    })
    .catch((error) => {
      res.json({
        status: STATUS_CODE.BAD_REQUEST,
        message: "Login Failed",
        error: {
          message: error,
        },
      });
    });
};

const addInventory = (req, res, next) => {
  var _token = splitBearerToken(req.headers.authorization);
  var _productId = req.body.product_id;
  var _productName = req.body.product_name;
  var _productDate = req.body.product_date;
  var _productStockRemain = req.body.stock_remain;
  var _productStatus = req.body.stock_status;
  let data = {
    inventory: {
      product_id: _productId,
      product_name: _productName,
      product_date: _productDate,
      product_stock_remain: _productStockRemain,
      product_status: _productStatus,
    },
  };

  if (!verifyToken(res, _token)) {
    return;
  }

  User.findOneAndUpdate({token: _token}, {$push: data}, {returnOriginal: true})
    .then(() => {
      res.json({
        status: 200,
        message: "Inventory Added Successfully",
        data: {
          product_id: _productId,
          product_name: _productName,
          product_date: _productDate,
          product_stock_remain: _productStockRemain,
          product_status: _productStatus,
        },
      });
    })
    .catch((error) => {
      res.json({Error: error});
    });
};
const getInventory = (req, res, next) => {
  var _token = splitBearerToken(req.headers.authorization);

  User.findOne({token: _token})
  .then((response) => {
    res.json({message: response["inventory"]});
  })
  .catch((err) => {
    res.json({message: err});
  });
};
const removeInventory = (req, res, next) => {};

module.exports = {
  index,
  show,
  register,
  check,
  update,
  remove,
  find,
  login,
  addInventory,
  testAPI,
  loginWithToken,
  getInventory
};
