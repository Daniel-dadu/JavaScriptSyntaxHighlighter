// Generated by CoffeeScript 1.3.3
(function() {
    var Inbound, Internal, Messages, OPTS, Rejects, Senders, Tags, Templates, Urls, Users, Webhooks, https;
  
    // https = require('https');
  
    OPTS = {
      host: 'mandrillapp.com',
      port: 443,
      prefix: '/api/1.0/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mandrill-Node/1.0.9'
      }
    };
  
    exports.Mandrill = (function() {
  
      function Mandrill(apikey, debug) {
        this.apikey = apikey != null ? apikey : null;
        this.debug = debug != null ? debug : false;
        this.templates = new Templates(this);
        this.users = new Users(this);
        this.rejects = new Rejects(this);
        this.inbound = new Inbound(this);
        this.tags = new Tags(this);
        this.messages = new Messages(this);
        this.internal = new Internal(this);
        this.urls = new Urls(this);
        this.webhooks = new Webhooks(this);
        this.senders = new Senders(this);
        if (this.apikey === null) {
          this.apikey = process.env['MANDRILL_APIKEY'];
        }
      }
  
      Mandrill.prototype.call = function(uri, params, onresult, onerror) {
        var req,
          _this = this;
        if (params == null) {
          params = {};
        }
        params.key = this.apikey;
        params = new Buffer(JSON.stringify(params), 'utf8');
        if (this.debug) {
          console.log("Mandrill: Opening request to https://" + OPTS.host + OPTS.prefix + uri + ".json");
        }
        OPTS.path = "" + OPTS.prefix + uri + ".json";
        OPTS.headers['Content-Length'] = params.length;
        req = https.request(OPTS, function(res) {
          var json;
          res.setEncoding('utf8');
          json = '';
          res.on('data', function(d) {
            return json += d;
          });
          return res.on('end', function() {
            try {
              json = JSON.parse(json);
            } catch (e) {
              json = {
                status: 'error',
                name: 'GeneralError',
                message: e
              };
            }
            if (json == null) {
              json = {
                status: 'error',
                name: 'GeneralError',
                message: 'An unexpected error occurred'
              };
            }
            if (res.statusCode !== 200) {
              if (onerror) {
                return onerror(json);
              } else {
                return _this.onerror(json);
              }
            } else {
              if (onresult) {
                return onresult(json);
              }
            }
          });
        });
        req.write(params);
        req.end();
        req.on('error', function(e) {
          if (onerror) {
            return onerror(e);
          } else {
            return _this.onerror({
              status: 'error',
              name: 'GeneralError',
              message: e
            });
          }
        });
        return null;
      };