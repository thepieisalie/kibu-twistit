function rootRequire(name) {
  return require(__dirname + '/' + name);
}

global.rootRequire = rootRequire;
