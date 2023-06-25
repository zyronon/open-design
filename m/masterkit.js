var createMasterKitModule = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined')
      _scriptDir = _scriptDir || __filename;
  return (function(createMasterKitModule) {
      createMasterKitModule = createMasterKitModule || {};

      var h;
      h || (h = typeof createMasterKitModule !== 'undefined' ? createMasterKitModule : {});
      var aa, ba;
      h.ready = new Promise(function(a, b) {
          aa = a;
          ba = b
      }
      );
      var ca = {}, ea;
      for (ea in h)
          h.hasOwnProperty(ea) && (ca[ea] = h[ea]);
      var fa = "./this.program";
      function ha(a, b) {
          throw b;
      }
      var ia = "object" === typeof window, ja = "function" === typeof importScripts, ka = "object" === typeof process && "object" === typeof process.versions && "string" === typeof process.versions.node, k = "", la, ma, na, oa, pa;
      if (ka)
          k = ja ? require("path").dirname(k) + "/" : __dirname + "/",
          la = function(a, b) {
              oa || (oa = require("fs"));
              pa || (pa = require("path"));
              a = pa.normalize(a);
              return oa.readFileSync(a, b ? null : "utf8")
          }
          ,
          na = function(a) {
              a = la(a, !0);
              a.buffer || (a = new Uint8Array(a));
              a.buffer || qa("Assertion failed: undefined");
              return a
          }
          ,
          ma = function(a, b, c) {
              oa || (oa = require("fs"));
              pa || (pa = require("path"));
              a = pa.normalize(a);
              oa.readFile(a, function(d, e) {
                  d ? c(d) : b(e.buffer)
              })
          }
          ,
          1 < process.argv.length && (fa = process.argv[1].replace(/\\/g, "/")),
          process.argv.slice(2),
          process.on("uncaughtException", function(a) {
              if (!(a instanceof ra))
                  throw a;
          }),
          process.on("unhandledRejection", function(a) {
              throw a;
          }),
          ha = function(a, b) {
              if (noExitRuntime || 0 < sa)
                  throw process.exitCode = a,
                  b;
              b instanceof ra || m("exiting due to exception: " + b);
              process.exit(a)
          }
          ,
          h.inspect = function() {
              return "[Emscripten Module object]"
          }
          ;
      else if (ia || ja)
          ja ? k = self.location.href : "undefined" !== typeof document && document.currentScript && (k = document.currentScript.src),
          _scriptDir && (k = _scriptDir),
          0 !== k.indexOf("blob:") ? k = k.substr(0, k.replace(/[?#].*/, "").lastIndexOf("/") + 1) : k = "",
          la = function(a) {
              var b = new XMLHttpRequest;
              b.open("GET", a, !1);
              b.send(null);
              return b.responseText
          }
          ,
          ja && (na = function(a) {
              var b = new XMLHttpRequest;
              b.open("GET", a, !1);
              b.responseType = "arraybuffer";
              b.send(null);
              return new Uint8Array(b.response)
          }
          ),
          ma = function(a, b, c) {
              var d = new XMLHttpRequest;
              d.open("GET", a, !0);
              d.responseType = "arraybuffer";
              d.onload = function() {
                  200 == d.status || 0 == d.status && d.response ? b(d.response) : c()
              }
              ;
              d.onerror = c;
              d.send(null)
          }
          ;
      var ta = h.print || console.log.bind(console)
        , m = h.printErr || console.warn.bind(console);
      for (ea in ca)
          ca.hasOwnProperty(ea) && (h[ea] = ca[ea]);
      ca = null;
      h.thisProgram && (fa = h.thisProgram);
      h.quit && (ha = h.quit);
      var ua = 0, va;
      h.wasmBinary && (va = h.wasmBinary);
      var noExitRuntime = h.noExitRuntime || !0;
      "object" !== typeof WebAssembly && qa("no native wasm support detected");
      var wa, xa = !1;
      function ya(a) {
          var b = h["_" + a];
          b || qa("Assertion failed: Cannot call unknown function " + (a + ", make sure it is exported"));
          return b
      }
      function za(a, b, c, d) {
          var e = {
              string: function(q) {
                  var t = 0;
                  if (null !== q && void 0 !== q && 0 !== q) {
                      var v = (q.length << 2) + 1;
                      t = Ba(v);
                      Ca(q, r, t, v)
                  }
                  return t
              },
              array: function(q) {
                  var t = Ba(q.length);
                  w.set(q, t >>> 0);
                  return t
              }
          };
          a = ya(a);
          var f = []
            , g = 0;
          if (d)
              for (var l = 0; l < d.length; l++) {
                  var n = e[c[l]];
                  n ? (0 === g && (g = x()),
                  f[l] = n(d[l])) : f[l] = d[l]
              }
          c = a.apply(null, f);
          return c = function(q) {
              0 !== g && y(g);
              return "string" === b ? B(q) : "boolean" === b ? !!q : q
          }(c)
      }
      var Da = "undefined" !== typeof TextDecoder ? new TextDecoder("utf8") : void 0;
      function Ea(a, b, c) {
          b >>>= 0;
          var d = b + c;
          for (c = b; a[c >>> 0] && !(c >= d); )
              ++c;
          if (16 < c - b && a.subarray && Da)
              return Da.decode(a.subarray(b >>> 0, c >>> 0));
          for (d = ""; b < c; ) {
              var e = a[b++ >>> 0];
              if (e & 128) {
                  var f = a[b++ >>> 0] & 63;
                  if (192 == (e & 224))
                      d += String.fromCharCode((e & 31) << 6 | f);
                  else {
                      var g = a[b++ >>> 0] & 63;
                      e = 224 == (e & 240) ? (e & 15) << 12 | f << 6 | g : (e & 7) << 18 | f << 12 | g << 6 | a[b++ >>> 0] & 63;
                      65536 > e ? d += String.fromCharCode(e) : (e -= 65536,
                      d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023))
                  }
              } else
                  d += String.fromCharCode(e)
          }
          return d
      }
      function B(a, b) {
          return (a >>>= 0) ? Ea(r, a, b) : ""
      }
      function Ca(a, b, c, d) {
          c >>>= 0;
          if (!(0 < d))
              return 0;
          var e = c;
          d = c + d - 1;
          for (var f = 0; f < a.length; ++f) {
              var g = a.charCodeAt(f);
              if (55296 <= g && 57343 >= g) {
                  var l = a.charCodeAt(++f);
                  g = 65536 + ((g & 1023) << 10) | l & 1023
              }
              if (127 >= g) {
                  if (c >= d)
                      break;
                  b[c++ >>> 0] = g
              } else {
                  if (2047 >= g) {
                      if (c + 1 >= d)
                          break;
                      b[c++ >>> 0] = 192 | g >> 6
                  } else {
                      if (65535 >= g) {
                          if (c + 2 >= d)
                              break;
                          b[c++ >>> 0] = 224 | g >> 12
                      } else {
                          if (c + 3 >= d)
                              break;
                          b[c++ >>> 0] = 240 | g >> 18;
                          b[c++ >>> 0] = 128 | g >> 12 & 63
                      }
                      b[c++ >>> 0] = 128 | g >> 6 & 63
                  }
                  b[c++ >>> 0] = 128 | g & 63
              }
          }
          b[c >>> 0] = 0;
          return c - e
      }
      function Fa(a) {
          for (var b = 0, c = 0; c < a.length; ++c) {
              var d = a.charCodeAt(c);
              55296 <= d && 57343 >= d && (d = 65536 + ((d & 1023) << 10) | a.charCodeAt(++c) & 1023);
              127 >= d ? ++b : b = 2047 >= d ? b + 2 : 65535 >= d ? b + 3 : b + 4
          }
          return b
      }
      function Ga(a) {
          a >>>= 0;
          for (var b = ""; ; ) {
              var c = r[a++ >> 0 >>> 0];
              if (!c)
                  return b;
              b += String.fromCharCode(c)
          }
      }
      var Ha = "undefined" !== typeof TextDecoder ? new TextDecoder("utf-16le") : void 0;
      function Ia(a, b) {
          var c = a >> 1;
          for (var d = c + b / 2; !(c >= d) && Ja[c >>> 0]; )
              ++c;
          c <<= 1;
          if (32 < c - a && Ha)
              return Ha.decode(r.subarray(a >>> 0, c >>> 0));
          c = "";
          for (d = 0; !(d >= b / 2); ++d) {
              var e = Ka[a + 2 * d >> 1 >>> 0];
              if (0 == e)
                  break;
              c += String.fromCharCode(e)
          }
          return c
      }
      function La(a, b, c) {
          void 0 === c && (c = 2147483647);
          if (2 > c)
              return 0;
          c -= 2;
          var d = b;
          c = c < 2 * a.length ? c / 2 : a.length;
          for (var e = 0; e < c; ++e)
              Ka[b >> 1 >>> 0] = a.charCodeAt(e),
              b += 2;
          Ka[b >> 1 >>> 0] = 0;
          return b - d
      }
      function Ma(a) {
          return 2 * a.length
      }
      function Na(a, b) {
          for (var c = 0, d = ""; !(c >= b / 4); ) {
              var e = C[a + 4 * c >> 2 >>> 0];
              if (0 == e)
                  break;
              ++c;
              65536 <= e ? (e -= 65536,
              d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023)) : d += String.fromCharCode(e)
          }
          return d
      }
      function Oa(a, b, c) {
          b >>>= 0;
          void 0 === c && (c = 2147483647);
          if (4 > c)
              return 0;
          var d = b;
          c = d + c - 4;
          for (var e = 0; e < a.length; ++e) {
              var f = a.charCodeAt(e);
              if (55296 <= f && 57343 >= f) {
                  var g = a.charCodeAt(++e);
                  f = 65536 + ((f & 1023) << 10) | g & 1023
              }
              C[b >> 2 >>> 0] = f;
              b += 4;
              if (b + 4 > c)
                  break
          }
          C[b >> 2 >>> 0] = 0;
          return b - d
      }
      function Pa(a) {
          for (var b = 0, c = 0; c < a.length; ++c) {
              var d = a.charCodeAt(c);
              55296 <= d && 57343 >= d && ++c;
              b += 4
          }
          return b
      }
      function Qa(a) {
          var b = Fa(a) + 1
            , c = Ra(b);
          c && Ca(a, w, c, b);
          return c
      }
      var Sa, w, r, Ka, Ja, C, D, E, Ta;
      function Ua() {
          var a = wa.buffer;
          Sa = a;
          h.HEAP8 = w = new Int8Array(a);
          h.HEAP16 = Ka = new Int16Array(a);
          h.HEAP32 = C = new Int32Array(a);
          h.HEAPU8 = r = new Uint8Array(a);
          h.HEAPU16 = Ja = new Uint16Array(a);
          h.HEAPU32 = D = new Uint32Array(a);
          h.HEAPF32 = E = new Float32Array(a);
          h.HEAPF64 = Ta = new Float64Array(a)
      }
      var Va, Wa = [], Xa = [], Ya = [], Za = [], $a = [], sa = 0;
      function ab() {
          var a = h.preRun.shift();
          Wa.unshift(a)
      }
      var bb = 0
        , cb = null
        , db = null;
      h.preloadedImages = {};
      h.preloadedAudios = {};
      function qa(a) {
          if (h.onAbort)
              h.onAbort(a);
          a = "Aborted(" + a + ")";
          m(a);
          xa = !0;
          a = new WebAssembly.RuntimeError(a + ". Build with -s ASSERTIONS=1 for more info.");
          ba(a);
          throw a;
      }
      function eb() {
          return F.startsWith("data:application/octet-stream;base64,")
      }
      var F;
      F = "masterkit.wasm";
      if (!eb()) {
          var fb = F;
          F = h.locateFile ? h.locateFile(fb, k) : k + fb
      }
      function gb() {
          var a = F;
          try {
              if (a == F && va)
                  return new Uint8Array(va);
              if (na)
                  return na(a);
              throw "both async and sync fetching of the wasm failed";
          } catch (b) {
              qa(b)
          }
      }
      function hb() {
          if (!va && (ia || ja)) {
              if ("function" === typeof fetch && !F.startsWith("file://"))
                  return fetch(F, {
                      credentials: "same-origin"
                  }).then(function(a) {
                      if (!a.ok)
                          throw "failed to load wasm binary file at '" + F + "'";
                      return a.arrayBuffer()
                  }).catch(function() {
                      return gb()
                  });
              if (ma)
                  return new Promise(function(a, b) {
                      ma(F, function(c) {
                          a(new Uint8Array(c))
                      }, b)
                  }
                  )
          }
          return Promise.resolve().then(function() {
              return gb()
          })
      }
      var G, ib, jb = {
          1168113: function() {
              return w.length
          },
          1168133: function(a, b) {
              a = new Uint8ClampedArray(Sa,a,b);
              console.log("prepare to render");
              if ("function" == typeof h.Vf)
                  try {
                      return h.Vf(a),
                      1
                  } catch (c) {}
              return 0
          },
          1168342: function() {
              h.vg = Va
          },
          1168376: function() {
              noExitRuntime = !0
          },
          1168397: function() {
              let a = h.resources;
              a.images = {};
              a.fonts = {};
              a.relation = {};
              a.hashRelation = {}
          }
      };
      function kb(a) {
          for (; 0 < a.length; ) {
              var b = a.shift();
              if ("function" == typeof b)
                  b(h);
              else {
                  var c = b.kg;
                  "number" === typeof c ? void 0 === b.cf ? H(c)() : H(c)(b.cf) : c(void 0 === b.cf ? null : b.cf)
              }
          }
      }
      var lb = [];
      function H(a) {
          var b = lb[a];
          b || (a >= lb.length && (lb.length = a + 1),
          lb[a] = b = Va.get(a));
          return b
      }
      function mb(a) {
          this.Ke = a - 16;
          this.bg = function(b) {
              C[this.Ke + 4 >> 2 >>> 0] = b
          }
          ;
          this.Zf = function(b) {
              C[this.Ke + 8 >> 2 >>> 0] = b
          }
          ;
          this.$f = function() {
              C[this.Ke >> 2 >>> 0] = 0
          }
          ;
          this.Yf = function() {
              w[this.Ke + 12 >> 0 >>> 0] = 0
          }
          ;
          this.ag = function() {
              w[this.Ke + 13 >> 0 >>> 0] = 0
          }
          ;
          this.Mf = function(b, c) {
              this.bg(b);
              this.Zf(c);
              this.$f();
              this.Yf();
              this.ag()
          }
      }
      var nb = 0;
      function ob() {
          function a(g) {
              return (g = g.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? g[1] : "GMT"
          }
          var b = (new Date).getFullYear()
            , c = new Date(b,0,1)
            , d = new Date(b,6,1);
          b = c.getTimezoneOffset();
          var e = d.getTimezoneOffset()
            , f = Math.max(b, e);
          C[pb() >> 2 >>> 0] = 60 * f;
          C[qb() >> 2 >>> 0] = Number(b != e);
          c = a(c);
          d = a(d);
          c = Qa(c);
          d = Qa(d);
          e < b ? (C[rb() >> 2 >>> 0] = c,
          C[rb() + 4 >> 2 >>> 0] = d) : (C[rb() >> 2 >>> 0] = d,
          C[rb() + 4 >> 2 >>> 0] = c)
      }
      var sb;
      function tb(a, b) {
          for (var c = 0, d = a.length - 1; 0 <= d; d--) {
              var e = a[d];
              "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1),
              c++) : c && (a.splice(d, 1),
              c--)
          }
          if (b)
              for (; c; c--)
                  a.unshift("..");
          return a
      }
      function ub(a) {
          var b = "/" === a.charAt(0)
            , c = "/" === a.substr(-1);
          (a = tb(a.split("/").filter(function(d) {
              return !!d
          }), !b).join("/")) || b || (a = ".");
          a && c && (a += "/");
          return (b ? "/" : "") + a
      }
      function vb(a) {
          var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
          a = b[0];
          b = b[1];
          if (!a && !b)
              return ".";
          b && (b = b.substr(0, b.length - 1));
          return a + b
      }
      function wb(a) {
          if ("/" === a)
              return "/";
          a = ub(a);
          a = a.replace(/\/$/, "");
          var b = a.lastIndexOf("/");
          return -1 === b ? a : a.substr(b + 1)
      }
      function xb() {
          if ("object" === typeof crypto && "function" === typeof crypto.getRandomValues) {
              var a = new Uint8Array(1);
              return function() {
                  crypto.getRandomValues(a);
                  return a[0]
              }
          }
          if (ka)
              try {
                  var b = require("crypto");
                  return function() {
                      return b.randomBytes(1)[0]
                  }
              } catch (c) {}
          return function() {
              qa("randomDevice")
          }
      }
      function yb() {
          for (var a = "", b = !1, c = arguments.length - 1; -1 <= c && !b; c--) {
              b = 0 <= c ? arguments[c] : "/";
              if ("string" !== typeof b)
                  throw new TypeError("Arguments to path.resolve must be strings");
              if (!b)
                  return "";
              a = b + "/" + a;
              b = "/" === b.charAt(0)
          }
          a = tb(a.split("/").filter(function(d) {
              return !!d
          }), !b).join("/");
          return (b ? "/" : "") + a || "."
      }
      var zb = [];
      function Ab(a, b) {
          zb[a] = {
              input: [],
              output: [],
              Ne: b
          };
          Bb(a, Cb)
      }
      var Cb = {
          open: function(a) {
              var b = zb[a.node.rdev];
              if (!b)
                  throw new J(43);
              a.tty = b;
              a.seekable = !1
          },
          close: function(a) {
              a.tty.Ne.flush(a.tty)
          },
          flush: function(a) {
              a.tty.Ne.flush(a.tty)
          },
          read: function(a, b, c, d) {
              if (!a.tty || !a.tty.Ne.xf)
                  throw new J(60);
              for (var e = 0, f = 0; f < d; f++) {
                  try {
                      var g = a.tty.Ne.xf(a.tty)
                  } catch (l) {
                      throw new J(29);
                  }
                  if (void 0 === g && 0 === e)
                      throw new J(6);
                  if (null === g || void 0 === g)
                      break;
                  e++;
                  b[c + f] = g
              }
              e && (a.node.timestamp = Date.now());
              return e
          },
          write: function(a, b, c, d) {
              if (!a.tty || !a.tty.Ne.gf)
                  throw new J(60);
              try {
                  for (var e = 0; e < d; e++)
                      a.tty.Ne.gf(a.tty, b[c + e])
              } catch (f) {
                  throw new J(29);
              }
              d && (a.node.timestamp = Date.now());
              return e
          }
      }
        , Eb = {
          xf: function(a) {
              if (!a.input.length) {
                  var b = null;
                  if (ka) {
                      var c = Buffer.alloc(256)
                        , d = 0;
                      try {
                          d = oa.readSync(process.stdin.fd, c, 0, 256, null)
                      } catch (e) {
                          if (e.toString().includes("EOF"))
                              d = 0;
                          else
                              throw e;
                      }
                      0 < d ? b = c.slice(0, d).toString("utf-8") : b = null
                  } else
                      "undefined" != typeof window && "function" == typeof window.prompt ? (b = window.prompt("Input: "),
                      null !== b && (b += "\n")) : "function" == typeof readline && (b = readline(),
                      null !== b && (b += "\n"));
                  if (!b)
                      return null;
                  a.input = Db(b, !0)
              }
              return a.input.shift()
          },
          gf: function(a, b) {
              null === b || 10 === b ? (ta(Ea(a.output, 0)),
              a.output = []) : 0 != b && a.output.push(b)
          },
          flush: function(a) {
              a.output && 0 < a.output.length && (ta(Ea(a.output, 0)),
              a.output = [])
          }
      }
        , Fb = {
          gf: function(a, b) {
              null === b || 10 === b ? (m(Ea(a.output, 0)),
              a.output = []) : 0 != b && a.output.push(b)
          },
          flush: function(a) {
              a.output && 0 < a.output.length && (m(Ea(a.output, 0)),
              a.output = [])
          }
      };
      function Gb(a) {
          a = 65536 * Math.ceil(a / 65536);
          var b = Hb(65536, a);
          if (!b)
              return 0;
          r.fill(0, b, b + a);
          return b
      }
      var K = {
          Ee: null,
          He: function() {
              return K.createNode(null, "/", 16895, 0)
          },
          createNode: function(a, b, c, d) {
              if (24576 === (c & 61440) || 4096 === (c & 61440))
                  throw new J(63);
              K.Ee || (K.Ee = {
                  dir: {
                      node: {
                          De: K.xe.De,
                          Ge: K.xe.Ge,
                          lookup: K.xe.lookup,
                          Ve: K.xe.Ve,
                          rename: K.xe.rename,
                          unlink: K.xe.unlink,
                          rmdir: K.xe.rmdir,
                          readdir: K.xe.readdir,
                          symlink: K.xe.symlink
                      },
                      stream: {
                          Je: K.ye.Je
                      }
                  },
                  file: {
                      node: {
                          De: K.xe.De,
                          Ge: K.xe.Ge
                      },
                      stream: {
                          Je: K.ye.Je,
                          read: K.ye.read,
                          write: K.ye.write,
                          nf: K.ye.nf,
                          We: K.ye.We,
                          Ye: K.ye.Ye
                      }
                  },
                  link: {
                      node: {
                          De: K.xe.De,
                          Ge: K.xe.Ge,
                          readlink: K.xe.readlink
                      },
                      stream: {}
                  },
                  qf: {
                      node: {
                          De: K.xe.De,
                          Ge: K.xe.Ge
                      },
                      stream: Ib
                  }
              });
              c = Jb(a, b, c, d);
              16384 === (c.mode & 61440) ? (c.xe = K.Ee.dir.node,
              c.ye = K.Ee.dir.stream,
              c.ze = {}) : 32768 === (c.mode & 61440) ? (c.xe = K.Ee.file.node,
              c.ye = K.Ee.file.stream,
              c.Ae = 0,
              c.ze = null) : 40960 === (c.mode & 61440) ? (c.xe = K.Ee.link.node,
              c.ye = K.Ee.link.stream) : 8192 === (c.mode & 61440) && (c.xe = K.Ee.qf.node,
              c.ye = K.Ee.qf.stream);
              c.timestamp = Date.now();
              a && (a.ze[b] = c,
              a.timestamp = c.timestamp);
              return c
          },
          lg: function(a) {
              return a.ze ? a.ze.subarray ? a.ze.subarray(0, a.Ae) : new Uint8Array(a.ze) : new Uint8Array(0)
          },
          uf: function(a, b) {
              b >>>= 0;
              var c = a.ze ? a.ze.length : 0;
              c >= b || (b = Math.max(b, c * (1048576 > c ? 2 : 1.125) >>> 0),
              0 != c && (b = Math.max(b, 256)),
              c = a.ze,
              a.ze = new Uint8Array(b),
              0 < a.Ae && a.ze.set(c.subarray(0, a.Ae), 0))
          },
          Wf: function(a, b) {
              b >>>= 0;
              if (a.Ae != b)
                  if (0 == b)
                      a.ze = null,
                      a.Ae = 0;
                  else {
                      var c = a.ze;
                      a.ze = new Uint8Array(b);
                      c && a.ze.set(c.subarray(0, Math.min(b, a.Ae)));
                      a.Ae = b
                  }
          },
          xe: {
              De: function(a) {
                  var b = {};
                  b.dev = 8192 === (a.mode & 61440) ? a.id : 1;
                  b.ino = a.id;
                  b.mode = a.mode;
                  b.nlink = 1;
                  b.uid = 0;
                  b.gid = 0;
                  b.rdev = a.rdev;
                  16384 === (a.mode & 61440) ? b.size = 4096 : 32768 === (a.mode & 61440) ? b.size = a.Ae : 40960 === (a.mode & 61440) ? b.size = a.link.length : b.size = 0;
                  b.atime = new Date(a.timestamp);
                  b.mtime = new Date(a.timestamp);
                  b.ctime = new Date(a.timestamp);
                  b.Gf = 4096;
                  b.blocks = Math.ceil(b.size / b.Gf);
                  return b
              },
              Ge: function(a, b) {
                  void 0 !== b.mode && (a.mode = b.mode);
                  void 0 !== b.timestamp && (a.timestamp = b.timestamp);
                  void 0 !== b.size && K.Wf(a, b.size)
              },
              lookup: function() {
                  throw Kb[44];
              },
              Ve: function(a, b, c, d) {
                  return K.createNode(a, b, c, d)
              },
              rename: function(a, b, c) {
                  if (16384 === (a.mode & 61440)) {
                      try {
                          var d = Lb(b, c)
                      } catch (f) {}
                      if (d)
                          for (var e in d.ze)
                              throw new J(55);
                  }
                  delete a.parent.ze[a.name];
                  a.parent.timestamp = Date.now();
                  a.name = c;
                  b.ze[c] = a;
                  b.timestamp = a.parent.timestamp;
                  a.parent = b
              },
              unlink: function(a, b) {
                  delete a.ze[b];
                  a.timestamp = Date.now()
              },
              rmdir: function(a, b) {
                  var c = Lb(a, b), d;
                  for (d in c.ze)
                      throw new J(55);
                  delete a.ze[b];
                  a.timestamp = Date.now()
              },
              readdir: function(a) {
                  var b = [".", ".."], c;
                  for (c in a.ze)
                      a.ze.hasOwnProperty(c) && b.push(c);
                  return b
              },
              symlink: function(a, b, c) {
                  a = K.createNode(a, b, 41471, 0);
                  a.link = c;
                  return a
              },
              readlink: function(a) {
                  if (40960 !== (a.mode & 61440))
                      throw new J(28);
                  return a.link
              }
          },
          ye: {
              read: function(a, b, c, d, e) {
                  var f = a.node.ze;
                  if (e >= a.node.Ae)
                      return 0;
                  a = Math.min(a.node.Ae - e, d);
                  if (8 < a && f.subarray)
                      b.set(f.subarray(e, e + a), c);
                  else
                      for (d = 0; d < a; d++)
                          b[c + d] = f[e + d];
                  return a
              },
              write: function(a, b, c, d, e, f) {
                  b.buffer === w.buffer && (f = !1);
                  if (!d)
                      return 0;
                  a = a.node;
                  a.timestamp = Date.now();
                  if (b.subarray && (!a.ze || a.ze.subarray)) {
                      if (f)
                          return a.ze = b.subarray(c, c + d),
                          a.Ae = d;
                      if (0 === a.Ae && 0 === e)
                          return a.ze = b.slice(c, c + d),
                          a.Ae = d;
                      if (e + d <= a.Ae)
                          return a.ze.set(b.subarray(c, c + d), e),
                          d
                  }
                  K.uf(a, e + d);
                  if (a.ze.subarray && b.subarray)
                      a.ze.set(b.subarray(c, c + d), e);
                  else
                      for (f = 0; f < d; f++)
                          a.ze[e + f] = b[c + f];
                  a.Ae = Math.max(a.Ae, e + d);
                  return d
              },
              Je: function(a, b, c) {
                  1 === c ? b += a.position : 2 === c && 32768 === (a.node.mode & 61440) && (b += a.node.Ae);
                  if (0 > b)
                      throw new J(28);
                  return b
              },
              nf: function(a, b, c) {
                  K.uf(a.node, b + c);
                  a.node.Ae = Math.max(a.node.Ae, b + c)
              },
              We: function(a, b, c, d, e, f) {
                  if (0 !== b)
                      throw new J(28);
                  if (32768 !== (a.node.mode & 61440))
                      throw new J(43);
                  a = a.node.ze;
                  if (f & 2 || a.buffer !== Sa) {
                      if (0 < d || d + c < a.length)
                          a.subarray ? a = a.subarray(d, d + c) : a = Array.prototype.slice.call(a, d, d + c);
                      d = !0;
                      c = Gb(c);
                      if (!c)
                          throw new J(48);
                      c >>>= 0;
                      w.set(a, c >>> 0)
                  } else
                      d = !1,
                      c = a.byteOffset;
                  return {
                      Ke: c,
                      bf: d
                  }
              },
              Ye: function(a, b, c, d, e) {
                  if (32768 !== (a.node.mode & 61440))
                      throw new J(43);
                  if (e & 2)
                      return 0;
                  K.ye.write(a, b, 0, d, c, !1);
                  return 0
              }
          }
      }
        , Mb = null
        , Nb = {}
        , Ob = []
        , Pb = 1
        , Qb = null
        , Rb = !0
        , J = null
        , Kb = {};
      function Sb(a, b) {
          a = yb("/", a);
          b = b || {};
          if (!a)
              return {
                  path: "",
                  node: null
              };
          var c = {
              vf: !0,
              hf: 0
          }, d;
          for (d in c)
              void 0 === b[d] && (b[d] = c[d]);
          if (8 < b.hf)
              throw new J(32);
          a = tb(a.split("/").filter(function(g) {
              return !!g
          }), !1);
          var e = Mb;
          c = "/";
          for (d = 0; d < a.length; d++) {
              var f = d === a.length - 1;
              if (f && b.parent)
                  break;
              e = Lb(e, a[d]);
              c = ub(c + "/" + a[d]);
              e.Xe && (!f || f && b.vf) && (e = e.Xe.root);
              if (!f || b.ef)
                  for (f = 0; 40960 === (e.mode & 61440); )
                      if (e = Tb(c),
                      c = yb(vb(c), e),
                      e = Sb(c, {
                          hf: b.hf
                      }).node,
                      40 < f++)
                          throw new J(32);
          }
          return {
              path: c,
              node: e
          }
      }
      function Ub(a) {
          for (var b; ; ) {
              if (a === a.parent)
                  return a = a.He.Bf,
                  b ? "/" !== a[a.length - 1] ? a + "/" + b : a + b : a;
              b = b ? a.name + "/" + b : a.name;
              a = a.parent
          }
      }
      function Vb(a, b) {
          for (var c = 0, d = 0; d < b.length; d++)
              c = (c << 5) - c + b.charCodeAt(d) | 0;
          return (a + c >>> 0) % Qb.length
      }
      function Lb(a, b) {
          var c;
          if (c = (c = Wb(a, "x")) ? c : a.xe.lookup ? 0 : 2)
              throw new J(c,a);
          for (c = Qb[Vb(a.id, b)]; c; c = c.Tf) {
              var d = c.name;
              if (c.parent.id === a.id && d === b)
                  return c
          }
          return a.xe.lookup(a, b)
      }
      function Jb(a, b, c, d) {
          a = new Xb(a,b,c,d);
          b = Vb(a.parent.id, a.name);
          a.Tf = Qb[b];
          return Qb[b] = a
      }
      var Yb = {
          r: 0,
          "r+": 2,
          w: 577,
          "w+": 578,
          a: 1089,
          "a+": 1090
      };
      function Zb(a) {
          var b = ["r", "w", "rw"][a & 3];
          a & 512 && (b += "w");
          return b
      }
      function Wb(a, b) {
          if (Rb)
              return 0;
          if (!b.includes("r") || a.mode & 292) {
              if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73))
                  return 2
          } else
              return 2;
          return 0
      }
      function $b(a, b) {
          try {
              return Lb(a, b),
              20
          } catch (c) {}
          return Wb(a, "wx")
      }
      function ac(a) {
          var b = 4096;
          for (a = a || 0; a <= b; a++)
              if (!Ob[a])
                  return a;
          throw new J(33);
      }
      function bc(a, b) {
          cc || (cc = function() {}
          ,
          cc.prototype = {});
          var c = new cc, d;
          for (d in a)
              c[d] = a[d];
          a = c;
          b = ac(b);
          a.fd = b;
          return Ob[b] = a
      }
      var Ib = {
          open: function(a) {
              a.ye = Nb[a.node.rdev].ye;
              a.ye.open && a.ye.open(a)
          },
          Je: function() {
              throw new J(70);
          }
      };
      function Bb(a, b) {
          Nb[a] = {
              ye: b
          }
      }
      function dc(a, b) {
          var c = "/" === b
            , d = !b;
          if (c && Mb)
              throw new J(10);
          if (!c && !d) {
              var e = Sb(b, {
                  vf: !1
              });
              b = e.path;
              e = e.node;
              if (e.Xe)
                  throw new J(10);
              if (16384 !== (e.mode & 61440))
                  throw new J(54);
          }
          b = {
              type: a,
              qg: {},
              Bf: b,
              Sf: []
          };
          a = a.He(b);
          a.He = b;
          b.root = a;
          c ? Mb = a : e && (e.Xe = b,
          e.He && e.He.Sf.push(b))
      }
      function ec(a, b, c) {
          var d = Sb(a, {
              parent: !0
          }).node;
          a = wb(a);
          if (!a || "." === a || ".." === a)
              throw new J(28);
          var e = $b(d, a);
          if (e)
              throw new J(e);
          if (!d.xe.Ve)
              throw new J(63);
          return d.xe.Ve(d, a, b, c)
      }
      function fc(a) {
          return ec(a, 16895, 0)
      }
      function gc(a, b, c) {
          "undefined" === typeof c && (c = b,
          b = 438);
          ec(a, b | 8192, c)
      }
      function hc(a, b) {
          if (!yb(a))
              throw new J(44);
          var c = Sb(b, {
              parent: !0
          }).node;
          if (!c)
              throw new J(44);
          b = wb(b);
          var d = $b(c, b);
          if (d)
              throw new J(d);
          if (!c.xe.symlink)
              throw new J(63);
          c.xe.symlink(c, b, a)
      }
      function Tb(a) {
          a = Sb(a).node;
          if (!a)
              throw new J(44);
          if (!a.xe.readlink)
              throw new J(28);
          return yb(Ub(a.parent), a.xe.readlink(a))
      }
      function ic(a, b) {
          a = Sb(a, {
              ef: !b
          }).node;
          if (!a)
              throw new J(44);
          if (!a.xe.De)
              throw new J(63);
          return a.xe.De(a)
      }
      function jc(a) {
          return ic(a, !0)
      }
      function kc(a, b, c, d) {
          if ("" === a)
              throw new J(44);
          if ("string" === typeof b) {
              var e = Yb[b];
              if ("undefined" === typeof e)
                  throw Error("Unknown file open mode: " + b);
              b = e
          }
          c = b & 64 ? ("undefined" === typeof c ? 438 : c) & 4095 | 32768 : 0;
          if ("object" === typeof a)
              var f = a;
          else {
              a = ub(a);
              try {
                  f = Sb(a, {
                      ef: !(b & 131072)
                  }).node
              } catch (g) {}
          }
          e = !1;
          if (b & 64)
              if (f) {
                  if (b & 128)
                      throw new J(20);
              } else
                  f = ec(a, c, 0),
                  e = !0;
          if (!f)
              throw new J(44);
          8192 === (f.mode & 61440) && (b &= -513);
          if (b & 65536 && 16384 !== (f.mode & 61440))
              throw new J(54);
          if (!e && (c = f ? 40960 === (f.mode & 61440) ? 32 : 16384 === (f.mode & 61440) && ("r" !== Zb(b) || b & 512) ? 31 : Wb(f, Zb(b)) : 44))
              throw new J(c);
          if (b & 512) {
              c = f;
              c = "string" === typeof c ? Sb(c, {
                  ef: !0
              }).node : c;
              if (!c.xe.Ge)
                  throw new J(63);
              if (16384 === (c.mode & 61440))
                  throw new J(31);
              if (32768 !== (c.mode & 61440))
                  throw new J(28);
              if (e = Wb(c, "w"))
                  throw new J(e);
              c.xe.Ge(c, {
                  size: 0,
                  timestamp: Date.now()
              })
          }
          b &= -131713;
          d = bc({
              node: f,
              path: Ub(f),
              id: f.id,
              flags: b,
              mode: f.mode,
              seekable: !0,
              position: 0,
              ye: f.ye,
              xe: f.xe,
              gg: [],
              error: !1
          }, d);
          d.ye.open && d.ye.open(d);
          !h.logReadFiles || b & 1 || (mc || (mc = {}),
          a in mc || (mc[a] = 1));
          return d
      }
      function nc(a, b, c) {
          if (null === a.fd)
              throw new J(8);
          if (!a.seekable || !a.ye.Je)
              throw new J(70);
          if (0 != c && 1 != c && 2 != c)
              throw new J(28);
          a.position = a.ye.Je(a, b, c);
          a.gg = []
      }
      function oc() {
          J || (J = function(a, b) {
              this.node = b;
              this.Xf = function(c) {
                  this.Be = c
              }
              ;
              this.Xf(a);
              this.message = "FS error"
          }
          ,
          J.prototype = Error(),
          J.prototype.constructor = J,
          [44].forEach(function(a) {
              Kb[a] = new J(a);
              Kb[a].stack = "<generic error, no stack>"
          }))
      }
      var pc;
      function qc(a, b) {
          var c = 0;
          a && (c |= 365);
          b && (c |= 146);
          return c
      }
      function rc(a, b, c) {
          a = ub("/dev/" + a);
          var d = qc(!!b, !!c);
          sc || (sc = 64);
          var e = sc++ << 8 | 0;
          Bb(e, {
              open: function(f) {
                  f.seekable = !1
              },
              close: function() {
                  c && c.buffer && c.buffer.length && c(10)
              },
              read: function(f, g, l, n) {
                  for (var q = 0, t = 0; t < n; t++) {
                      try {
                          var v = b()
                      } catch (z) {
                          throw new J(29);
                      }
                      if (void 0 === v && 0 === q)
                          throw new J(6);
                      if (null === v || void 0 === v)
                          break;
                      q++;
                      g[l + t] = v
                  }
                  q && (f.node.timestamp = Date.now());
                  return q
              },
              write: function(f, g, l, n) {
                  for (var q = 0; q < n; q++)
                      try {
                          c(g[l + q])
                      } catch (t) {
                          throw new J(29);
                      }
                  n && (f.node.timestamp = Date.now());
                  return q
              }
          });
          gc(a, d, e)
      }
      var sc, L = {}, cc, mc, tc = {};
      function uc(a, b, c) {
          try {
              var d = a(b)
          } catch (e) {
              if (e && e.node && ub(b) !== ub(Ub(e.node)))
                  return -54;
              throw e;
          }
          C[c >> 2 >>> 0] = d.dev;
          C[c + 4 >> 2 >>> 0] = 0;
          C[c + 8 >> 2 >>> 0] = d.ino;
          C[c + 12 >> 2 >>> 0] = d.mode;
          C[c + 16 >> 2 >>> 0] = d.nlink;
          C[c + 20 >> 2 >>> 0] = d.uid;
          C[c + 24 >> 2 >>> 0] = d.gid;
          C[c + 28 >> 2 >>> 0] = d.rdev;
          C[c + 32 >> 2 >>> 0] = 0;
          ib = [d.size >>> 0, (G = d.size,
          1 <= +Math.abs(G) ? 0 < G ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)];
          C[c + 40 >> 2 >>> 0] = ib[0];
          C[c + 44 >> 2 >>> 0] = ib[1];
          C[c + 48 >> 2 >>> 0] = 4096;
          C[c + 52 >> 2 >>> 0] = d.blocks;
          C[c + 56 >> 2 >>> 0] = d.atime.getTime() / 1E3 | 0;
          C[c + 60 >> 2 >>> 0] = 0;
          C[c + 64 >> 2 >>> 0] = d.mtime.getTime() / 1E3 | 0;
          C[c + 68 >> 2 >>> 0] = 0;
          C[c + 72 >> 2 >>> 0] = d.ctime.getTime() / 1E3 | 0;
          C[c + 76 >> 2 >>> 0] = 0;
          ib = [d.ino >>> 0, (G = d.ino,
          1 <= +Math.abs(G) ? 0 < G ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)];
          C[c + 80 >> 2 >>> 0] = ib[0];
          C[c + 84 >> 2 >>> 0] = ib[1];
          return 0
      }
      function vc(a, b, c, d) {
          for (var e = 0, f = 0; f < c; f++) {
              var g = C[b + (8 * f + 4) >> 2 >>> 0];
              var l = a;
              var n = C[b + 8 * f >> 2 >>> 0]
                , q = g
                , t = d
                , v = w;
              n >>>= 0;
              if (0 > q || 0 > t)
                  throw new J(28);
              if (null === l.fd)
                  throw new J(8);
              if (1 === (l.flags & 2097155))
                  throw new J(8);
              if (16384 === (l.node.mode & 61440))
                  throw new J(31);
              if (!l.ye.read)
                  throw new J(28);
              var z = "undefined" !== typeof t;
              if (!z)
                  t = l.position;
              else if (!l.seekable)
                  throw new J(70);
              n = l.ye.read(l, v, n, q, t);
              z || (l.position += n);
              l = n;
              if (0 > l)
                  return -1;
              e += l;
              if (l < g)
                  break
          }
          return e
      }
      var wc = void 0;
      function xc() {
          wc += 4;
          return C[wc - 4 >> 2 >>> 0]
      }
      function yc(a) {
          a = Ob[a];
          if (!a)
              throw new J(8);
          return a
      }
      function zc(a) {
          switch (a) {
          case 1:
              return 0;
          case 2:
              return 1;
          case 4:
              return 2;
          case 8:
              return 3;
          default:
              throw new TypeError("Unknown type size: " + a);
          }
      }
      var Ac = void 0;
      function M(a) {
          for (var b = ""; r[a >>> 0]; )
              b += Ac[r[a++ >>> 0]];
          return b
      }
      var Bc = {}
        , Cc = {}
        , Dc = {};
      function Ec(a) {
          if (void 0 === a)
              return "_unknown";
          a = a.replace(/[^a-zA-Z0-9_]/g, "$");
          var b = a.charCodeAt(0);
          return 48 <= b && 57 >= b ? "_" + a : a
      }
      function Fc(a, b) {
          a = Ec(a);
          return (new Function("body","return function " + a + '() {\n    "use strict";    return body.apply(this, arguments);\n};\n'))(b)
      }
      function Gc(a) {
          var b = Error
            , c = Fc(a, function(d) {
              this.name = a;
              this.message = d;
              d = Error(d).stack;
              void 0 !== d && (this.stack = this.toString() + "\n" + d.replace(/^Error(:[^\n]*)?\n/, ""))
          });
          c.prototype = Object.create(b.prototype);
          c.prototype.constructor = c;
          c.prototype.toString = function() {
              return void 0 === this.message ? this.name : this.name + ": " + this.message
          }
          ;
          return c
      }
      var Hc = void 0;
      function N(a) {
          throw new Hc(a);
      }
      var Ic = void 0;
      function Jc(a, b) {
          function c(l) {
              l = b(l);
              if (l.length !== d.length)
                  throw new Ic("Mismatched type converter count");
              for (var n = 0; n < d.length; ++n)
                  Kc(d[n], l[n])
          }
          var d = [];
          d.forEach(function(l) {
              Dc[l] = a
          });
          var e = Array(a.length)
            , f = []
            , g = 0;
          a.forEach(function(l, n) {
              Cc.hasOwnProperty(l) ? e[n] = Cc[l] : (f.push(l),
              Bc.hasOwnProperty(l) || (Bc[l] = []),
              Bc[l].push(function() {
                  e[n] = Cc[l];
                  ++g;
                  g === f.length && c(e)
              }))
          });
          0 === f.length && c(e)
      }
      function Kc(a, b, c) {
          c = c || {};
          if (!("argPackAdvance"in b))
              throw new TypeError("registerType registeredInstance requires argPackAdvance");
          var d = b.name;
          a || N('type "' + d + '" must have a positive integer typeid pointer');
          if (Cc.hasOwnProperty(a)) {
              if (c.Lf)
                  return;
              N("Cannot register type '" + d + "' twice")
          }
          Cc[a] = b;
          delete Dc[a];
          Bc.hasOwnProperty(a) && (b = Bc[a],
          delete Bc[a],
          b.forEach(function(e) {
              e()
          }))
      }
      var Lc = []
        , O = [{}, {
          value: void 0
      }, {
          value: null
      }, {
          value: !0
      }, {
          value: !1
      }];
      function Mc(a) {
          4 < a && 0 === --O[a].jf && (O[a] = void 0,
          Lc.push(a))
      }
      function Q(a) {
          a || N("Cannot use deleted val. handle = " + a);
          return O[a].value
      }
      function R(a) {
          switch (a) {
          case void 0:
              return 1;
          case null:
              return 2;
          case !0:
              return 3;
          case !1:
              return 4;
          default:
              var b = Lc.length ? Lc.pop() : O.length;
              O[b] = {
                  jf: 1,
                  value: a
              };
              return b
          }
      }
      function Nc(a) {
          return this.fromWireType(D[a >>> 2])
      }
      function Oc(a) {
          if (null === a)
              return "null";
          var b = typeof a;
          return "object" === b || "array" === b || "function" === b ? a.toString() : "" + a
      }
      function Pc(a, b) {
          switch (b) {
          case 2:
              return function(c) {
                  return this.fromWireType(E[c >>> 2])
              }
              ;
          case 3:
              return function(c) {
                  return this.fromWireType(Ta[c >>> 3])
              }
              ;
          default:
              throw new TypeError("Unknown float type: " + a);
          }
      }
      function Qc(a) {
          var b = Function;
          if (!(b instanceof Function))
              throw new TypeError("new_ called with constructor type " + typeof b + " which is not a function");
          var c = Fc(b.name || "unknownFunctionName", function() {});
          c.prototype = b.prototype;
          c = new c;
          a = b.apply(c, a);
          return a instanceof Object ? a : c
      }
      function Rc(a) {
          for (; a.length; ) {
              var b = a.pop();
              a.pop()(b)
          }
      }
      function Sc(a, b) {
          var c = h;
          if (void 0 === c[a].Fe) {
              var d = c[a];
              c[a] = function() {
                  c[a].Fe.hasOwnProperty(arguments.length) || N("Function '" + b + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + c[a].Fe + ")!");
                  return c[a].Fe[arguments.length].apply(this, arguments)
              }
              ;
              c[a].Fe = [];
              c[a].Fe[d.Ff] = d
          }
      }
      function Tc(a, b, c) {
          h.hasOwnProperty(a) ? ((void 0 === c || void 0 !== h[a].Fe && void 0 !== h[a].Fe[c]) && N("Cannot register public name '" + a + "' twice"),
          Sc(a, a),
          h.hasOwnProperty(c) && N("Cannot register multiple overloads of a function with the same number of arguments (" + c + ")!"),
          h[a].Fe[c] = b) : (h[a] = b,
          void 0 !== c && (h[a].pg = c))
      }
      function Uc(a, b) {
          for (var c = [], d = 0; d < a; d++)
              c.push(C[(b >> 2) + d >>> 0]);
          return c
      }
      function Vc(a, b) {
          var c = [];
          return function() {
              c.length = arguments.length;
              for (var d = 0; d < arguments.length; d++)
                  c[d] = arguments[d];
              a.includes("j") ? (d = h["dynCall_" + a],
              d = c && c.length ? d.apply(null, [b].concat(c)) : d.call(null, b)) : d = H(b).apply(null, c);
              return d
          }
      }
      function Wc(a, b) {
          a = M(a);
          var c = a.includes("j") ? Vc(a, b) : H(b);
          "function" !== typeof c && N("unknown function pointer with signature " + a + ": " + b);
          return c
      }
      var Xc = void 0;
      function Yc(a) {
          a = Zc(a);
          var b = M(a);
          $c(a);
          return b
      }
      function ad(a, b) {
          function c(f) {
              e[f] || Cc[f] || (Dc[f] ? Dc[f].forEach(c) : (d.push(f),
              e[f] = !0))
          }
          var d = []
            , e = {};
          b.forEach(c);
          throw new Xc(a + ": " + d.map(Yc).join([", "]));
      }
      function bd(a, b, c) {
          switch (b) {
          case 0:
              return c ? function(d) {
                  return w[d >>> 0]
              }
              : function(d) {
                  return r[d >>> 0]
              }
              ;
          case 1:
              return c ? function(d) {
                  return Ka[d >>> 1]
              }
              : function(d) {
                  return Ja[d >>> 1]
              }
              ;
          case 2:
              return c ? function(d) {
                  return C[d >>> 2]
              }
              : function(d) {
                  return D[d >>> 2]
              }
              ;
          default:
              throw new TypeError("Unknown integer type: " + a);
          }
      }
      function cd(a, b) {
          var c = Cc[a];
          void 0 === c && N(b + " has unknown type " + Yc(a));
          return c
      }
      var dd = {};
      function ed(a) {
          var b = dd[a];
          return void 0 === b ? M(a) : b
      }
      var fd = [];
      function gd() {
          return "object" === typeof globalThis ? globalThis : Function("return this")()
      }
      function hd(a) {
          var b = fd.length;
          fd.push(a);
          return b
      }
      function jd(a, b) {
          for (var c = Array(a), d = 0; d < a; ++d)
              c[d] = cd(C[(b >> 2) + d >>> 0], "parameter " + d);
          return c
      }
      var kd = [];
      function ld() {
          void 0 === ld.start && (ld.start = Date.now());
          return 1E3 * (Date.now() - ld.start) | 0
      }
      var md;
      md = ka ? function() {
          var a = process.hrtime();
          return 1E3 * a[0] + a[1] / 1E6
      }
      : function() {
          return performance.now()
      }
      ;
      var nd = [];
      function od(a) {
          var b = a.getExtension("ANGLE_instanced_arrays");
          b && (a.vertexAttribDivisor = function(c, d) {
              b.vertexAttribDivisorANGLE(c, d)
          }
          ,
          a.drawArraysInstanced = function(c, d, e, f) {
              b.drawArraysInstancedANGLE(c, d, e, f)
          }
          ,
          a.drawElementsInstanced = function(c, d, e, f, g) {
              b.drawElementsInstancedANGLE(c, d, e, f, g)
          }
          )
      }
      function pd(a) {
          var b = a.getExtension("OES_vertex_array_object");
          b && (a.createVertexArray = function() {
              return b.createVertexArrayOES()
          }
          ,
          a.deleteVertexArray = function(c) {
              b.deleteVertexArrayOES(c)
          }
          ,
          a.bindVertexArray = function(c) {
              b.bindVertexArrayOES(c)
          }
          ,
          a.isVertexArray = function(c) {
              return b.isVertexArrayOES(c)
          }
          )
      }
      function qd(a) {
          var b = a.getExtension("WEBGL_draw_buffers");
          b && (a.drawBuffers = function(c, d) {
              b.drawBuffersWEBGL(c, d)
          }
          )
      }
      function rd(a) {
          a.rf = a.getExtension("WEBGL_draw_instanced_base_vertex_base_instance")
      }
      function sd(a) {
          a.Af = a.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance")
      }
      function td(a) {
          a.og = a.getExtension("WEBGL_multi_draw")
      }
      var ud = 1
        , vd = []
        , S = []
        , wd = []
        , xd = []
        , yd = []
        , T = []
        , zd = []
        , Ad = []
        , Bd = []
        , Cd = []
        , Dd = {}
        , Ed = {}
        , Fd = 4;
      function U(a) {
          Gd || (Gd = a)
      }
      function Hd(a) {
          for (var b = ud++, c = a.length; c < b; c++)
              a[c] = null;
          return b
      }
      function Id(a, b) {
          a.wf || (a.wf = a.getContext,
          a.getContext = function(d, e) {
              e = a.wf(d, e);
              return "webgl" == d == e instanceof WebGLRenderingContext ? e : null
          }
          );
          var c = 1 < b.zf ? a.getContext("webgl2", b) : a.getContext("webgl", b);
          return c ? Jd(c, b) : 0
      }
      function Jd(a, b) {
          var c = Hd(Ad)
            , d = {
              Kf: c,
              attributes: b,
              version: b.zf,
              Le: a
          };
          a.canvas && (a.canvas.Ef = d);
          Ad[c] = d;
          ("undefined" === typeof b.tf || b.tf) && Kd(d);
          return c
      }
      function Kd(a) {
          a || (a = V);
          if (!a.Nf) {
              a.Nf = !0;
              var b = a.Le;
              od(b);
              pd(b);
              qd(b);
              rd(b);
              sd(b);
              2 <= a.version && (b.sf = b.getExtension("EXT_disjoint_timer_query_webgl2"));
              if (2 > a.version || !b.sf)
                  b.sf = b.getExtension("EXT_disjoint_timer_query");
              td(b);
              (b.getSupportedExtensions() || []).forEach(function(c) {
                  c.includes("lose_context") || c.includes("debug") || b.getExtension(c)
              })
          }
      }
      var Gd, V, Ld = [];
      function Md(a, b, c, d) {
          for (var e = 0; e < a; e++) {
              var f = W[c]()
                , g = f && Hd(d);
              f ? (f.name = g,
              d[g] = f) : U(1282);
              C[b + 4 * e >> 2 >>> 0] = g
          }
      }
      function Nd(a, b, c) {
          if (b) {
              var d = void 0;
              switch (a) {
              case 36346:
                  d = 1;
                  break;
              case 36344:
                  0 != c && 1 != c && U(1280);
                  return;
              case 34814:
              case 36345:
                  d = 0;
                  break;
              case 34466:
                  var e = W.getParameter(34467);
                  d = e ? e.length : 0;
                  break;
              case 33309:
                  if (2 > V.version) {
                      U(1282);
                      return
                  }
                  d = 2 * (W.getSupportedExtensions() || []).length;
                  break;
              case 33307:
              case 33308:
                  if (2 > V.version) {
                      U(1280);
                      return
                  }
                  d = 33307 == a ? 3 : 0
              }
              if (void 0 === d)
                  switch (e = W.getParameter(a),
                  typeof e) {
                  case "number":
                      d = e;
                      break;
                  case "boolean":
                      d = e ? 1 : 0;
                      break;
                  case "string":
                      U(1280);
                      return;
                  case "object":
                      if (null === e)
                          switch (a) {
                          case 34964:
                          case 35725:
                          case 34965:
                          case 36006:
                          case 36007:
                          case 32873:
                          case 34229:
                          case 36662:
                          case 36663:
                          case 35053:
                          case 35055:
                          case 36010:
                          case 35097:
                          case 35869:
                          case 32874:
                          case 36389:
                          case 35983:
                          case 35368:
                          case 34068:
                              d = 0;
                              break;
                          default:
                              U(1280);
                              return
                          }
                      else {
                          if (e instanceof Float32Array || e instanceof Uint32Array || e instanceof Int32Array || e instanceof Array) {
                              for (a = 0; a < e.length; ++a)
                                  switch (c) {
                                  case 0:
                                      C[b + 4 * a >> 2 >>> 0] = e[a];
                                      break;
                                  case 2:
                                      E[b + 4 * a >> 2 >>> 0] = e[a];
                                      break;
                                  case 4:
                                      w[b + a >> 0 >>> 0] = e[a] ? 1 : 0
                                  }
                              return
                          }
                          try {
                              d = e.name | 0
                          } catch (f) {
                              U(1280);
                              m("GL_INVALID_ENUM in glGet" + c + "v: Unknown object returned from WebGL getParameter(" + a + ")! (error: " + f + ")");
                              return
                          }
                      }
                      break;
                  default:
                      U(1280);
                      m("GL_INVALID_ENUM in glGet" + c + "v: Native code calling glGet" + c + "v(" + a + ") and it returns " + e + " of type " + typeof e + "!");
                      return
                  }
              switch (c) {
              case 1:
                  c = d;
                  D[b >>> 2] = c;
                  D[b + 4 >>> 2] = (c - D[b >>> 2]) / 4294967296;
                  break;
              case 0:
                  C[b >> 2 >>> 0] = d;
                  break;
              case 2:
                  E[b >> 2 >>> 0] = d;
                  break;
              case 4:
                  w[b >> 0 >>> 0] = d ? 1 : 0
              }
          } else
              U(1281)
      }
      function Od(a) {
          var b = Fa(a) + 1
            , c = Ra(b);
          Ca(a, r, c, b);
          return c
      }
      function Pd(a) {
          return "]" == a.slice(-1) && a.lastIndexOf("[")
      }
      function Qd(a, b, c, d) {
          if (c)
              if (a = W.getVertexAttrib(a, b),
              34975 == b)
                  C[c >> 2 >>> 0] = a && a.name;
              else if ("number" == typeof a || "boolean" == typeof a)
                  switch (d) {
                  case 0:
                      C[c >> 2 >>> 0] = a;
                      break;
                  case 2:
                      E[c >> 2 >>> 0] = a;
                      break;
                  case 5:
                      C[c >> 2 >>> 0] = Math.fround(a)
                  }
              else
                  for (b = 0; b < a.length; b++)
                      switch (d) {
                      case 0:
                          C[c + 4 * b >> 2 >>> 0] = a[b];
                          break;
                      case 2:
                          E[c + 4 * b >> 2 >>> 0] = a[b];
                          break;
                      case 5:
                          C[c + 4 * b >> 2 >>> 0] = Math.fround(a[b])
                      }
          else
              U(1281)
      }
      function Rd(a) {
          a -= 5120;
          return 0 == a ? w : 1 == a ? r : 2 == a ? Ka : 4 == a ? C : 6 == a ? E : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a ? D : Ja
      }
      function Sd(a, b, c, d, e) {
          a = Rd(a);
          var f = 31 - Math.clz32(a.BYTES_PER_ELEMENT)
            , g = Fd;
          return a.subarray(e >>> f, e + d * (c * ({
              5: 3,
              6: 4,
              8: 2,
              29502: 3,
              29504: 4,
              26917: 2,
              26918: 2,
              29846: 3,
              29847: 4
          }[b - 6402] || 1) * (1 << f) + g - 1 & -g) >>> f)
      }
      function Td(a, b, c, d, e, f, g, l, n) {
          if (2 <= V.version)
              if (W.Me)
                  W.texImage2D(a, b, c, d, e, f, g, l, n);
              else if (n) {
                  var q = Rd(l);
                  W.texImage2D(a, b, c, d, e, f, g, l, q, n >> 31 - Math.clz32(q.BYTES_PER_ELEMENT))
              } else
                  W.texImage2D(a, b, c, d, e, f, g, l, null);
          else
              W.texImage2D(a, b, c, d, e, f, g, l, n ? Sd(l, g, d, e, n) : null)
      }
      function Ud(a, b, c, d, e, f, g, l, n) {
          if (2 <= V.version)
              if (W.Me)
                  W.texSubImage2D(a, b, c, d, e, f, g, l, n);
              else if (n) {
                  var q = Rd(l);
                  W.texSubImage2D(a, b, c, d, e, f, g, l, q, n >> 31 - Math.clz32(q.BYTES_PER_ELEMENT))
              } else
                  W.texSubImage2D(a, b, c, d, e, f, g, l, null);
          else
              q = null,
              n && (q = Sd(l, g, e, f, n)),
              W.texSubImage2D(a, b, c, d, e, f, g, l, q)
      }
      function X(a) {
          var b = W.Hf;
          if (b) {
              var c = b.Re[a];
              "number" === typeof c && (b.Re[a] = c = W.getUniformLocation(b, b.Cf[a] + (0 < c ? "[" + c + "]" : "")));
              return c
          }
          U(1282)
      }
      var Vd = []
        , Wd = []
        , Xd = 0;
      function Yd() {
          for (var a = Zd.length - 1; 0 <= a; --a)
              $d(a);
          Zd = [];
          ae = []
      }
      var ae = [];
      function be() {
          if (Xd && ce.hg)
              for (var a = 0; a < ae.length; ++a) {
                  var b = ae[a];
                  ae.splice(a, 1);
                  --a;
                  b.tg.apply(null, b.ig)
              }
      }
      var Zd = [];
      function $d(a) {
          var b = Zd[a];
          b.target.removeEventListener(b.Pe, b.If, b.lf);
          Zd.splice(a, 1)
      }
      function de(a) {
          function b(d) {
              ++Xd;
              ce = a;
              be();
              a.yf(d);
              be();
              --Xd
          }
          if (a.pf)
              a.If = b,
              a.target.addEventListener(a.Pe, b, a.lf),
              Zd.push(a),
              ee || (Za.push(Yd),
              ee = !0);
          else
              for (var c = 0; c < Zd.length; ++c)
                  Zd[c].target == a.target && Zd[c].Pe == a.Pe && $d(c--)
      }
      var fe = {}, ee, ce, ge = [0, "undefined" !== typeof document ? document : 0, "undefined" !== typeof window ? window : 0];
      function he(a) {
          a = 2 < a ? B(a) : a;
          return ge[a] || ("undefined" !== typeof document ? document.querySelector(a) : void 0)
      }
      function ie(a, b) {
          var c = {
              target: he(2),
              Pe: "beforeunload",
              pf: b,
              yf: function(d) {
                  d = d || event;
                  var e = H(b)(28, 0, a);
                  e && (e = B(e));
                  if (e)
                      return d.preventDefault(),
                      d.returnValue = e
              },
              lf: !0
          };
          de(c)
      }
      function je(a, b, c, d, e, f) {
          a = {
              target: he(a),
              Pe: f,
              pf: d,
              yf: function(g) {
                  g = g || event;
                  H(d)(e, 0, b) && g.preventDefault()
              },
              lf: c
          };
          de(a)
      }
      var ke = ["default", "low-power", "high-performance"];
      h._emscripten_webgl_get_current_context = function() {
          return V ? V.Kf : 0
      }
      ;
      function le(a) {
          V = Ad[a];
          h.jg = W = V && V.Le;
          return !a || W ? 0 : -5
      }
      h._emscripten_webgl_make_context_current = le;
      var me = {};
      function ne() {
          if (!oe) {
              var a = {
                  USER: "web_user",
                  LOGNAME: "web_user",
                  PATH: "/",
                  PWD: "/",
                  HOME: "/home/web_user",
                  LANG: ("object" === typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
                  _: fa || "./this.program"
              }, b;
              for (b in me)
                  void 0 === me[b] ? delete a[b] : a[b] = me[b];
              var c = [];
              for (b in a)
                  c.push(b + "=" + a[b]);
              oe = c
          }
          return oe
      }
      var oe;
      function pe() {}
      function qe(a, b) {
          a = new Date(1E3 * C[a >> 2 >>> 0]);
          C[b >> 2 >>> 0] = a.getUTCSeconds();
          C[b + 4 >> 2 >>> 0] = a.getUTCMinutes();
          C[b + 8 >> 2 >>> 0] = a.getUTCHours();
          C[b + 12 >> 2 >>> 0] = a.getUTCDate();
          C[b + 16 >> 2 >>> 0] = a.getUTCMonth();
          C[b + 20 >> 2 >>> 0] = a.getUTCFullYear() - 1900;
          C[b + 24 >> 2 >>> 0] = a.getUTCDay();
          C[b + 36 >> 2 >>> 0] = 0;
          C[b + 32 >> 2 >>> 0] = 0;
          C[b + 28 >> 2 >>> 0] = (a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864E5 | 0;
          qe.mf || (qe.mf = Qa("GMT"));
          C[b + 40 >> 2 >>> 0] = qe.mf;
          return b
      }
      function re(a) {
          return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400)
      }
      function se(a, b) {
          for (var c = 0, d = 0; d <= b; c += a[d++])
              ;
          return c
      }
      var te = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        , ue = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      function ve(a, b) {
          for (a = new Date(a.getTime()); 0 < b; ) {
              var c = a.getMonth()
                , d = (re(a.getFullYear()) ? te : ue)[c];
              if (b > d - a.getDate())
                  b -= d - a.getDate() + 1,
                  a.setDate(1),
                  11 > c ? a.setMonth(c + 1) : (a.setMonth(0),
                  a.setFullYear(a.getFullYear() + 1));
              else {
                  a.setDate(a.getDate() + b);
                  break
              }
          }
          return a
      }
      function we(a, b, c, d) {
          function e(p, u, A) {
              for (p = "number" === typeof p ? p.toString() : p || ""; p.length < u; )
                  p = A[0] + p;
              return p
          }
          function f(p, u) {
              return e(p, u, "0")
          }
          function g(p, u) {
              function A(P) {
                  return 0 > P ? -1 : 0 < P ? 1 : 0
              }
              var I;
              0 === (I = A(p.getFullYear() - u.getFullYear())) && 0 === (I = A(p.getMonth() - u.getMonth())) && (I = A(p.getDate() - u.getDate()));
              return I
          }
          function l(p) {
              switch (p.getDay()) {
              case 0:
                  return new Date(p.getFullYear() - 1,11,29);
              case 1:
                  return p;
              case 2:
                  return new Date(p.getFullYear(),0,3);
              case 3:
                  return new Date(p.getFullYear(),0,2);
              case 4:
                  return new Date(p.getFullYear(),0,1);
              case 5:
                  return new Date(p.getFullYear() - 1,11,31);
              case 6:
                  return new Date(p.getFullYear() - 1,11,30)
              }
          }
          function n(p) {
              p = ve(new Date(p.Ce + 1900,0,1), p.af);
              var u = new Date(p.getFullYear() + 1,0,4)
                , A = l(new Date(p.getFullYear(),0,4));
              u = l(u);
              return 0 >= g(A, p) ? 0 >= g(u, p) ? p.getFullYear() + 1 : p.getFullYear() : p.getFullYear() - 1
          }
          var q = C[d + 40 >> 2 >>> 0];
          d = {
              eg: C[d >> 2 >>> 0],
              dg: C[d + 4 >> 2 >>> 0],
              Ze: C[d + 8 >> 2 >>> 0],
              Qe: C[d + 12 >> 2 >>> 0],
              Oe: C[d + 16 >> 2 >>> 0],
              Ce: C[d + 20 >> 2 >>> 0],
              $e: C[d + 24 >> 2 >>> 0],
              af: C[d + 28 >> 2 >>> 0],
              ug: C[d + 32 >> 2 >>> 0],
              cg: C[d + 36 >> 2 >>> 0],
              fg: q ? B(q) : ""
          };
          c = B(c);
          q = {
              "%c": "%a %b %d %H:%M:%S %Y",
              "%D": "%m/%d/%y",
              "%F": "%Y-%m-%d",
              "%h": "%b",
              "%r": "%I:%M:%S %p",
              "%R": "%H:%M",
              "%T": "%H:%M:%S",
              "%x": "%m/%d/%y",
              "%X": "%H:%M:%S",
              "%Ec": "%c",
              "%EC": "%C",
              "%Ex": "%m/%d/%y",
              "%EX": "%H:%M:%S",
              "%Ey": "%y",
              "%EY": "%Y",
              "%Od": "%d",
              "%Oe": "%e",
              "%OH": "%H",
              "%OI": "%I",
              "%Om": "%m",
              "%OM": "%M",
              "%OS": "%S",
              "%Ou": "%u",
              "%OU": "%U",
              "%OV": "%V",
              "%Ow": "%w",
              "%OW": "%W",
              "%Oy": "%y"
          };
          for (var t in q)
              c = c.replace(new RegExp(t,"g"), q[t]);
          var v = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ")
            , z = "January February March April May June July August September October November December".split(" ");
          q = {
              "%a": function(p) {
                  return v[p.$e].substring(0, 3)
              },
              "%A": function(p) {
                  return v[p.$e]
              },
              "%b": function(p) {
                  return z[p.Oe].substring(0, 3)
              },
              "%B": function(p) {
                  return z[p.Oe]
              },
              "%C": function(p) {
                  return f((p.Ce + 1900) / 100 | 0, 2)
              },
              "%d": function(p) {
                  return f(p.Qe, 2)
              },
              "%e": function(p) {
                  return e(p.Qe, 2, " ")
              },
              "%g": function(p) {
                  return n(p).toString().substring(2)
              },
              "%G": function(p) {
                  return n(p)
              },
              "%H": function(p) {
                  return f(p.Ze, 2)
              },
              "%I": function(p) {
                  p = p.Ze;
                  0 == p ? p = 12 : 12 < p && (p -= 12);
                  return f(p, 2)
              },
              "%j": function(p) {
                  return f(p.Qe + se(re(p.Ce + 1900) ? te : ue, p.Oe - 1), 3)
              },
              "%m": function(p) {
                  return f(p.Oe + 1, 2)
              },
              "%M": function(p) {
                  return f(p.dg, 2)
              },
              "%n": function() {
                  return "\n"
              },
              "%p": function(p) {
                  return 0 <= p.Ze && 12 > p.Ze ? "AM" : "PM"
              },
              "%S": function(p) {
                  return f(p.eg, 2)
              },
              "%t": function() {
                  return "\t"
              },
              "%u": function(p) {
                  return p.$e || 7
              },
              "%U": function(p) {
                  var u = new Date(p.Ce + 1900,0,1)
                    , A = 0 === u.getDay() ? u : ve(u, 7 - u.getDay());
                  p = new Date(p.Ce + 1900,p.Oe,p.Qe);
                  return 0 > g(A, p) ? f(Math.ceil((31 - A.getDate() + (se(re(p.getFullYear()) ? te : ue, p.getMonth() - 1) - 31) + p.getDate()) / 7), 2) : 0 === g(A, u) ? "01" : "00"
              },
              "%V": function(p) {
                  var u = new Date(p.Ce + 1901,0,4)
                    , A = l(new Date(p.Ce + 1900,0,4));
                  u = l(u);
                  var I = ve(new Date(p.Ce + 1900,0,1), p.af);
                  return 0 > g(I, A) ? "53" : 0 >= g(u, I) ? "01" : f(Math.ceil((A.getFullYear() < p.Ce + 1900 ? p.af + 32 - A.getDate() : p.af + 1 - A.getDate()) / 7), 2)
              },
              "%w": function(p) {
                  return p.$e
              },
              "%W": function(p) {
                  var u = new Date(p.Ce,0,1)
                    , A = 1 === u.getDay() ? u : ve(u, 0 === u.getDay() ? 1 : 7 - u.getDay() + 1);
                  p = new Date(p.Ce + 1900,p.Oe,p.Qe);
                  return 0 > g(A, p) ? f(Math.ceil((31 - A.getDate() + (se(re(p.getFullYear()) ? te : ue, p.getMonth() - 1) - 31) + p.getDate()) / 7), 2) : 0 === g(A, u) ? "01" : "00"
              },
              "%y": function(p) {
                  return (p.Ce + 1900).toString().substring(2)
              },
              "%Y": function(p) {
                  return p.Ce + 1900
              },
              "%z": function(p) {
                  p = p.cg;
                  var u = 0 <= p;
                  p = Math.abs(p) / 60;
                  return (u ? "+" : "-") + String("0000" + (p / 60 * 100 + p % 60)).slice(-4)
              },
              "%Z": function(p) {
                  return p.fg
              },
              "%%": function() {
                  return "%"
              }
          };
          for (t in q)
              c.includes(t) && (c = c.replace(new RegExp(t,"g"), q[t](d)));
          t = Db(c, !1);
          if (t.length > b)
              return 0;
          w.set(t, a >>> 0);
          return t.length - 1
      }
      function Xb(a, b, c, d) {
          a || (a = this);
          this.parent = a;
          this.He = a.He;
          this.Xe = null;
          this.id = Pb++;
          this.name = b;
          this.mode = c;
          this.xe = {};
          this.ye = {};
          this.rdev = d
      }
      Object.defineProperties(Xb.prototype, {
          read: {
              get: function() {
                  return 365 === (this.mode & 365)
              },
              set: function(a) {
                  a ? this.mode |= 365 : this.mode &= -366
              }
          },
          write: {
              get: function() {
                  return 146 === (this.mode & 146)
              },
              set: function(a) {
                  a ? this.mode |= 146 : this.mode &= -147
              }
          }
      });
      oc();
      Qb = Array(4096);
      dc(K, "/");
      fc("/tmp");
      fc("/home");
      fc("/home/web_user");
      (function() {
          fc("/dev");
          Bb(259, {
              read: function() {
                  return 0
              },
              write: function(b, c, d, e) {
                  return e
              }
          });
          gc("/dev/null", 259);
          Ab(1280, Eb);
          Ab(1536, Fb);
          gc("/dev/tty", 1280);
          gc("/dev/tty1", 1536);
          var a = xb();
          rc("random", a);
          rc("urandom", a);
          fc("/dev/shm");
          fc("/dev/shm/tmp")
      }
      )();
      (function() {
          fc("/proc");
          var a = fc("/proc/self");
          fc("/proc/self/fd");
          dc({
              He: function() {
                  var b = Jb(a, "fd", 16895, 73);
                  b.xe = {
                      lookup: function(c, d) {
                          var e = Ob[+d];
                          if (!e)
                              throw new J(8);
                          c = {
                              parent: null,
                              He: {
                                  Bf: "fake"
                              },
                              xe: {
                                  readlink: function() {
                                      return e.path
                                  }
                              }
                          };
                          return c.parent = c
                      }
                  };
                  return b
              }
          }, "/proc/self/fd")
      }
      )();
      for (var xe = Array(256), ye = 0; 256 > ye; ++ye)
          xe[ye] = String.fromCharCode(ye);
      Ac = xe;
      Hc = h.BindingError = Gc("BindingError");
      Ic = h.InternalError = Gc("InternalError");
      h.count_emval_handles = function() {
          for (var a = 0, b = 5; b < O.length; ++b)
              void 0 !== O[b] && ++a;
          return a
      }
      ;
      h.get_first_emval = function() {
          for (var a = 5; a < O.length; ++a)
              if (void 0 !== O[a])
                  return O[a];
          return null
      }
      ;
      Xc = h.UnboundTypeError = Gc("UnboundTypeError");
      for (var W, Y = 0; 32 > Y; ++Y)
          Ld.push(Array(Y));
      var ze = new Float32Array(288);
      for (Y = 0; 288 > Y; ++Y)
          Vd[Y] = ze.subarray(0, Y + 1);
      var Ae = new Int32Array(288);
      for (Y = 0; 288 > Y; ++Y)
          Wd[Y] = Ae.subarray(0, Y + 1);
      (function() {
          function a(q) {
              Array.isArray(h.logs) && h.logs.push({
                  level: 4,
                  file: "sourceLibrary.js",
                  functionName: "logError",
                  ng: q,
                  timestamp: Date.now() / 1E3
              })
          }
          function b(q) {
              q = D[(q >>> 0) + 8 >> 2 >>> 0];
              return e[q] ? q : (a("webgl image cache: no image data"),
              null)
          }
          function c(q) {
              q >>>= 0;
              return 72 === r[q >>> 0] && 65 === r[q + 1 >>> 0] && 78 === r[q + 2 >>> 0] && 68 === r[q + 3 >>> 0] && 76 === r[q + 4 >>> 0] && 69 === r[q + 5 >>> 0]
          }
          var d = 0
            , e = {};
          h.fdLoadImage = function(q, t, v, z) {
              d++;
              e[d] = {
                  url: q,
                  data: t,
                  width: v,
                  height: z
              };
              return d
          }
          ;
          var f = Ud
            , g = Td;
          Ud = function(q, t, v, z, p, u, A, I, P) {
              if (c(P)) {
                  var da = b(P);
                  if (da)
                      W.texSubImage2D(q, t, v, z, p, u, A, I, e[da].data),
                      delete e[da];
                  else
                      try {
                          var Aa = (new Uint32Array(p * u)).fill(255);
                          Aa = new Uint8Array(Aa.buffer);
                          W.texSubImage2D(q, t, v, z, p, u, W.RGBA, W.UNSIGNED_BYTE, Aa)
                      } catch (lc) {
                          a("draw black texture failed: " + lc.message)
                      }
              } else
                  f.apply(null, arguments)
          }
          ;
          Td = function(q, t, v, z, p, u, A, I, P) {
              if (c(P)) {
                  var da = b(P);
                  if (da)
                      W.texImage2D(q, t, v, z, p, u, A, I, e[da].data),
                      delete e[da];
                  else
                      try {
                          var Aa = (new Uint32Array(z * p)).fill(255);
                          Aa = new Uint8Array(Aa.buffer);
                          W.texImage2D(q, t, W.RGBA, z, p, u, W.RGBA, W.UNSIGNED_BYTE, Aa)
                      } catch (lc) {
                          a("draw black texture failed: " + lc.message)
                      }
              } else
                  g.apply(null, arguments)
          }
          ;
          const l = document.createElement("canvas");
          l.width = 60;
          l.height = 60;
          const n = l.getContext("2d", {
              wg: !0
          });
          pe = function(q, t, v, z) {
              n.save();
              q >>>= 0;
              t >>>= 0;
              v >>>= 0;
              z >>>= 0;
              n.save();
              n.setTransform(1, 0, 0, 1, 0, 0);
              n.clearRect(0, 0, l.width, l.height);
              n.beginPath();
              n.restore();
              q = B(q);
              n.scale(1, 1);
              n.font = B(t);
              var p = n.measureText(q);
              const u = p.fontBoundingBoxAscent || p.actualBoundingBoxAscent
                , A = Math.round(u);
              t = Math.ceil(p.width);
              p = Math.ceil(u + (p.fontBoundingBoxDescent || p.actualBoundingBoxDescent));
              t = Math.max(t, 2);
              p = Math.max(p, 6);
              D[v >>> 2] = t;
              D[(v >> 2) + 1 >>> 0 >>> 0] = p;
              D[(v >> 2) + 2 >>> 0 >>> 0] = A;
              D[(v >> 2) + 3 >>> 0 >>> 0] = 1;
              n.fillStyle = "black";
              n.fillText(q, 0, A);
              v = n.getImageData(0, 0, t, p);
              q = Ra(t * p * 4);
              r.set(v.data, q >>> 0 >>> 0);
              D[z >>> 2] = q;
              n.restore()
          }
      }
      )();
      function Db(a, b) {
          var c = Array(Fa(a) + 1);
          a = Ca(a, c, 0, c.length);
          b && (c.length = a);
          return c
      }
      var Se = {
          H: function(a, b, c) {
              a = Q(a);
              b >>>= 0;
              for (var d = a instanceof Array, e = 0; e < c; e++) {
                  var f = r[b >>> 0]
                    , g = !!r[b + 1 >>> 0]
                    , l = D[(b >> 2) + 1 >>> 0];
                  b += 8;
                  var n = !1;
                  switch (f) {
                  case 1:
                      var q = C[b >> 2 >>> 0];
                      break;
                  case 2:
                      q = D[b >> 2 >>> 0];
                      break;
                  case 3:
                      q = E[b >> 2 >>> 0];
                      break;
                  case 4:
                      q = Ta[b >> 3 >>> 0];
                      break;
                  case 5:
                      q = !!r[b >>> 0];
                      break;
                  case 6:
                      q = M(D[b >> 2 >>> 0]);
                      break;
                  case 7:
                      q = B(D[b >> 2 >>> 0]);
                      break;
                  case 8:
                      q = Q(C[b >> 2 >>> 0]);
                      break;
                  case 9:
                      f = D[b >> 2 >>> 0];
                      var t = r[b + 4 >>> 0]
                        , v = !!r[b + 5 >>> 0]
                        , z = Ja[(b >> 1) + 3 >>> 0];
                      switch (t) {
                      case 1:
                          f >>= 2;
                          var p = C;
                          break;
                      case 2:
                          f >>= 2;
                          p = D;
                          break;
                      case 3:
                          f >>= 2;
                          p = E;
                          break;
                      case 4:
                          f >>= 3;
                          p = Ta;
                          break;
                      case 5:
                          p = r;
                          break;
                      default:
                          n = !0
                      }
                      if (!n) {
                          q = [];
                          if (5 == t)
                              for (t = 0; t < z; t++)
                                  q[t] = !!p[f + t >>> 0];
                          else
                              for (t = 0; t < z; t++)
                                  q[t] = p[f + t >>> 0];
                          v && (a.push(...q),
                          n = !0)
                      }
                      break;
                  default:
                      n = !0
                  }
                  b += 8;
                  n || (d ? a.push(q) : (l = g ? Q(l) : M(l),
                  a[l] = q))
              }
          },
          C: function(a) {
              return Ra(a + 16) + 16
          },
          D: function(a, b, c) {
              (new mb(a)).Mf(b, c);
              nb++;
              throw a;
          },
          Hd: function(a, b) {
              sb || (sb = !0,
              ob());
              a = new Date(1E3 * C[a >> 2 >>> 0]);
              C[b >> 2 >>> 0] = a.getSeconds();
              C[b + 4 >> 2 >>> 0] = a.getMinutes();
              C[b + 8 >> 2 >>> 0] = a.getHours();
              C[b + 12 >> 2 >>> 0] = a.getDate();
              C[b + 16 >> 2 >>> 0] = a.getMonth();
              C[b + 20 >> 2 >>> 0] = a.getFullYear() - 1900;
              C[b + 24 >> 2 >>> 0] = a.getDay();
              var c = new Date(a.getFullYear(),0,1);
              C[b + 28 >> 2 >>> 0] = (a.getTime() - c.getTime()) / 864E5 | 0;
              C[b + 36 >> 2 >>> 0] = -(60 * a.getTimezoneOffset());
              var d = (new Date(a.getFullYear(),6,1)).getTimezoneOffset();
              c = c.getTimezoneOffset();
              a = (d != c && a.getTimezoneOffset() == Math.min(c, d)) | 0;
              C[b + 32 >> 2 >>> 0] = a;
              a = C[rb() + (a ? 4 : 0) >> 2 >>> 0];
              C[b + 40 >> 2 >>> 0] = a;
              return b
          },
          $: function(a, b, c) {
              wc = c;
              try {
                  var d = yc(a);
                  switch (b) {
                  case 0:
                      var e = xc();
                      return 0 > e ? -28 : kc(d.path, d.flags, 0, e).fd;
                  case 1:
                  case 2:
                      return 0;
                  case 3:
                      return d.flags;
                  case 4:
                      return e = xc(),
                      d.flags |= e,
                      0;
                  case 5:
                      return e = xc(),
                      Ka[e + 0 >> 1 >>> 0] = 2,
                      0;
                  case 6:
                  case 7:
                      return 0;
                  case 16:
                  case 8:
                      return -28;
                  case 9:
                      return C[Be() >> 2 >>> 0] = 28,
                      -1;
                  default:
                      return -28
                  }
              } catch (f) {
                  if ("undefined" === typeof L || !(f instanceof J))
                      throw f;
                  return -f.Be
              }
          },
          Gd: function(a, b) {
              try {
                  var c = yc(a);
                  return uc(ic, c.path, b)
              } catch (d) {
                  if ("undefined" === typeof L || !(d instanceof J))
                      throw d;
                  return -d.Be
              }
          },
          Fd: function(a, b, c, d) {
              try {
                  b = B(b);
                  var e = d & 256;
                  d &= 4096;
                  var f = b;
                  if ("/" === f[0])
                      b = f;
                  else {
                      if (-100 === a)
                          var g = "/";
                      else {
                          var l = Ob[a];
                          if (!l)
                              throw new J(8);
                          g = l.path
                      }
                      if (0 == f.length) {
                          if (!d)
                              throw new J(44);
                          b = g
                      } else
                          b = ub(g + "/" + f)
                  }
                  return uc(e ? jc : ic, b, c)
              } catch (n) {
                  if ("undefined" === typeof L || !(n instanceof J))
                      throw n;
                  return -n.Be
              }
          },
          Ed: function(a, b, c) {
              wc = c;
              try {
                  var d = yc(a);
                  switch (b) {
                  case 21509:
                  case 21505:
                      return d.tty ? 0 : -59;
                  case 21510:
                  case 21511:
                  case 21512:
                  case 21506:
                  case 21507:
                  case 21508:
                      return d.tty ? 0 : -59;
                  case 21519:
                      if (!d.tty)
                          return -59;
                      var e = xc();
                      return C[e >> 2 >>> 0] = 0;
                  case 21520:
                      return d.tty ? -28 : -59;
                  case 21531:
                      a = e = xc();
                      if (!d.ye.Of)
                          throw new J(59);
                      return d.ye.Of(d, b, a);
                  case 21523:
                      return d.tty ? 0 : -59;
                  case 21524:
                      return d.tty ? 0 : -59;
                  default:
                      qa("bad ioctl syscall " + b)
                  }
              } catch (f) {
                  if ("undefined" === typeof L || !(f instanceof J))
                      throw f;
                  return -f.Be
              }
          },
          Dd: function(a, b, c, d, e, f) {
              try {
                  a: {
                      f <<= 12;
                      var g = !1;
                      if (0 !== (d & 16) && 0 !== a % 65536)
                          var l = -28;
                      else {
                          if (0 !== (d & 32)) {
                              var n = Gb(b);
                              if (!n) {
                                  l = -48;
                                  break a
                              }
                              g = !0
                          } else {
                              var q = Ob[e];
                              if (!q) {
                                  l = -8;
                                  break a
                              }
                              var t = f;
                              a >>>= 0;
                              if (0 !== (c & 2) && 0 === (d & 2) && 2 !== (q.flags & 2097155))
                                  throw new J(2);
                              if (1 === (q.flags & 2097155))
                                  throw new J(2);
                              if (!q.ye.We)
                                  throw new J(43);
                              var v = q.ye.We(q, a, b, t, c, d);
                              n = v.Ke;
                              g = v.bf
                          }
                          n >>>= 0;
                          tc[n] = {
                              Rf: n,
                              Qf: b,
                              bf: g,
                              fd: e,
                              Uf: c,
                              flags: d,
                              offset: f
                          };
                          l = n
                      }
                  }
                  return l
              } catch (z) {
                  if ("undefined" === typeof L || !(z instanceof J))
                      throw z;
                  return -z.Be
              }
          },
          Cd: function(a, b) {
              try {
                  a >>>= 0;
                  var c = tc[a];
                  if (0 !== b && c) {
                      if (b === c.Qf) {
                          var d = Ob[c.fd];
                          if (d && c.Uf & 2) {
                              var e = c.flags
                                , f = c.offset
                                , g = r.slice(a, a + b);
                              d && d.ye.Ye && d.ye.Ye(d, g, f >>> 0, b, e)
                          }
                          tc[a] = null;
                          c.bf && $c(c.Rf)
                      }
                      var l = 0
                  } else
                      l = -28;
                  return l
              } catch (n) {
                  if ("undefined" === typeof L || !(n instanceof J))
                      throw n;
                  return -n.Be
              }
          },
          Bd: function(a, b, c) {
              wc = c;
              try {
                  var d = B(a)
                    , e = c ? xc() : 0;
                  return kc(d, b, e).fd
              } catch (f) {
                  if ("undefined" === typeof L || !(f instanceof J))
                      throw f;
                  return -f.Be
              }
          },
          Ad: function(a, b) {
              try {
                  return a = B(a),
                  uc(ic, a, b)
              } catch (c) {
                  if ("undefined" === typeof L || !(c instanceof J))
                      throw c;
                  return -c.Be
              }
          },
          fa: function() {},
          vd: function(a, b, c, d, e) {
              var f = zc(c);
              b = M(b);
              Kc(a, {
                  name: b,
                  fromWireType: function(g) {
                      return !!g
                  },
                  toWireType: function(g, l) {
                      return l ? d : e
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: function(g) {
                      if (1 === c)
                          var l = w;
                      else if (2 === c)
                          l = Ka;
                      else if (4 === c)
                          l = C;
                      else
                          throw new TypeError("Unknown boolean type size: " + b);
                      return this.fromWireType(l[g >>> f])
                  },
                  Ie: null
              })
          },
          ud: function(a, b) {
              b = M(b);
              Kc(a, {
                  name: b,
                  fromWireType: function(c) {
                      var d = Q(c);
                      Mc(c);
                      return d
                  },
                  toWireType: function(c, d) {
                      return R(d)
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: Nc,
                  Ie: null
              })
          },
          Z: function(a, b, c) {
              c = zc(c);
              b = M(b);
              Kc(a, {
                  name: b,
                  fromWireType: function(d) {
                      return d
                  },
                  toWireType: function(d, e) {
                      return e
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: Pc(b, c),
                  Ie: null
              })
          },
          j: function(a, b, c, d, e, f) {
              var g = Uc(b, c);
              a = M(a);
              e = Wc(d, e);
              Tc(a, function() {
                  ad("Cannot call " + a + " due to unbound types", g)
              }, b - 1);
              Jc(g, function(l) {
                  var n = [l[0], null].concat(l.slice(1))
                    , q = l = a
                    , t = e
                    , v = n.length;
                  2 > v && N("argTypes array size mismatch! Must at least get return value and 'this' types!");
                  for (var z = null !== n[1] && !1, p = !1, u = 1; u < n.length; ++u)
                      if (null !== n[u] && void 0 === n[u].Ie) {
                          p = !0;
                          break
                      }
                  var A = "void" !== n[0].name
                    , I = ""
                    , P = "";
                  for (u = 0; u < v - 2; ++u)
                      I += (0 !== u ? ", " : "") + "arg" + u,
                      P += (0 !== u ? ", " : "") + "arg" + u + "Wired";
                  q = "return function " + Ec(q) + "(" + I + ") {\nif (arguments.length !== " + (v - 2) + ") {\nthrowBindingError('function " + q + " called with ' + arguments.length + ' arguments, expected " + (v - 2) + " args!');\n}\n";
                  p && (q += "var destructors = [];\n");
                  var da = p ? "destructors" : "null";
                  I = "throwBindingError invoker fn runDestructors retType classParam".split(" ");
                  t = [N, t, f, Rc, n[0], n[1]];
                  z && (q += "var thisWired = classParam.toWireType(" + da + ", this);\n");
                  for (u = 0; u < v - 2; ++u)
                      q += "var arg" + u + "Wired = argType" + u + ".toWireType(" + da + ", arg" + u + "); // " + n[u + 2].name + "\n",
                      I.push("argType" + u),
                      t.push(n[u + 2]);
                  z && (P = "thisWired" + (0 < P.length ? ", " : "") + P);
                  q += (A ? "var rv = " : "") + "invoker(fn" + (0 < P.length ? ", " : "") + P + ");\n";
                  if (p)
                      q += "runDestructors(destructors);\n";
                  else
                      for (u = z ? 1 : 2; u < n.length; ++u)
                          v = 1 === u ? "thisWired" : "arg" + (u - 2) + "Wired",
                          null !== n[u].Ie && (q += v + "_dtor(" + v + "); // " + n[u].name + "\n",
                          I.push(v + "_dtor"),
                          t.push(n[u].Ie));
                  A && (q += "var ret = retType.fromWireType(rv);\nreturn ret;\n");
                  I.push(q + "}\n");
                  n = Qc(I).apply(null, t);
                  u = b - 1;
                  if (!h.hasOwnProperty(l))
                      throw new Ic("Replacing nonexistant public symbol");
                  void 0 !== h[l].Fe && void 0 !== u ? h[l].Fe[u] = n : (h[l] = n,
                  h[l].Ff = u);
                  return []
              })
          },
          J: function(a, b, c, d, e) {
              function f(q) {
                  return q
              }
              b = M(b);
              -1 === e && (e = 4294967295);
              var g = zc(c);
              if (0 === d) {
                  var l = 32 - 8 * c;
                  f = function(q) {
                      return q << l >>> l
                  }
              }
              var n = b.includes("unsigned");
              Kc(a, {
                  name: b,
                  fromWireType: f,
                  toWireType: function(q, t) {
                      if ("number" !== typeof t && "boolean" !== typeof t)
                          throw new TypeError('Cannot convert "' + Oc(t) + '" to ' + this.name);
                      if (t < d || t > e)
                          throw new TypeError('Passing a number "' + Oc(t) + '" from JS side to C/C++ side to an argument of type "' + b + '", which is outside the valid range [' + d + ", " + e + "]!");
                      return n ? t >>> 0 : t | 0
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: bd(b, g, 0 !== d),
                  Ie: null
              })
          },
          I: function(a, b, c) {
              function d(f) {
                  f >>= 2;
                  var g = D;
                  return new e(Sa,g[f + 1 >>> 0],g[f >>> 0])
              }
              var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][b];
              c = M(c);
              Kc(a, {
                  name: c,
                  fromWireType: d,
                  argPackAdvance: 8,
                  readValueFromPointer: d
              }, {
                  Lf: !0
              })
          },
          Y: function(a, b) {
              b = M(b);
              var c = "std::string" === b;
              Kc(a, {
                  name: b,
                  fromWireType: function(d) {
                      var e = D[d >>> 2];
                      if (c)
                          for (var f = d + 4, g = 0; g <= e; ++g) {
                              var l = d + 4 + g;
                              if (g == e || 0 == r[l >>> 0]) {
                                  f = B(f, l - f);
                                  if (void 0 === n)
                                      var n = f;
                                  else
                                      n += String.fromCharCode(0),
                                      n += f;
                                  f = l + 1
                              }
                          }
                      else {
                          n = Array(e);
                          for (g = 0; g < e; ++g)
                              n[g] = String.fromCharCode(r[d + 4 + g >>> 0]);
                          n = n.join("")
                      }
                      $c(d);
                      return n
                  },
                  toWireType: function(d, e) {
                      e instanceof ArrayBuffer && (e = new Uint8Array(e));
                      var f = "string" === typeof e;
                      f || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array || N("Cannot pass non-string to std::string");
                      var g = (c && f ? function() {
                          return Fa(e)
                      }
                      : function() {
                          return e.length
                      }
                      )()
                        , l = Ra(4 + g + 1);
                      l >>>= 0;
                      D[l >>> 2] = g;
                      if (c && f)
                          Ca(e, r, l + 4, g + 1);
                      else if (f)
                          for (f = 0; f < g; ++f) {
                              var n = e.charCodeAt(f);
                              255 < n && ($c(l),
                              N("String has UTF-16 code units that do not fit in 8 bits"));
                              r[l + 4 + f >>> 0] = n
                          }
                      else
                          for (f = 0; f < g; ++f)
                              r[l + 4 + f >>> 0] = e[f];
                      null !== d && d.push($c, l);
                      return l
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: Nc,
                  Ie: function(d) {
                      $c(d)
                  }
              })
          },
          P: function(a, b, c) {
              c = M(c);
              if (2 === b) {
                  var d = Ia;
                  var e = La;
                  var f = Ma;
                  var g = function() {
                      return Ja
                  };
                  var l = 1
              } else
                  4 === b && (d = Na,
                  e = Oa,
                  f = Pa,
                  g = function() {
                      return D
                  }
                  ,
                  l = 2);
              Kc(a, {
                  name: c,
                  fromWireType: function(n) {
                      for (var q = D[n >>> 2], t = g(), v, z = n + 4, p = 0; p <= q; ++p) {
                          var u = n + 4 + p * b;
                          if (p == q || 0 == t[u >>> l])
                              z = d(z, u - z),
                              void 0 === v ? v = z : (v += String.fromCharCode(0),
                              v += z),
                              z = u + b
                      }
                      $c(n);
                      return v
                  },
                  toWireType: function(n, q) {
                      "string" !== typeof q && N("Cannot pass non-string to C++ string type " + c);
                      var t = f(q)
                        , v = Ra(4 + t + b);
                      v >>>= 0;
                      D[v >>> 2] = t >> l;
                      e(q, v + 4, t + b);
                      null !== n && n.push($c, v);
                      return v
                  },
                  argPackAdvance: 8,
                  readValueFromPointer: Nc,
                  Ie: function(n) {
                      $c(n)
                  }
              })
          },
          td: function(a, b) {
              b = M(b);
              Kc(a, {
                  Pf: !0,
                  name: b,
                  argPackAdvance: 0,
                  fromWireType: function() {},
                  toWireType: function() {}
              })
          },
          sd: function() {
              throw "longjmp";
          },
          g: function(a, b, c) {
              a = Q(a);
              b = cd(b, "emval::as");
              var d = []
                , e = R(d);
              C[c >>> 2] = e;
              return b.toWireType(d, a)
          },
          o: function(a, b, c, d, e) {
              a = fd[a];
              b = Q(b);
              c = ed(c);
              var f = [];
              C[d >>> 2] = R(f);
              return a(b, c, f, e)
          },
          s: function(a, b, c, d) {
              a = fd[a];
              b = Q(b);
              c = ed(c);
              a(b, c, null, d)
          },
          a: Mc,
          B: function(a, b) {
              a = Q(a);
              b = Q(b);
              return a == b
          },
          q: function(a) {
              if (0 === a)
                  return R(gd());
              a = ed(a);
              return R(gd()[a])
          },
          l: function(a, b) {
              var c = jd(a, b)
                , d = c[0];
              b = d.name + "_$" + c.slice(1).map(function(t) {
                  return t.name
              }).join("_") + "$";
              var e = kd[b];
              if (void 0 !== e)
                  return e;
              e = ["retType"];
              for (var f = [d], g = "", l = 0; l < a - 1; ++l)
                  g += (0 !== l ? ", " : "") + "arg" + l,
                  e.push("argType" + l),
                  f.push(c[1 + l]);
              var n = "return function " + Ec("methodCaller_" + b) + "(handle, name, destructors, args) {\n"
                , q = 0;
              for (l = 0; l < a - 1; ++l)
                  n += "    var arg" + l + " = argType" + l + ".readValueFromPointer(args" + (q ? "+" + q : "") + ");\n",
                  q += c[l + 1].argPackAdvance;
              n += "    var rv = handle[name](" + g + ");\n";
              for (l = 0; l < a - 1; ++l)
                  c[l + 1].deleteObject && (n += "    argType" + l + ".deleteObject(arg" + l + ");\n");
              d.Pf || (n += "    return retType.toWireType(destructors, rv);\n");
              e.push(n + "};\n");
              a = Qc(e).apply(null, f);
              e = hd(a);
              return kd[b] = e
          },
          w: function(a) {
              a = ed(a);
              return R(h[a])
          },
          e: function(a, b) {
              a = Q(a);
              b = Q(b);
              return R(a[b])
          },
          i: function(a) {
              4 < a && (O[a].jf += 1)
          },
          r: function(a, b) {
              a = Q(a);
              b = Q(b);
              return a instanceof b
          },
          z: function(a) {
              a = Q(a);
              return "number" === typeof a
          },
          y: function(a) {
              a = Q(a);
              return "string" === typeof a
          },
          k: function() {
              return R([])
          },
          b: function(a) {
              return R(ed(a))
          },
          h: function() {
              return R({})
          },
          f: function(a) {
              var b = Q(a);
              Rc(b);
              Mc(a)
          },
          c: function(a, b, c) {
              a = Q(a);
              b = Q(b);
              c = Q(c);
              a[b] = c
          },
          d: function(a, b) {
              a = cd(a, "_emval_take_value");
              a = a.readValueFromPointer(b);
              return R(a)
          },
          p: function() {
              qa("")
          },
          M: ld,
          X: function(a, b) {
              if (0 === a)
                  a = Date.now();
              else if (1 === a || 4 === a)
                  a = md();
              else
                  return C[Be() >> 2 >>> 0] = 28,
                  -1;
              C[b >> 2 >>> 0] = a / 1E3 | 0;
              C[b + 4 >> 2 >>> 0] = a % 1E3 * 1E6 | 0;
              return 0
          },
          G: function(a, b, c) {
              nd.length = 0;
              var d;
              for (c >>= 2; d = r[b++ >>> 0]; )
                  (d = 105 > d) && c & 1 && c++,
                  nd.push(d ? Ta[c++ >>> 1] : C[c >>> 0]),
                  ++c;
              return jb[a].apply(null, nd)
          },
          rd: function(a) {
              W.activeTexture(a)
          },
          qd: function(a, b) {
              W.attachShader(S[a], T[b])
          },
          pd: function(a, b, c) {
              W.bindAttribLocation(S[a], b, B(c))
          },
          od: function(a, b) {
              35051 == a ? W.df = b : 35052 == a && (W.Me = b);
              W.bindBuffer(a, vd[b])
          },
          nd: function(a, b, c) {
              W.bindBufferBase(a, b, vd[c])
          },
          md: function(a, b, c, d, e) {
              W.bindBufferRange(a, b, vd[c], d, e)
          },
          ld: function(a, b) {
              W.bindFramebuffer(a, wd[b])
          },
          kd: function(a, b) {
              W.bindRenderbuffer(a, xd[b])
          },
          jd: function(a, b) {
              W.bindSampler(a, Bd[b])
          },
          id: function(a, b) {
              W.bindTexture(a, yd[b])
          },
          hd: function(a) {
              W.bindVertexArray(zd[a])
          },
          gd: function(a) {
              W.bindVertexArray(zd[a])
          },
          fd: function(a, b, c, d) {
              W.blendColor(a, b, c, d)
          },
          ed: function(a) {
              W.blendEquation(a)
          },
          dd: function(a, b) {
              W.blendFunc(a, b)
          },
          cd: function(a, b, c, d, e, f, g, l, n, q) {
              W.blitFramebuffer(a, b, c, d, e, f, g, l, n, q)
          },
          bd: function(a, b, c, d) {
              2 <= V.version ? c ? W.bufferData(a, r, d, c, b) : W.bufferData(a, b, d) : W.bufferData(a, c ? r.subarray(c >>> 0, c + b >>> 0) : b, d)
          },
          ad: function(a, b, c, d) {
              2 <= V.version ? W.bufferSubData(a, b, r, d, c) : W.bufferSubData(a, b, r.subarray(d >>> 0, d + c >>> 0))
          },
          $c: function(a) {
              return W.checkFramebufferStatus(a)
          },
          _c: function(a) {
              W.clear(a)
          },
          Zc: function(a, b, c, d) {
              W.clearColor(a, b, c, d)
          },
          Yc: function(a) {
              W.clearDepth(a)
          },
          Xc: function(a) {
              W.clearStencil(a)
          },
          Wc: function(a, b, c, d) {
              return W.clientWaitSync(Cd[a], b, (c >>> 0) + 4294967296 * d)
          },
          Vc: function(a, b, c, d) {
              W.colorMask(!!a, !!b, !!c, !!d)
          },
          Uc: function(a) {
              W.compileShader(T[a])
          },
          Tc: function(a, b, c, d, e, f, g, l) {
              2 <= V.version ? W.Me ? W.compressedTexImage2D(a, b, c, d, e, f, g, l) : W.compressedTexImage2D(a, b, c, d, e, f, r, l, g) : W.compressedTexImage2D(a, b, c, d, e, f, l ? r.subarray(l >>> 0, l + g >>> 0) : null)
          },
          Sc: function(a, b, c, d, e, f, g, l, n) {
              2 <= V.version ? W.Me ? W.compressedTexSubImage2D(a, b, c, d, e, f, g, l, n) : W.compressedTexSubImage2D(a, b, c, d, e, f, g, r, n, l) : W.compressedTexSubImage2D(a, b, c, d, e, f, g, n ? r.subarray(n >>> 0, n + l >>> 0) : null)
          },
          Rc: function(a, b, c, d, e, f, g, l) {
              W.copyTexSubImage2D(a, b, c, d, e, f, g, l)
          },
          Qc: function() {
              var a = Hd(S)
                , b = W.createProgram();
              b.name = a;
              b.Ue = b.Se = b.Te = 0;
              b.kf = 1;
              S[a] = b;
              return a
          },
          Pc: function(a) {
              var b = Hd(T);
              T[b] = W.createShader(a);
              return b
          },
          Oc: function(a) {
              W.cullFace(a)
          },
          Nc: function(a, b) {
              for (var c = 0; c < a; c++) {
                  var d = C[b + 4 * c >> 2 >>> 0]
                    , e = vd[d];
                  e && (W.deleteBuffer(e),
                  e.name = 0,
                  vd[d] = null,
                  d == W.df && (W.df = 0),
                  d == W.Me && (W.Me = 0))
              }
          },
          Mc: function(a, b) {
              for (var c = 0; c < a; ++c) {
                  var d = C[b + 4 * c >> 2 >>> 0]
                    , e = wd[d];
                  e && (W.deleteFramebuffer(e),
                  e.name = 0,
                  wd[d] = null)
              }
          },
          Lc: function(a) {
              if (a) {
                  var b = S[a];
                  b ? (W.deleteProgram(b),
                  b.name = 0,
                  S[a] = null) : U(1281)
              }
          },
          Kc: function(a, b) {
              for (var c = 0; c < a; c++) {
                  var d = C[b + 4 * c >> 2 >>> 0]
                    , e = xd[d];
                  e && (W.deleteRenderbuffer(e),
                  e.name = 0,
                  xd[d] = null)
              }
          },
          Jc: function(a, b) {
              for (var c = 0; c < a; c++) {
                  var d = C[b + 4 * c >> 2 >>> 0]
                    , e = Bd[d];
                  e && (W.deleteSampler(e),
                  e.name = 0,
                  Bd[d] = null)
              }
          },
          Ic: function(a) {
              if (a) {
                  var b = T[a];
                  b ? (W.deleteShader(b),
                  T[a] = null) : U(1281)
              }
          },
          Hc: function(a) {
              if (a) {
                  var b = Cd[a];
                  b ? (W.deleteSync(b),
                  b.name = 0,
                  Cd[a] = null) : U(1281)
              }
          },
          Gc: function(a, b) {
              for (var c = 0; c < a; c++) {
                  var d = C[b + 4 * c >> 2 >>> 0]
                    , e = yd[d];
                  e && (W.deleteTexture(e),
                  e.name = 0,
                  yd[d] = null)
              }
          },
          Fc: function(a, b) {
              for (var c = 0; c < a; c++) {
                  var d = C[b + 4 * c >> 2 >>> 0];
                  W.deleteVertexArray(zd[d]);
                  zd[d] = null
              }
          },
          Ec: function(a, b) {
              for (var c = 0; c < a; c++) {
                  var d = C[b + 4 * c >> 2 >>> 0];
                  W.deleteVertexArray(zd[d]);
                  zd[d] = null
              }
          },
          Dc: function(a) {
              W.depthFunc(a)
          },
          Cc: function(a) {
              W.depthMask(!!a)
          },
          Bc: function(a) {
              W.disable(a)
          },
          Ac: function(a) {
              W.disableVertexAttribArray(a)
          },
          zc: function(a, b, c) {
              W.drawArrays(a, b, c)
          },
          yc: function(a, b, c, d) {
              W.drawArraysInstanced(a, b, c, d)
          },
          xc: function(a, b, c, d, e) {
              W.rf.drawArraysInstancedBaseInstanceWEBGL(a, b, c, d, e)
          },
          wc: function(a, b) {
              for (var c = Ld[a], d = 0; d < a; d++)
                  c[d] = C[b + 4 * d >> 2 >>> 0];
              W.drawBuffers(c)
          },
          vc: function(a, b, c, d) {
              W.drawElements(a, b, c, d)
          },
          uc: function(a, b, c, d, e) {
              W.drawElementsInstanced(a, b, c, d, e)
          },
          tc: function(a, b, c, d, e, f, g) {
              W.rf.drawElementsInstancedBaseVertexBaseInstanceWEBGL(a, b, c, d, e, f, g)
          },
          sc: function(a, b, c, d, e, f) {
              W.drawElements(a, d, e, f)
          },
          rc: function(a) {
              W.enable(a)
          },
          qc: function(a) {
              W.enableVertexAttribArray(a)
          },
          pc: function(a, b) {
              return (a = W.fenceSync(a, b)) ? (b = Hd(Cd),
              a.name = b,
              Cd[b] = a,
              b) : 0
          },
          oc: function() {
              W.finish()
          },
          nc: function() {
              W.flush()
          },
          mc: function(a, b, c, d) {
              W.framebufferRenderbuffer(a, b, c, xd[d])
          },
          lc: function(a, b, c, d, e) {
              W.framebufferTexture2D(a, b, c, yd[d], e)
          },
          kc: function(a) {
              W.frontFace(a)
          },
          jc: function(a, b) {
              Md(a, b, "createBuffer", vd)
          },
          ic: function(a, b) {
              Md(a, b, "createFramebuffer", wd)
          },
          hc: function(a, b) {
              Md(a, b, "createRenderbuffer", xd)
          },
          gc: function(a, b) {
              Md(a, b, "createSampler", Bd)
          },
          fc: function(a, b) {
              Md(a, b, "createTexture", yd)
          },
          ec: function(a, b) {
              Md(a, b, "createVertexArray", zd)
          },
          dc: function(a, b) {
              Md(a, b, "createVertexArray", zd)
          },
          cc: function(a) {
              W.generateMipmap(a)
          },
          bc: function(a, b, c, d) {
              if (d)
                  if (a = S[a],
                  35393 == c)
                      c = W.getActiveUniformBlockName(a, b),
                      C[d >> 2 >>> 0] = c.length + 1;
                  else {
                      if (a = W.getActiveUniformBlockParameter(a, b, c),
                      null !== a)
                          if (35395 == c)
                              for (c = 0; c < a.length; c++)
                                  C[d + 4 * c >> 2 >>> 0] = a[c];
                          else
                              C[d >> 2 >>> 0] = a
                  }
              else
                  U(1281)
          },
          ac: function(a, b) {
              return W.getAttribLocation(S[a], B(b))
          },
          $b: function(a, b) {
              Nd(a, b, 4)
          },
          _b: function(a, b, c) {
              c ? C[c >> 2 >>> 0] = W.getBufferParameter(a, b) : U(1281)
          },
          Zb: function() {
              var a = W.getError() || Gd;
              Gd = 0;
              return a
          },
          Yb: function(a, b) {
              Nd(a, b, 2)
          },
          Xb: function(a, b, c, d) {
              a = W.getFramebufferAttachmentParameter(a, b, c);
              if (a instanceof WebGLRenderbuffer || a instanceof WebGLTexture)
                  a = a.name | 0;
              C[d >> 2 >>> 0] = a
          },
          W: function(a, b) {
              Nd(a, b, 0)
          },
          Wb: function(a, b, c, d) {
              a = W.getProgramInfoLog(S[a]);
              null === a && (a = "(unknown error)");
              b = 0 < b && d ? Ca(a, r, d, b) : 0;
              c && (C[c >> 2 >>> 0] = b)
          },
          Vb: function(a, b, c) {
              if (c)
                  if (a >= ud)
                      U(1281);
                  else if (a = S[a],
                  35716 == b)
                      a = W.getProgramInfoLog(a),
                      null === a && (a = "(unknown error)"),
                      C[c >> 2 >>> 0] = a.length + 1;
                  else if (35719 == b) {
                      if (!a.Ue)
                          for (b = 0; b < W.getProgramParameter(a, 35718); ++b)
                              a.Ue = Math.max(a.Ue, W.getActiveUniform(a, b).name.length + 1);
                      C[c >> 2 >>> 0] = a.Ue
                  } else if (35722 == b) {
                      if (!a.Se)
                          for (b = 0; b < W.getProgramParameter(a, 35721); ++b)
                              a.Se = Math.max(a.Se, W.getActiveAttrib(a, b).name.length + 1);
                      C[c >> 2 >>> 0] = a.Se
                  } else if (35381 == b) {
                      if (!a.Te)
                          for (b = 0; b < W.getProgramParameter(a, 35382); ++b)
                              a.Te = Math.max(a.Te, W.getActiveUniformBlockName(a, b).length + 1);
                      C[c >> 2 >>> 0] = a.Te
                  } else
                      C[c >> 2 >>> 0] = W.getProgramParameter(a, b);
              else
                  U(1281)
          },
          Ub: function(a, b, c) {
              c ? C[c >> 2 >>> 0] = W.getRenderbufferParameter(a, b) : U(1281)
          },
          Tb: function(a, b, c, d) {
              a = W.getShaderInfoLog(T[a]);
              null === a && (a = "(unknown error)");
              b = 0 < b && d ? Ca(a, r, d, b) : 0;
              c && (C[c >> 2 >>> 0] = b)
          },
          Sb: function(a, b, c, d) {
              a = W.getShaderPrecisionFormat(a, b);
              C[c >> 2 >>> 0] = a.rangeMin;
              C[c + 4 >> 2 >>> 0] = a.rangeMax;
              C[d >> 2 >>> 0] = a.precision
          },
          Rb: function(a, b, c) {
              c ? 35716 == b ? (a = W.getShaderInfoLog(T[a]),
              null === a && (a = "(unknown error)"),
              C[c >> 2 >>> 0] = a ? a.length + 1 : 0) : 35720 == b ? (a = W.getShaderSource(T[a]),
              C[c >> 2 >>> 0] = a ? a.length + 1 : 0) : C[c >> 2 >>> 0] = W.getShaderParameter(T[a], b) : U(1281)
          },
          L: function(a) {
              var b = Dd[a];
              if (!b) {
                  switch (a) {
                  case 7939:
                      b = W.getSupportedExtensions() || [];
                      b = b.concat(b.map(function(d) {
                          return "GL_" + d
                      }));
                      b = Od(b.join(" "));
                      break;
                  case 7936:
                  case 7937:
                  case 37445:
                  case 37446:
                      (b = W.getParameter(a)) || U(1280);
                      b = b && Od(b);
                      break;
                  case 7938:
                      b = W.getParameter(7938);
                      b = 2 <= V.version ? "OpenGL ES 3.0 (" + b + ")" : "OpenGL ES 2.0 (" + b + ")";
                      b = Od(b);
                      break;
                  case 35724:
                      b = W.getParameter(35724);
                      var c = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
                      null !== c && (3 == c[1].length && (c[1] += "0"),
                      b = "OpenGL ES GLSL ES " + c[1] + " (" + b + ")");
                      b = Od(b);
                      break;
                  default:
                      U(1280)
                  }
                  Dd[a] = b
              }
              return b
          },
          Qb: function(a, b) {
              if (2 > V.version)
                  return U(1282),
                  0;
              var c = Ed[a];
              if (c)
                  return 0 > b || b >= c.length ? (U(1281),
                  0) : c[b];
              switch (a) {
              case 7939:
                  return c = W.getSupportedExtensions() || [],
                  c = c.concat(c.map(function(d) {
                      return "GL_" + d
                  })),
                  c = c.map(function(d) {
                      return Od(d)
                  }),
                  c = Ed[a] = c,
                  0 > b || b >= c.length ? (U(1281),
                  0) : c[b];
              default:
                  return U(1280),
                  0
              }
          },
          Pb: function(a, b) {
              return W.getUniformBlockIndex(S[a], B(b))
          },
          Ob: function(a, b) {
              b = B(b);
              if (a = S[a]) {
                  var c = a, d = c.Re, e = c.Df, f;
                  if (!d)
                      for (c.Re = d = {},
                      c.Cf = {},
                      f = 0; f < W.getProgramParameter(c, 35718); ++f) {
                          var g = W.getActiveUniform(c, f);
                          var l = g.name;
                          g = g.size;
                          var n = Pd(l);
                          n = 0 < n ? l.slice(0, n) : l;
                          var q = c.kf;
                          c.kf += g;
                          e[n] = [g, q];
                          for (l = 0; l < g; ++l)
                              d[q] = l,
                              c.Cf[q++] = n
                      }
                  c = a.Re;
                  d = 0;
                  e = b;
                  f = Pd(b);
                  0 < f && (d = parseInt(b.slice(f + 1)) >>> 0,
                  e = b.slice(0, f));
                  if ((e = a.Df[e]) && d < e[0] && (d += e[1],
                  c[d] = c[d] || W.getUniformLocation(a, b)))
                      return d
              } else
                  U(1281);
              return -1
          },
          Nb: function(a, b, c) {
              c ? C[c >> 2 >>> 0] = W.getVertexAttribOffset(a, b) : U(1281)
          },
          Mb: function(a, b, c) {
              Qd(a, b, c, 2)
          },
          Lb: function(a, b, c) {
              Qd(a, b, c, 5)
          },
          Kb: function(a, b, c) {
              for (var d = Ld[b], e = 0; e < b; e++)
                  d[e] = C[c + 4 * e >> 2 >>> 0];
              W.invalidateFramebuffer(a, d)
          },
          Jb: function(a, b, c, d, e, f, g) {
              for (var l = Ld[b], n = 0; n < b; n++)
                  l[n] = C[c + 4 * n >> 2 >>> 0];
              W.invalidateSubFramebuffer(a, l, d, e, f, g)
          },
          Ib: function(a) {
              return W.isSync(Cd[a])
          },
          Hb: function(a) {
              return (a = yd[a]) ? W.isTexture(a) : 0
          },
          Gb: function(a) {
              W.lineWidth(a)
          },
          Fb: function(a) {
              a = S[a];
              W.linkProgram(a);
              a.Re = 0;
              a.Df = {}
          },
          Eb: function(a, b, c, d, e, f) {
              W.Af.multiDrawArraysInstancedBaseInstanceWEBGL(a, C, b >> 2, C, c >> 2, C, d >> 2, D, e >> 2, f)
          },
          Db: function(a, b, c, d, e, f, g, l) {
              W.Af.multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL(a, C, b >> 2, c, C, d >> 2, C, e >> 2, C, f >> 2, D, g >> 2, l)
          },
          Cb: function(a, b) {
              3317 == a && (Fd = b);
              W.pixelStorei(a, b)
          },
          Bb: function(a) {
              W.readBuffer(a)
          },
          Ab: function(a, b, c, d, e, f, g) {
              if (2 <= V.version)
                  if (W.df)
                      W.readPixels(a, b, c, d, e, f, g);
                  else {
                      var l = Rd(f);
                      W.readPixels(a, b, c, d, e, f, l, g >> 31 - Math.clz32(l.BYTES_PER_ELEMENT))
                  }
              else
                  (g = Sd(f, e, c, d, g)) ? W.readPixels(a, b, c, d, e, f, g) : U(1280)
          },
          zb: function(a, b, c, d) {
              W.renderbufferStorage(a, b, c, d)
          },
          yb: function(a, b, c, d, e) {
              W.renderbufferStorageMultisample(a, b, c, d, e)
          },
          xb: function(a, b, c) {
              W.samplerParameterf(Bd[a], b, c)
          },
          wb: function(a, b, c) {
              W.samplerParameteri(Bd[a], b, c)
          },
          vb: function(a, b, c) {
              W.samplerParameteri(Bd[a], b, C[c >> 2 >>> 0])
          },
          ub: function(a, b, c, d) {
              W.scissor(a, b, c, d)
          },
          tb: function(a, b, c, d) {
              for (var e = "", f = 0; f < b; ++f) {
                  var g = d ? C[d + 4 * f >> 2 >>> 0] : -1;
                  e += B(C[c + 4 * f >> 2 >>> 0], 0 > g ? void 0 : g)
              }
              W.shaderSource(T[a], e)
          },
          sb: function(a, b, c) {
              W.stencilFunc(a, b, c)
          },
          rb: function(a, b, c, d) {
              W.stencilFuncSeparate(a, b, c, d)
          },
          qb: function(a) {
              W.stencilMask(a)
          },
          pb: function(a, b) {
              W.stencilMaskSeparate(a, b)
          },
          ob: function(a, b, c) {
              W.stencilOp(a, b, c)
          },
          nb: function(a, b, c, d) {
              W.stencilOpSeparate(a, b, c, d)
          },
          mb: Td,
          lb: function(a, b, c) {
              W.texParameterf(a, b, c)
          },
          kb: function(a, b, c) {
              W.texParameterf(a, b, E[c >> 2 >>> 0])
          },
          jb: function(a, b, c) {
              W.texParameteri(a, b, c)
          },
          ib: function(a, b, c) {
              W.texParameteri(a, b, C[c >> 2 >>> 0])
          },
          hb: function(a, b, c, d, e) {
              W.texStorage2D(a, b, c, d, e)
          },
          gb: Ud,
          fb: function(a, b) {
              W.uniform1f(X(a), b)
          },
          eb: function(a, b, c) {
              if (2 <= V.version)
                  W.uniform1fv(X(a), E, c >> 2, b);
              else {
                  if (288 >= b)
                      for (var d = Vd[b - 1], e = 0; e < b; ++e)
                          d[e] = E[c + 4 * e >> 2 >>> 0];
                  else
                      d = E.subarray(c >>> 2, c + 4 * b >>> 2);
                  W.uniform1fv(X(a), d)
              }
          },
          db: function(a, b) {
              W.uniform1i(X(a), b)
          },
          cb: function(a, b, c) {
              if (2 <= V.version)
                  W.uniform1iv(X(a), C, c >> 2, b);
              else {
                  if (288 >= b)
                      for (var d = Wd[b - 1], e = 0; e < b; ++e)
                          d[e] = C[c + 4 * e >> 2 >>> 0];
                  else
                      d = C.subarray(c >>> 2, c + 4 * b >>> 2);
                  W.uniform1iv(X(a), d)
              }
          },
          bb: function(a, b, c) {
              W.uniform2f(X(a), b, c)
          },
          ab: function(a, b, c) {
              if (2 <= V.version)
                  W.uniform2fv(X(a), E, c >> 2, 2 * b);
              else {
                  if (144 >= b)
                      for (var d = Vd[2 * b - 1], e = 0; e < 2 * b; e += 2)
                          d[e] = E[c + 4 * e >> 2 >>> 0],
                          d[e + 1] = E[c + (4 * e + 4) >> 2 >>> 0];
                  else
                      d = E.subarray(c >>> 2, c + 8 * b >>> 2);
                  W.uniform2fv(X(a), d)
              }
          },
          $a: function(a, b, c) {
              W.uniform2i(X(a), b, c)
          },
          _a: function(a, b, c) {
              if (2 <= V.version)
                  W.uniform2iv(X(a), C, c >> 2, 2 * b);
              else {
                  if (144 >= b)
                      for (var d = Wd[2 * b - 1], e = 0; e < 2 * b; e += 2)
                          d[e] = C[c + 4 * e >> 2 >>> 0],
                          d[e + 1] = C[c + (4 * e + 4) >> 2 >>> 0];
                  else
                      d = C.subarray(c >>> 2, c + 8 * b >>> 2);
                  W.uniform2iv(X(a), d)
              }
          },
          Za: function(a, b, c, d) {
              W.uniform3f(X(a), b, c, d)
          },
          Ya: function(a, b, c) {
              if (2 <= V.version)
                  W.uniform3fv(X(a), E, c >> 2, 3 * b);
              else {
                  if (96 >= b)
                      for (var d = Vd[3 * b - 1], e = 0; e < 3 * b; e += 3)
                          d[e] = E[c + 4 * e >> 2 >>> 0],
                          d[e + 1] = E[c + (4 * e + 4) >> 2 >>> 0],
                          d[e + 2] = E[c + (4 * e + 8) >> 2 >>> 0];
                  else
                      d = E.subarray(c >>> 2, c + 12 * b >>> 2);
                  W.uniform3fv(X(a), d)
              }
          },
          Xa: function(a, b, c, d) {
              W.uniform3i(X(a), b, c, d)
          },
          Wa: function(a, b, c) {
              if (2 <= V.version)
                  W.uniform3iv(X(a), C, c >> 2, 3 * b);
              else {
                  if (96 >= b)
                      for (var d = Wd[3 * b - 1], e = 0; e < 3 * b; e += 3)
                          d[e] = C[c + 4 * e >> 2 >>> 0],
                          d[e + 1] = C[c + (4 * e + 4) >> 2 >>> 0],
                          d[e + 2] = C[c + (4 * e + 8) >> 2 >>> 0];
                  else
                      d = C.subarray(c >>> 2, c + 12 * b >>> 2);
                  W.uniform3iv(X(a), d)
              }
          },
          Va: function(a, b, c, d, e) {
              W.uniform4f(X(a), b, c, d, e)
          },
          Ua: function(a, b, c) {
              if (2 <= V.version)
                  W.uniform4fv(X(a), E, c >> 2, 4 * b);
              else {
                  if (72 >= b) {
                      var d = Vd[4 * b - 1]
                        , e = E;
                      c >>= 2;
                      for (var f = 0; f < 4 * b; f += 4) {
                          var g = c + f;
                          d[f] = e[g >>> 0];
                          d[f + 1] = e[g + 1 >>> 0];
                          d[f + 2] = e[g + 2 >>> 0];
                          d[f + 3] = e[g + 3 >>> 0]
                      }
                  } else
                      d = E.subarray(c >>> 2, c + 16 * b >>> 2);
                  W.uniform4fv(X(a), d)
              }
          },
          Ta: function(a, b, c, d, e) {
              W.uniform4i(X(a), b, c, d, e)
          },
          Sa: function(a, b, c) {
              if (2 <= V.version)
                  W.uniform4iv(X(a), C, c >> 2, 4 * b);
              else {
                  if (72 >= b)
                      for (var d = Wd[4 * b - 1], e = 0; e < 4 * b; e += 4)
                          d[e] = C[c + 4 * e >> 2 >>> 0],
                          d[e + 1] = C[c + (4 * e + 4) >> 2 >>> 0],
                          d[e + 2] = C[c + (4 * e + 8) >> 2 >>> 0],
                          d[e + 3] = C[c + (4 * e + 12) >> 2 >>> 0];
                  else
                      d = C.subarray(c >>> 2, c + 16 * b >>> 2);
                  W.uniform4iv(X(a), d)
              }
          },
          Ra: function(a, b, c) {
              a = S[a];
              W.uniformBlockBinding(a, b, c)
          },
          Qa: function(a, b, c, d) {
              if (2 <= V.version)
                  W.uniformMatrix2fv(X(a), !!c, E, d >> 2, 4 * b);
              else {
                  if (72 >= b)
                      for (var e = Vd[4 * b - 1], f = 0; f < 4 * b; f += 4)
                          e[f] = E[d + 4 * f >> 2 >>> 0],
                          e[f + 1] = E[d + (4 * f + 4) >> 2 >>> 0],
                          e[f + 2] = E[d + (4 * f + 8) >> 2 >>> 0],
                          e[f + 3] = E[d + (4 * f + 12) >> 2 >>> 0];
                  else
                      e = E.subarray(d >>> 2, d + 16 * b >>> 2);
                  W.uniformMatrix2fv(X(a), !!c, e)
              }
          },
          Pa: function(a, b, c, d) {
              if (2 <= V.version)
                  W.uniformMatrix3fv(X(a), !!c, E, d >> 2, 9 * b);
              else {
                  if (32 >= b)
                      for (var e = Vd[9 * b - 1], f = 0; f < 9 * b; f += 9)
                          e[f] = E[d + 4 * f >> 2 >>> 0],
                          e[f + 1] = E[d + (4 * f + 4) >> 2 >>> 0],
                          e[f + 2] = E[d + (4 * f + 8) >> 2 >>> 0],
                          e[f + 3] = E[d + (4 * f + 12) >> 2 >>> 0],
                          e[f + 4] = E[d + (4 * f + 16) >> 2 >>> 0],
                          e[f + 5] = E[d + (4 * f + 20) >> 2 >>> 0],
                          e[f + 6] = E[d + (4 * f + 24) >> 2 >>> 0],
                          e[f + 7] = E[d + (4 * f + 28) >> 2 >>> 0],
                          e[f + 8] = E[d + (4 * f + 32) >> 2 >>> 0];
                  else
                      e = E.subarray(d >>> 2, d + 36 * b >>> 2);
                  W.uniformMatrix3fv(X(a), !!c, e)
              }
          },
          Oa: function(a, b, c, d) {
              if (2 <= V.version)
                  W.uniformMatrix4fv(X(a), !!c, E, d >> 2, 16 * b);
              else {
                  if (18 >= b) {
                      var e = Vd[16 * b - 1]
                        , f = E;
                      d >>= 2;
                      for (var g = 0; g < 16 * b; g += 16) {
                          var l = d + g;
                          e[g] = f[l >>> 0];
                          e[g + 1] = f[l + 1 >>> 0];
                          e[g + 2] = f[l + 2 >>> 0];
                          e[g + 3] = f[l + 3 >>> 0];
                          e[g + 4] = f[l + 4 >>> 0];
                          e[g + 5] = f[l + 5 >>> 0];
                          e[g + 6] = f[l + 6 >>> 0];
                          e[g + 7] = f[l + 7 >>> 0];
                          e[g + 8] = f[l + 8 >>> 0];
                          e[g + 9] = f[l + 9 >>> 0];
                          e[g + 10] = f[l + 10 >>> 0];
                          e[g + 11] = f[l + 11 >>> 0];
                          e[g + 12] = f[l + 12 >>> 0];
                          e[g + 13] = f[l + 13 >>> 0];
                          e[g + 14] = f[l + 14 >>> 0];
                          e[g + 15] = f[l + 15 >>> 0]
                      }
                  } else
                      e = E.subarray(d >>> 2, d + 64 * b >>> 2);
                  W.uniformMatrix4fv(X(a), !!c, e)
              }
          },
          Na: function(a) {
              a = S[a];
              W.useProgram(a);
              W.Hf = a
          },
          Ma: function(a, b) {
              W.vertexAttrib1f(a, b)
          },
          La: function(a, b) {
              W.vertexAttrib2f(a, E[b >>> 2], E[b + 4 >>> 2])
          },
          Ka: function(a, b) {
              W.vertexAttrib3f(a, E[b >>> 2], E[b + 4 >>> 2], E[b + 8 >>> 2])
          },
          Ja: function(a, b) {
              W.vertexAttrib4f(a, E[b >>> 2], E[b + 4 >>> 2], E[b + 8 >>> 2], E[b + 12 >>> 2])
          },
          Ia: function(a, b) {
              W.vertexAttribDivisor(a, b)
          },
          Ha: function(a, b, c, d, e) {
              W.vertexAttribIPointer(a, b, c, d, e)
          },
          Ga: function(a, b, c, d, e, f) {
              W.vertexAttribPointer(a, b, c, !!d, e, f)
          },
          Fa: function(a, b, c, d) {
              W.viewport(a, b, c, d)
          },
          Ea: function(a, b, c, d) {
              W.waitSync(Cd[a], b, (c >>> 0) + 4294967296 * d)
          },
          Da: function(a, b, c) {
              r.copyWithin(a >>> 0, b >>> 0, b + c >>> 0)
          },
          O: function(a) {
              var b = r.length;
              a >>>= 0;
              if (4294901760 < a)
                  return !1;
              for (var c = 1; 4 >= c; c *= 2) {
                  var d = b * (1 + .2 / c);
                  d = Math.min(d, a + 100663296);
                  d = Math.max(a, d);
                  0 < d % 65536 && (d += 65536 - d % 65536);
                  a: {
                      try {
                          wa.grow(Math.min(4294901760, d) - Sa.byteLength + 65535 >>> 16);
                          Ua();
                          var e = 1;
                          break a
                      } catch (f) {}
                      e = void 0
                  }
                  if (e)
                      return !0
              }
              return !1
          },
          Ca: function(a, b, c) {
              if ("undefined" === typeof onbeforeunload)
                  return -1;
              if (1 !== c)
                  return -5;
              ie(a, b);
              return 0
          },
          Ba: function(a, b, c, d) {
              je(a, b, c, d, 31, "webglcontextlost");
              return 0
          },
          Aa: function(a, b, c, d) {
              je(a, b, c, d, 32, "webglcontextrestored");
              return 0
          },
          V: function(a, b) {
              b >>= 2;
              b = {
                  alpha: !!C[b >>> 0],
                  depth: !!C[b + 1 >>> 0],
                  stencil: !!C[b + 2 >>> 0],
                  antialias: !!C[b + 3 >>> 0],
                  premultipliedAlpha: !!C[b + 4 >>> 0],
                  preserveDrawingBuffer: !!C[b + 5 >>> 0],
                  powerPreference: ke[C[b + 6 >>> 0]],
                  failIfMajorPerformanceCaveat: !!C[b + 7 >>> 0],
                  zf: C[b + 8 >>> 0],
                  mg: C[b + 9 >>> 0],
                  tf: C[b + 10 >>> 0],
                  Jf: C[b + 11 >>> 0],
                  rg: C[b + 12 >>> 0],
                  sg: C[b + 13 >>> 0]
              };
              a = he(a);
              return !a || b.Jf ? 0 : Id(a, b)
          },
          za: function(a) {
              V == a && (V = 0);
              V === Ad[a] && (V = null);
              if ("object" === typeof fe)
                  for (var b = Ad[a].Le.canvas, c = 0; c < Zd.length; ++c)
                      Zd[c].target != b || $d(c--);
              Ad[a] && Ad[a].Le.canvas && (Ad[a].Le.canvas.Ef = void 0);
              Ad[a] = null
          },
          ya: function(a, b) {
              a = Ad[a];
              b = B(b);
              b.startsWith("GL_") && (b = b.substr(3));
              "ANGLE_instanced_arrays" == b && od(W);
              "OES_vertex_array_object" == b && pd(W);
              "WEBGL_draw_buffers" == b && qd(W);
              "WEBGL_draw_instanced_base_vertex_base_instance" == b && rd(W);
              "WEBGL_multi_draw_instanced_base_vertex_base_instance" == b && sd(W);
              "WEBGL_multi_draw" == b && td(W);
              return !!a.Le.getExtension(b)
          },
          xa: function(a) {
              a >>= 2;
              for (var b = 0; 14 > b; ++b)
                  C[a + b >>> 0] = 0;
              C[a >>> 0] = C[a + 1 >>> 0] = C[a + 3 >>> 0] = C[a + 4 >>> 0] = C[a + 8 >>> 0] = C[a + 10 >>> 0] = 1
          },
          wa: le,
          zd: function(a, b) {
              var c = 0;
              ne().forEach(function(d, e) {
                  var f = b + c;
                  e = C[a + 4 * e >> 2 >>> 0] = f;
                  for (f = 0; f < d.length; ++f)
                      w[e++ >> 0 >>> 0] = d.charCodeAt(f);
                  w[e >> 0 >>> 0] = 0;
                  c += d.length + 1
              });
              return 0
          },
          yd: function(a, b) {
              var c = ne();
              C[a >> 2 >>> 0] = c.length;
              var d = 0;
              c.forEach(function(e) {
                  d += e.length + 1
              });
              C[b >> 2 >>> 0] = d;
              return 0
          },
          va: function(a) {
              Ce(a)
          },
          ua: function(a, b) {
              var c = {};
              c.buffer = Ga(a >>> 0);
              c.errorCode = b;
              return R(c)
          },
          N: function(a, b, c, d, e, f, g, l) {
              var n = {};
              n.fileName = B(b >>> 0);
              n.fileType = c;
              e >>>= 0;
              n.buffer = r.slice(e, e + f);
              n.size = f;
              n.layerName = B(g >>> 0);
              n.isSuffix = !!d;
              n.errorCode = l;
              a = Q(a);
              a.push(n)
          },
          U: function(a, b, c) {
              var d = {};
              a >>>= 0;
              d.buffer = r.slice(a, a + b);
              d.errorCode = c;
              return R(d)
          },
          ta: function(a, b, c, d, e, f) {
              var g = {};
              g.fileName = B(a >>> 0);
              g.fileType = b;
              c >>>= 0;
              g.buffer = r.slice(c, c + d);
              g.size = d;
              g.layerName = B(e >>> 0);
              g.errorCode = f;
              a = [];
              a.push(g);
              return R(a)
          },
          _: function(a) {
              try {
                  var b = yc(a);
                  if (null === b.fd)
                      throw new J(8);
                  b.ff && (b.ff = null);
                  try {
                      b.ye.close && b.ye.close(b)
                  } catch (c) {
                      throw c;
                  } finally {
                      Ob[b.fd] = null
                  }
                  b.fd = null;
                  return 0
              } catch (c) {
                  if ("undefined" === typeof L || !(c instanceof J))
                      throw c;
                  return c.Be
              }
          },
          ha: function(a, b, c, d, e, f) {
              try {
                  var g = yc(a)
                    , l = vc(g, b, c, d);
                  C[f >> 2 >>> 0] = l;
                  return 0
              } catch (n) {
                  if ("undefined" === typeof L || !(n instanceof J))
                      throw n;
                  return n.Be
              }
          },
          xd: function(a, b, c, d) {
              try {
                  var e = yc(a)
                    , f = vc(e, b, c);
                  C[d >> 2 >>> 0] = f;
                  return 0
              } catch (g) {
                  if ("undefined" === typeof L || !(g instanceof J))
                      throw g;
                  return g.Be
              }
          },
          ga: function(a, b, c, d, e) {
              try {
                  var f = yc(a);
                  a = 4294967296 * c + (b >>> 0);
                  if (-9007199254740992 >= a || 9007199254740992 <= a)
                      return -61;
                  nc(f, a, d);
                  ib = [f.position >>> 0, (G = f.position,
                  1 <= +Math.abs(G) ? 0 < G ? (Math.min(+Math.floor(G / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((G - +(~~G >>> 0)) / 4294967296) >>> 0 : 0)];
                  C[e >> 2 >>> 0] = ib[0];
                  C[e + 4 >> 2 >>> 0] = ib[1];
                  f.ff && 0 === a && 0 === d && (f.ff = null);
                  return 0
              } catch (g) {
                  if ("undefined" === typeof L || !(g instanceof J))
                      throw g;
                  return g.Be
              }
          },
          wd: function(a, b, c, d) {
              try {
                  a: {
                      for (var e = yc(a), f = a = 0; f < c; f++) {
                          var g = e
                            , l = C[b + 8 * f >> 2 >>> 0]
                            , n = C[b + (8 * f + 4) >> 2 >>> 0]
                            , q = void 0
                            , t = w;
                          l >>>= 0;
                          if (0 > n || 0 > q)
                              throw new J(28);
                          if (null === g.fd)
                              throw new J(8);
                          if (0 === (g.flags & 2097155))
                              throw new J(8);
                          if (16384 === (g.node.mode & 61440))
                              throw new J(31);
                          if (!g.ye.write)
                              throw new J(28);
                          g.seekable && g.flags & 1024 && nc(g, 0, 2);
                          var v = "undefined" !== typeof q;
                          if (!v)
                              q = g.position;
                          else if (!g.seekable)
                              throw new J(70);
                          var z = g.ye.write(g, t, l, n, q, void 0);
                          v || (g.position += z);
                          var p = z;
                          if (0 > p) {
                              var u = -1;
                              break a
                          }
                          a += p
                      }
                      u = a
                  }
                  C[d >> 2 >>> 0] = u;
                  return 0
              } catch (A) {
                  if ("undefined" === typeof L || !(A instanceof J))
                      throw A;
                  return A.Be
              }
          },
          m: function() {
              return ua
          },
          sa: pe,
          ra: function(a) {
              W.clear(a)
          },
          qa: function(a, b, c, d) {
              W.clearColor(a, b, c, d)
          },
          pa: function(a) {
              W.clearStencil(a)
          },
          oa: function() {
              W.finish()
          },
          na: function(a, b) {
              Nd(a, b, 0)
          },
          ma: qe,
          t: De,
          A: Ee,
          v: Fe,
          K: Ge,
          la: He,
          T: Ie,
          S: Je,
          R: Ke,
          x: Le,
          F: Me,
          u: Ne,
          E: Oe,
          ka: Pe,
          ja: Qe,
          ia: Re,
          ea: function(a) {
              a = B(a);
              a = window.localStorage.getItem(a);
              return Od(a || "")
          },
          da: function() {
              a: {
                  var a = Error();
                  if (!a.stack) {
                      try {
                          throw Error();
                      } catch (b) {
                          a = b
                      }
                      if (!a.stack) {
                          a = "(no stack trace available)";
                          break a
                      }
                  }
                  a = a.stack.toString()
              }
              return Od(a)
          },
          ca: function(a, b) {
              a = B(a);
              b = B(b);
              try {
                  return window.localStorage.setItem(a, b),
                  0
              } catch (c) {
                  return console.error(c),
                  1
              }
          },
          ba: function() {},
          n: function(a) {
              ua = a
          },
          aa: function(a, b, c, d) {
              return we(a, b, c, d)
          },
          Q: function(a) {
              var b = Date.now() / 1E3 | 0;
              a && (C[a >> 2 >>> 0] = b);
              return b
          }
      };
      (function() {
          function a(e) {
              h.asm = e.exports;
              wa = h.asm.Id;
              Ua();
              Va = h.asm.Rd;
              Xa.unshift(h.asm.Jd);
              bb--;
              h.monitorRunDependencies && h.monitorRunDependencies(bb);
              0 == bb && (null !== cb && (clearInterval(cb),
              cb = null),
              db && (e = db,
              db = null,
              e()))
          }
          function b(e) {
              a(e.instance)
          }
          function c(e) {
              return hb().then(function(f) {
                  return WebAssembly.instantiate(f, d)
              }).then(function(f) {
                  return f
              }).then(e, function(f) {
                  m("failed to asynchronously prepare wasm: " + f);
                  qa(f)
              })
          }
          var d = {
              a: Se
          };
          bb++;
          h.monitorRunDependencies && h.monitorRunDependencies(bb);
          if (h.instantiateWasm)
              try {
                  return h.instantiateWasm(d, a)
              } catch (e) {
                  return m("Module.instantiateWasm callback failed with error: " + e),
                  !1
              }
          (function() {
              return va || "function" !== typeof WebAssembly.instantiateStreaming || eb() || F.startsWith("file://") || "function" !== typeof fetch ? c(b) : fetch(F, {
                  credentials: "same-origin"
              }).then(function(e) {
                  return WebAssembly.instantiateStreaming(e, d).then(b, function(f) {
                      m("wasm streaming compile failed: " + f);
                      m("falling back to ArrayBuffer instantiation");
                      return c(b)
                  })
              })
          }
          )().catch(ba);
          return {}
      }
      )();
      h.___wasm_call_ctors = function() {
          return (h.___wasm_call_ctors = h.asm.Jd).apply(null, arguments)
      }
      ;
      h._OnCommandFB = function() {
          return (h._OnCommandFB = h.asm.Kd).apply(null, arguments)
      }
      ;
      h._loadResourceLib = function() {
          return (h._loadResourceLib = h.asm.Ld).apply(null, arguments)
      }
      ;
      h._loadResourceFont = function() {
          return (h._loadResourceFont = h.asm.Md).apply(null, arguments)
      }
      ;
      h._loadResourceImage = function() {
          return (h._loadResourceImage = h.asm.Nd).apply(null, arguments)
      }
      ;
      var $c = h._free = function() {
          return ($c = h._free = h.asm.Od).apply(null, arguments)
      }
        , Ra = h._malloc = function() {
          return (Ra = h._malloc = h.asm.Pd).apply(null, arguments)
      }
      ;
      h._main = function() {
          return (h._main = h.asm.Qd).apply(null, arguments)
      }
      ;
      var Be = h.___errno_location = function() {
          return (Be = h.___errno_location = h.asm.Sd).apply(null, arguments)
      }
        , Zc = h.___getTypeName = function() {
          return (Zc = h.___getTypeName = h.asm.Td).apply(null, arguments)
      }
      ;
      h.___embind_register_native_and_builtin_types = function() {
          return (h.___embind_register_native_and_builtin_types = h.asm.Ud).apply(null, arguments)
      }
      ;
      var rb = h.__get_tzname = function() {
          return (rb = h.__get_tzname = h.asm.Vd).apply(null, arguments)
      }
        , qb = h.__get_daylight = function() {
          return (qb = h.__get_daylight = h.asm.Wd).apply(null, arguments)
      }
        , pb = h.__get_timezone = function() {
          return (pb = h.__get_timezone = h.asm.Xd).apply(null, arguments)
      }
        , x = h.stackSave = function() {
          return (x = h.stackSave = h.asm.Yd).apply(null, arguments)
      }
        , y = h.stackRestore = function() {
          return (y = h.stackRestore = h.asm.Zd).apply(null, arguments)
      }
        , Ba = h.stackAlloc = function() {
          return (Ba = h.stackAlloc = h.asm._d).apply(null, arguments)
      }
        , Z = h._setThrew = function() {
          return (Z = h._setThrew = h.asm.$d).apply(null, arguments)
      }
        , Hb = h._memalign = function() {
          return (Hb = h._memalign = h.asm.ae).apply(null, arguments)
      }
      ;
      h.dynCall_viji = function() {
          return (h.dynCall_viji = h.asm.be).apply(null, arguments)
      }
      ;
      h.dynCall_vijiii = function() {
          return (h.dynCall_vijiii = h.asm.ce).apply(null, arguments)
      }
      ;
      h.dynCall_viiiiij = function() {
          return (h.dynCall_viiiiij = h.asm.de).apply(null, arguments)
      }
      ;
      h.dynCall_jiiiijiiiii = function() {
          return (h.dynCall_jiiiijiiiii = h.asm.ee).apply(null, arguments)
      }
      ;
      h.dynCall_viiij = function() {
          return (h.dynCall_viiij = h.asm.fe).apply(null, arguments)
      }
      ;
      h.dynCall_jii = function() {
          return (h.dynCall_jii = h.asm.ge).apply(null, arguments)
      }
      ;
      h.dynCall_iiij = function() {
          return (h.dynCall_iiij = h.asm.he).apply(null, arguments)
      }
      ;
      h.dynCall_iiiij = function() {
          return (h.dynCall_iiiij = h.asm.ie).apply(null, arguments)
      }
      ;
      h.dynCall_viij = function() {
          return (h.dynCall_viij = h.asm.je).apply(null, arguments)
      }
      ;
      h.dynCall_ji = function() {
          return (h.dynCall_ji = h.asm.ke).apply(null, arguments)
      }
      ;
      h.dynCall_iij = function() {
          return (h.dynCall_iij = h.asm.le).apply(null, arguments)
      }
      ;
      h.dynCall_vij = function() {
          return (h.dynCall_vij = h.asm.me).apply(null, arguments)
      }
      ;
      h.dynCall_jiiii = function() {
          return (h.dynCall_jiiii = h.asm.ne).apply(null, arguments)
      }
      ;
      h.dynCall_jiiiiii = function() {
          return (h.dynCall_jiiiiii = h.asm.oe).apply(null, arguments)
      }
      ;
      h.dynCall_jiiiiji = function() {
          return (h.dynCall_jiiiiji = h.asm.pe).apply(null, arguments)
      }
      ;
      h.dynCall_iijj = function() {
          return (h.dynCall_iijj = h.asm.qe).apply(null, arguments)
      }
      ;
      h.dynCall_jiji = function() {
          return (h.dynCall_jiji = h.asm.re).apply(null, arguments)
      }
      ;
      h.dynCall_viiiij = function() {
          return (h.dynCall_viiiij = h.asm.se).apply(null, arguments)
      }
      ;
      h.dynCall_viijii = function() {
          return (h.dynCall_viijii = h.asm.te).apply(null, arguments)
      }
      ;
      h.dynCall_iiiiij = function() {
          return (h.dynCall_iiiiij = h.asm.ue).apply(null, arguments)
      }
      ;
      h.dynCall_iiiiijj = function() {
          return (h.dynCall_iiiiijj = h.asm.ve).apply(null, arguments)
      }
      ;
      h.dynCall_iiiiiijj = function() {
          return (h.dynCall_iiiiiijj = h.asm.we).apply(null, arguments)
      }
      ;
      function De(a, b) {
          var c = x();
          try {
              return H(a)(b)
          } catch (d) {
              y(c);
              if (d !== d + 0 && "longjmp" !== d)
                  throw d;
              Z(1, 0)
          }
      }
      function Ee(a, b, c) {
          var d = x();
          try {
              return H(a)(b, c)
          } catch (e) {
              y(d);
              if (e !== e + 0 && "longjmp" !== e)
                  throw e;
              Z(1, 0)
          }
      }
      function Ne(a, b, c, d) {
          var e = x();
          try {
              H(a)(b, c, d)
          } catch (f) {
              y(e);
              if (f !== f + 0 && "longjmp" !== f)
                  throw f;
              Z(1, 0)
          }
      }
      function Fe(a, b, c, d) {
          var e = x();
          try {
              return H(a)(b, c, d)
          } catch (f) {
              y(e);
              if (f !== f + 0 && "longjmp" !== f)
                  throw f;
              Z(1, 0)
          }
      }
      function Le(a, b) {
          var c = x();
          try {
              H(a)(b)
          } catch (d) {
              y(c);
              if (d !== d + 0 && "longjmp" !== d)
                  throw d;
              Z(1, 0)
          }
      }
      function Me(a, b, c) {
          var d = x();
          try {
              H(a)(b, c)
          } catch (e) {
              y(d);
              if (e !== e + 0 && "longjmp" !== e)
                  throw e;
              Z(1, 0)
          }
      }
      function He(a, b, c, d, e, f) {
          var g = x();
          try {
              return H(a)(b, c, d, e, f)
          } catch (l) {
              y(g);
              if (l !== l + 0 && "longjmp" !== l)
                  throw l;
              Z(1, 0)
          }
      }
      function Oe(a, b, c, d, e) {
          var f = x();
          try {
              H(a)(b, c, d, e)
          } catch (g) {
              y(f);
              if (g !== g + 0 && "longjmp" !== g)
                  throw g;
              Z(1, 0)
          }
      }
      function Ie(a, b, c, d, e, f, g) {
          var l = x();
          try {
              return H(a)(b, c, d, e, f, g)
          } catch (n) {
              y(l);
              if (n !== n + 0 && "longjmp" !== n)
                  throw n;
              Z(1, 0)
          }
      }
      function Ge(a, b, c, d, e) {
          var f = x();
          try {
              return H(a)(b, c, d, e)
          } catch (g) {
              y(f);
              if (g !== g + 0 && "longjmp" !== g)
                  throw g;
              Z(1, 0)
          }
      }
      function Pe(a, b, c, d, e, f) {
          var g = x();
          try {
              H(a)(b, c, d, e, f)
          } catch (l) {
              y(g);
              if (l !== l + 0 && "longjmp" !== l)
                  throw l;
              Z(1, 0)
          }
      }
      function Re(a, b, c, d, e, f, g, l, n, q) {
          var t = x();
          try {
              H(a)(b, c, d, e, f, g, l, n, q)
          } catch (v) {
              y(t);
              if (v !== v + 0 && "longjmp" !== v)
                  throw v;
              Z(1, 0)
          }
      }
      function Qe(a, b, c, d, e, f, g) {
          var l = x();
          try {
              H(a)(b, c, d, e, f, g)
          } catch (n) {
              y(l);
              if (n !== n + 0 && "longjmp" !== n)
                  throw n;
              Z(1, 0)
          }
      }
      function Je(a, b, c, d, e, f, g, l, n, q) {
          var t = x();
          try {
              return H(a)(b, c, d, e, f, g, l, n, q)
          } catch (v) {
              y(t);
              if (v !== v + 0 && "longjmp" !== v)
                  throw v;
              Z(1, 0)
          }
      }
      function Ke(a) {
          var b = x();
          try {
              H(a)()
          } catch (c) {
              y(b);
              if (c !== c + 0 && "longjmp" !== c)
                  throw c;
              Z(1, 0)
          }
      }
      h.cwrap = function(a, b, c, d) {
          c = c || [];
          var e = c.every(function(f) {
              return "number" === f
          });
          return "string" !== b && e && !d ? ya(a) : function() {
              return za(a, b, c, arguments)
          }
      }
      ;
      h.AsciiToString = Ga;
      h.allocateUTF8 = Qa;
      var Te;
      function ra(a) {
          this.name = "ExitStatus";
          this.message = "Program terminated with exit(" + a + ")";
          this.status = a
      }
      db = function Ue() {
          Te || Ve();
          Te || (db = Ue)
      }
      ;
      function Ve() {
          function a() {
              if (!Te && (Te = !0,
              h.calledRun = !0,
              !xa)) {
                  h.noFSInit || pc || (pc = !0,
                  oc(),
                  h.stdin = h.stdin,
                  h.stdout = h.stdout,
                  h.stderr = h.stderr,
                  h.stdin ? rc("stdin", h.stdin) : hc("/dev/tty", "/dev/stdin"),
                  h.stdout ? rc("stdout", null, h.stdout) : hc("/dev/tty", "/dev/stdout"),
                  h.stderr ? rc("stderr", null, h.stderr) : hc("/dev/tty1", "/dev/stderr"),
                  kc("/dev/stdin", 0),
                  kc("/dev/stdout", 1),
                  kc("/dev/stderr", 1));
                  Rb = !1;
                  kb(Xa);
                  kb(Ya);
                  aa(h);
                  if (h.onRuntimeInitialized)
                      h.onRuntimeInitialized();
                  if (We) {
                      var b = h._main;
                      try {
                          var c = b(0, 0);
                          Ce(c)
                      } catch (d) {
                          d instanceof ra || "unwind" == d || ha(1, d)
                      } finally {}
                  }
                  if (h.postRun)
                      for ("function" == typeof h.postRun && (h.postRun = [h.postRun]); h.postRun.length; )
                          b = h.postRun.shift(),
                          $a.unshift(b);
                  kb($a)
              }
          }
          if (!(0 < bb)) {
              if (h.preRun)
                  for ("function" == typeof h.preRun && (h.preRun = [h.preRun]); h.preRun.length; )
                      ab();
              kb(Wa);
              0 < bb || (h.setStatus ? (h.setStatus("Running..."),
              setTimeout(function() {
                  setTimeout(function() {
                      h.setStatus("")
                  }, 1);
                  a()
              }, 1)) : a())
          }
      }
      h.run = Ve;
      function Ce(a) {
          if (!(noExitRuntime || 0 < sa)) {
              if (h.onExit)
                  h.onExit(a);
              xa = !0
          }
          ha(a, new ra(a))
      }
      if (h.preInit)
          for ("function" == typeof h.preInit && (h.preInit = [h.preInit]); 0 < h.preInit.length; )
              h.preInit.pop()();
      var We = !0;
      h.noInitialRun && (We = !1);
      Ve();

      return createMasterKitModule.ready
  }
  );
}
)();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = createMasterKitModule;
else if (typeof define === 'function' && define['amd'])
  define([], function() {
      return createMasterKitModule;
  });
else if (typeof exports === 'object')
  exports["createMasterKitModule"] = createMasterKitModule;
