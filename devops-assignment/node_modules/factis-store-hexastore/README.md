![](http://factis.io/logo-01.png "Factis database system")

Be sure to check [http://factis.io](http://factis.io) for more information and documentation !

# Factis store hexastore

This module is a datastore for [Factis](http://factis.io), the modular database system.

The hexastore store allows store arbitrary triples, like a RDF database.

## Installation

Using NPM

    npm install factis-store-hexastore

## Usage

Require the module

    var FactisHexastore = require('factis-store-hexastore');

Create a new store

    var hexastore = new FactisHexastore();

You can add and remove triples from the store

    hexastore.add(["this","is a","triple"]);
    hexastore.remove(["this","is a","triple"]);

Check the documentation on [factis.io](http://factis.io)
