'use strict';
/* global require, module, process, console */

var fs = require('fs-extra');

module.exports = (function (pkgjson) {

  // File-paths for home and settings.
  var home = 
    process.env[(process.platform == 'win32') ? 
    'USERPROFILE' : 'HOME'] + '/.' + pkgjson.name;
  var pref = home + '/settings.json';

  // Make sure home/settings.json exists.
  fs.ensureFileSync(pref);

  function Homebox () {
    // Note: this means file becomes {} if invalid!!!
    this.settings = fs.readJsonSync(pref, {throws: false}) || {};
    if (Object.keys(this.settings).length === 0) this._writeSettings();
  }

  /**
   * Adds/updates settings. Saves to disk
   * @param  {Object} obj key:values to store/update
   */
  Homebox.prototype.set = function(obj) {
    for (var key in obj) {
      this.settings[key] = obj[key];
    }
    this._writeSettings();
  };

  /**
   * Writes settings to disk.
   */
  Homebox.prototype._writeSettings = function() {
    try { fs.writeJsonSync(pref, this.settings); } 
    catch (e) { console.error(e); }
  };

  /**
   * Gets settings value for {key}. If (!key), gets all settings.
   * @param  {String} key Key for value to fetch. If falsey, returns object with
   *                      all settings.
   * @return {Object}     Object with all {key : value} fetched.
   */
  Homebox.prototype.get = function(key) {
    if (!key) return this.settings;
    var r = {};
    r[key] = this.settings[key];
    return r;
  };

  return new Homebox();
});
