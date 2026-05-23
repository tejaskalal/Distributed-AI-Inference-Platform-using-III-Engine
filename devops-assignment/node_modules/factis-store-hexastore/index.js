
function Hexastore() {
  this.spo = {};
  this.sop = {};
  this.pso = {};
  this.pos = {};
  this.osp = {};
  this.ops = {};
}

// Export a database to a string
Hexastore.prototype.exportString = function() {
  return JSON.stringify(this.spo);
};
// Import a database previously exported to a string
Hexastore.prototype.importString = function(str) {
  try {
    this.addSPO(JSON.parse(str));
  } catch (err) {}
};
// Add triples to the store, with input data nested as subjects containing predicates containing objects containing values
Hexastore.prototype.addSPO = function(element) {
  var subj = element;
  for (var subject in subj) {
    if (subj.hasOwnProperty(subject)) {
      var pred = subj[subject];
      for (var predicate in pred) {
        if (pred.hasOwnProperty(predicate)) {
          var obj = pred[predicate];
          for (var object in obj) {
            if (obj.hasOwnProperty(object)) {
              var val = obj[object];
              this.add([subject, predicate, object, val]);
            }
          }
        }
      }
    }
  }
};


// get the size of the hexastore
Hexastore.prototype.size = function() {
  var count = 0;
  for (var s in this.spo) {
    if (this.spo.hasOwnProperty(s)) {
      for (var p in this.spo[s]) {
        if (this.spo[s].hasOwnProperty(p)) {
          for (var o in this.spo[s][p]) {
            if (this.spo[s][p].hasOwnProperty(o)) {
              if (this.spo[s][p][o] !== undefined) {
                count++;
              }
            }
          }
        }
      }
    }
  }
  return count;
};



// Export a database to JSON file
Hexastore.prototype.exportJSON = function(dbname) {
  fs.writeFileSync(dbname + ".json", JSON.stringify(this.spo));
};
// Import a database previously exported with exportJSON
Hexastore.prototype.importJSON = function(dbname) {
  try {
    this.addSPO(JSON.parse(fs.readFileSync(dbname + ".json")));
  } catch (err) {}
};


// Export a database to a NT file
Hexastore.prototype.exportNt = function(ntname) {
  var res = this.all();
  var str = "";
  for (var i = 0; i < res.length; i++) {
    str = str + res[i][0] + ' ' + res[i][1] + ' ' + res[i][2] + ' ' + JSON.stringify(res[i][3]) + '\n';
  }
  fs.writeFileSync(ntname + ".nt", str);
};
// Import a database in a NT file
Hexastore.prototype.importNt = function(ntname, callback) {
  function readLines(input, func) {
    var remaining = '';

    input.on('data', function(data) {
      remaining += data;
      var index = remaining.indexOf('\n');
      while (index > -1) {
        var line = remaining.substring(0, index);
        remaining = remaining.substring(index + 1);

        func(line);

        index = remaining.indexOf('\n');
      }
    });

    input.on('end', function() {
      if (remaining.length > 0) {
        func(remaining);
      }
      if (callback !== undefined && callback !== null) {
        callback();
      }
    });
  }

  var that = this;

  function func(line) {
    var elements = line.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g);
    try {
      elements[3] = JSON.parse(elements[3]);
    } catch (err) {}
    that.add(elements);
  }

  var input = fs.createReadStream(ntname + '.nt');
  readLines(input, func);
};


// Add a single triple to the store
Hexastore.prototype.add = function(element) {
  var s = element[0];
  var p = element[1];
  var o = element[2];
  var v = element[3] ? element[3] : true;
  if (this.spo[s] === undefined) {
    this.spo[s] = {};
  }
  if (this.spo[s][p] === undefined) {
    this.spo[s][p] = {};
  }
  this.spo[s][p][o] = v;
  if (this.sop[s] === undefined) {
    this.sop[s] = {};
  }
  if (this.sop[s][o] === undefined) {
    this.sop[s][o] = {};
  }
  this.sop[s][o][p] = v;
  if (this.pso[p] === undefined) {
    this.pso[p] = {};
  }
  if (this.pso[p][s] === undefined) {
    this.pso[p][s] = this.spo[s][p];
  }
  if (this.pos[p] === undefined) {
    this.pos[p] = {};
  }
  if (this.pos[p][o] === undefined) {
    this.pos[p][o] = {};
  }
  this.pos[p][o][s] = v;
  if (this.osp[o] === undefined) {
    this.osp[o] = {};
  }
  if (this.osp[o][s] === undefined) {
    this.osp[o][s] = this.sop[s][o];
  }
  if (this.ops[o] === undefined) {
    this.ops[o] = {};
  }
  if (this.ops[o][p] === undefined) {
    this.ops[o][p] = this.pos[p][o];
  }
};

Hexastore.prototype.remove = function(element) {
  var s = element[0];
  var p = element[1];
  var o = element[2];
  var v = element[3] ? element[3] : true;
  var subj = this.spo;
  if (subj !== undefined) {
    var pred = subj[s];
    if (pred !== undefined) {
      var obj = pred[p];
      if (obj !== undefined) {
        var val = obj[o];
        if (val !== undefined) {
          delete this.spo[s][p][o];
          delete this.sop[s][o][p];
          delete this.pso[p][s][o];
          delete this.pos[p][o][s];
          delete this.osp[o][s][p];
          delete this.ops[o][p][s];
        }
      }
    }
  }
};

// Query the store for all facts with nothing specific (all facts)
Hexastore.prototype.queryXXX = function(element) {

  var res = [];

  var subj = this.spo;
  if (subj !== undefined) {
    for (var subject in subj) {
      if (subj.hasOwnProperty(subject)) {
        var pred = subj[subject];
        if (pred !== undefined) {
          for (var predicate in pred) {
            if (pred.hasOwnProperty(predicate)) {
              var obj = pred[predicate];
              if (obj !== undefined) {
                for (var object in obj) {
                  if (obj.hasOwnProperty(object)) {
                    var val = obj[object];
                    if (val !== undefined) {
                      res.push([subject, predicate, object, val]);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return res;
};

// Query the store for all facts with specific subject
Hexastore.prototype.querySXX = function(element) {
  var s = element[0];

  var res = [];

  var subj = this.spo;
  if (subj !== undefined) {
    var pred = subj[s];
    if (pred !== undefined) {
      for (var predicate in pred) {
        if (pred.hasOwnProperty(predicate)) {
          var obj = pred[predicate];
          if (obj !== undefined) {
            for (var object in obj) {
              if (obj.hasOwnProperty(object)) {
                var val = obj[object];
                if (val !== undefined) {
                  res.push([s, predicate, object, val]);
                }
              }
            }
          }
        }
      }
    }
  }
  return res;
};

// Query the store for all facts with specific predicate
Hexastore.prototype.queryXPX = function(element) {
  var p = element[1];

  var res = [];

  var pred = this.pso;
  if (pred !== undefined) {
    var subj = pred[p];
    if (subj !== undefined) {
      for (var subject in subj) {
        if (subj.hasOwnProperty(subject)) {
          var obj = subj[subject];
          if (obj !== undefined) {
            for (var object in obj) {
              if (obj.hasOwnProperty(object)) {
                var val = obj[object];
                if (val !== undefined) {
                  res.push([subject, p, object, val]);
                }
              }
            }
          }
        }
      }
    }
  }
  return res;
};

// Query the store for all facts with specific object
Hexastore.prototype.queryXXO = function(element) {
  var o = element[2];

  var res = [];

  var obj = this.ops;
  if (obj !== undefined) {
    var pred = obj[o];
    if (pred !== undefined) {
      for (var predicate in pred) {
        if (pred.hasOwnProperty(predicate)) {
          var subj = pred[predicate];
          if (subj !== undefined) {
            for (var subject in subj) {
              if (subj.hasOwnProperty(subject)) {
                var val = subj[subject];
                if (val !== undefined) {
                  res.push([subject, predicate, o, val]);
                }
              }
            }
          }
        }
      }
    }
  }
  return res;
};

// Query the store for all facts with specific subject and predicate
Hexastore.prototype.querySPX = function(element) {
  var s = element[0];
  var p = element[1];

  var res = [];

  var subj = this.spo;
  if (subj !== undefined) {
    var pred = subj[s];
    if (pred !== undefined) {
      var obj = pred[p];
      if (obj !== undefined) {
        for (var object in obj) {
          if (obj.hasOwnProperty(object)) {
            var val = obj[object];
            if (val !== undefined) {
              res.push([s, p, object, val]);
            }
          }
        }
      }
    }
  }
  return res;
};

// Query the store for all facts with specific predicate and object
Hexastore.prototype.queryXPO = function(element) {
  var p = element[1];
  var o = element[2];

  var res = [];

  var pred = this.pos;
  if (pred !== undefined) {
    var obj = pred[p];
    if (obj !== undefined) {
      var subj = obj[o];
      if (subj !== undefined) {
        for (var subject in subj) {
          if (subj.hasOwnProperty(subject)) {
            var val = subj[subject];
            if (val !== undefined) {
              res.push([subject, p, o, val]);
            }
          }
        }
      }
    }
  }
  return res;
};

// Query the store for all facts with specific subject and object
Hexastore.prototype.querySXO = function(element) {
  var s = element[0];
  var o = element[2];

  var res = [];

  var subj = this.sop;
  if (subj !== undefined) {
    var obj = subj[s];
    if (obj !== undefined) {
      var pred = obj[o];
      if (pred !== undefined) {
        for (var predicate in pred) {
          if (pred.hasOwnProperty(predicate)) {
            var val = pred[predicate];
            if (val !== undefined) {
              res.push([s, predicate, o, val]);
            }
          }
        }
      }
    }
  }
  return res;
};

// Query the store for all facts with specific subject predicate and object (get values of this fact)
Hexastore.prototype.querySPO = function(element) {
  var s = element[0];
  var p = element[1];
  var o = element[2];

  var res = [];

  var subj = this.spo;
  if (subj !== undefined) {
    var pred = subj[s];
    if (pred !== undefined) {
      var obj = pred[p];
      if (obj !== undefined) {
        var val = obj[o];
        if (val !== undefined) {
          res.push([s, p, o, val]);
        }
      }
    }
  }
  return res;
};





// When you export a module, just make sure it has "query" functions working.
module.exports = Hexastore;
