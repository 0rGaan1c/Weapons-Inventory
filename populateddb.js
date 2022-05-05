#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Weapon = require("./models/weapon");
var Category = require("./models/category");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var weapons = [];
var categories = [];

function weaponCreate(name, description, category, price, quantity, cb) {
  weapondetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    quantity: quantity,
  };

  var weapon = new Weapon(weapondetail);

  weapon.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Weapon: " + weapon);
    weapons.push(weapon);
    cb(null, weapon);
  });
}

function categoryCreate(name, description, cb) {
  categorydetail = {
    name: name,
    description: description,
  };

  var category = new Category(categorydetail);

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category" + category);
    categories.push(category);
    cb(null, category);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          "Colossal Swords",
          "Colossal Swords are a type of Weapon in Elden Ring. Colossal Swords replace Ultra Greatswords from the Souls series, and usually weigh a lot, swing slowly, but deal tremendous damage. They usually require lots of Strength to wield, and some players prefer to 2-hand them.",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Katanas",
          "Katanas are a type of Weapon in Elden Ring. Katanas specializes in mid-range combat and are capable of inflicting slash and thrust attacks, as well as the Hemorrhage Status Effect in many cases, which can deal significant damage. Many players choose this weapon type for its unique moveset.",
          callback
        );
      },
    ],
    cb
  );
}

function createWeapons(cb) {
  async.parallel(
    [
      function (callback) {
        weaponCreate(
          "Uchigatana",
          "Uchigatana is a Katana in Elden Ring. The Uchigatana scales primarily with Strength and Dexterity and is a good Weapon for Piercing and Slash Damage in combat.",
          categories[1],
          69.99,
          10,
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Nagakiba",
          "Nagakiba is a Katana in Elden Ring. The Nagakiba scales primarily with Strength and Dexterity and is a good Weapon for dealing an extra blood loss effect on top of the initial Physical Damage this weapon causes.",
          categories[1],
          169.99,
          15,
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Rivers of Blood",
          "Rivers of Blood is a Katana in Elden Ring. The Rivers of Blood scales primarily with Strength, Dexterity, and Arcane and is a good Weapon for mid-range combat and it is capable of inflicting both Slash and Pierce attacks. The scaling was fixed in an update",
          categories[1],
          269.99,
          20,
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Zweihander",
          "Zweihander is a Colossal Sword in Elden Ring. The Zweihander scales primarily with Strength and Dexterity and is a good Weapon for heavy weight combat. This weapon, though heavy,  packs high attack stats dealing higher damage to enemies during combat.",
          categories[0],
          369.99,
          11,
          callback
        );
      },
      function (callback) {
        weaponCreate(
          "Greatsword",
          "Greatsword is a Colossal Sword in Elden Ring. The Greatsword scales primarily with Strength and is a good Weapon for cleaving many foes at once with its wide swings.",
          categories[0],
          469.99,
          30,
          callback
        );
      },
    ],
    cb
  );
}

async.series([createCategories, createWeapons], function (err, results) {
  if (err) {
    console.log("FINAL ERR: ", err);
  } else {
    console.log("Weapons: ", weapons);
  }

  mongoose.connection.close();
});
