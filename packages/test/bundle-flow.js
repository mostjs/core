var cpy = require('cpy')

cpy('src/*.js', 'dist', {
  parents: false,
  rename: function (filename) {
    return filename + '.flow'
  }
}).then()
