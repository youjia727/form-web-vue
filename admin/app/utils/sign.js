const md5 = require('md5-node');
// let Base64 = require('js-base64').Base64;

function _sign(obj) {
  var sign = ''
  for (var item in obj) {
    sign += '&' + item + '=' + obj[item] + '';
  }
  sign = sign.substr(1)
  sign = md5(sign)
  return sign;
}

module.exports = {
  sign: function(data, random) {
	  
    let _data = { random }

    var data = Object.assign(data, _data)

    var keys = Object.keys(data).sort();

    var obj = {};
	
    for (var i = 0; i < keys.length; i++) {
      obj[keys[i]] = data[keys[i]];
    }

    let oSign = {
      sign: ''
    }
    oSign.sign = _sign(obj)

    let add_sign = {}

    add_sign = Object.assign(obj, oSign)

    delete add_sign.random;

    return add_sign;
  }
}
