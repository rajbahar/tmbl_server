# tmbl_server
npm install

#run server
npm start

#PM2:
 apps : [{
    script    : "api.js",
    instances : "max",
    exec_mode : "cluster"
  }]

#.env
  HOST=localhost
PORT=3350
SECRET_KEY=n96M1TPG821EdN4mMIjnGKxGytx9W2UJ
CONNECTION_STRING=mongodb://root:007552nZxua6@3.7.170.192:27017/tatacliq?authSource=admin
SMSAPI=http://enterprise.smsgupshup.com/GatewayAPI/rest
SMSUID=2000192300
SMSPASSWORD=Ako9xBEfd



