const { resolve, extname, posix } = require("node:path");
const { readdir, readFile, writeFile } = require("node:fs/promises");

// root folder to build relative paths from
const RELATIVE_PATH = "src";
// base bas to walk
const BASE_PATH = posix.join(RELATIVE_PATH, "assets");
// icon exctension
const EXTENSION = ".svg";
const ICON_LIB = posix.join(BASE_PATH, "iconlib.json");

class Category {
  name = null;
  icons = [];
  categories = [];

  static from(obj) {
    return Object.assign(new Category(), obj);
  }

  addCategory(name) {
    console.debug(`[iconlib] adding cat ${name} to ${this.name}`);
    const existing = this.categories.find((i) => i.name === name);
    existing instanceof Category;
    if (existing) {
      return Category.from(existing);
    }
    const cat = new Category();
    cat.name = name;
    this.categories.push(cat);
    return cat;
  }
  addIcon(iconPath) {
    console.debug(`[iconlib] adding icon ${iconPath} to ${this.name}`);
    let p = iconPath.substring(RELATIVE_PATH.length + 1);
    const existing = this.icons.find((i) => i === p);
    if (!existing) {
      this.icons.push(p);
    }
    return this;
  }
}

async function openIconLib() {
  console.log("[iconlib] opening lib file");

  return readFile(ICON_LIB, {
    encoding: "utf8",
    // flag: "a"
  })
    .then((file) => {
      let iconlib;
      try {
        iconlib = JSON.parse(file);
      } catch (error) {
        console.log("[iconlib] unparsable lib");
        iconlib = new Category();
        iconlib.name = "root";
      }
      console.log("[iconlib] read: ", iconlib);
      return Category.from(iconlib);
    })
    .catch((e) => {
      console.log(`[iconlib] unreadable file ${ICON_LIB}, ${e}`);
      throw e;
    });
}
async function writeIconLib(iconlib) {
  return writeFile(ICON_LIB, JSON.stringify(iconlib, null, 2), {
    flag: "w",
  }).then(
    () => {
      console.log(`[${ICON_LIB}] written`);
    },
    () => {
      console.error(`[${ICON_LIB}] write failure`);
    }
  );
}

async function ls(path = BASE_PATH, cat = new Category()) {
  //	yield path;
  console.log(`[iconlib] populating ${cat.name}`);
  for (const dirent of await readdir(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      let curCat = cat.addCategory(dirent.name);
      //			yield* ls(join(path, dirent.name), curCat);
      await ls(posix.join(path, dirent.name), curCat);
    } else {
      if (dirent.isFile() && EXTENSION === extname(dirent.name)) {
        cat.addIcon(posix.join(path, dirent.name));
        //				yield join(path, dirent.name);
        posix.join(path, dirent.name);
      }
    }
  }
  return cat;
}

(async () => {
  console.log("[iconlib] start building");
  let lib = await openIconLib();
  // lib = await ls(join(BASE_PATH, "countries"), lib);
  // lib = await ls(join(BASE_PATH, "brands"), lib);
  lib = await ls(posix.join(BASE_PATH, "/"), lib);
  writeIconLib(lib).then(console.log, console.error);
})();
