const { extname, posix } = require("node:path");
const { readdir, readFile, writeFile } = require("node:fs/promises");

// root folder to build relative paths from
const RELATIVE_PATH = "src";
// base bas to walk
const BASE_PATH = posix.join(RELATIVE_PATH, "assets");
// icon extension
const EXTENSION = ".svg";
const ICON_LIB = posix.join(BASE_PATH, "iconLib.json");

class Category {
  name = null;
  icons = [];
  categories = [];

  static from(obj) {
    return Object.assign(new Category(), obj);
  }

  addCategory(name) {
    console.debug(`[iconLib] adding cat ${name} to ${this.name}`);
    const existing = this.categories.find((i) => i.name === name);
    if (existing && existing instanceof Category) {
      return Category.from(existing);
    }
    const cat = new Category();
    cat.name = name;
    this.categories.push(cat);
    return cat;
  }
  addIcon(iconPath) {
    console.debug(`[iconLib] adding icon ${iconPath} to ${this.name}`);
    let p = iconPath.substring(RELATIVE_PATH.length + 1);
    const existing = this.icons.find((i) => i === p);
    if (!existing) {
      this.icons.push(p);
    }
    return this;
  }
}

async function openIconLib() {
  console.log("[iconLib] opening lib file");

  return readFile(ICON_LIB, {
    encoding: "utf8",
    // flag: "a"
  })
    .then((file) => {
      let iconLib;
      try {
        iconLib = JSON.parse(file);
      } catch (_e) {
        console.log("[iconLib] unparsable lib");
        iconLib = new Category();
        iconLib.name = "root";
      }
      console.log("[iconLib] read: ", iconLib);
      return Category.from(iconLib);
    })
    .catch((e) => {
      console.log(`[iconLib] unreadable file ${ICON_LIB}, ${e}`);
      throw e;
    });
}
async function writeIconLib(iconLib) {
  return writeFile(ICON_LIB, JSON.stringify(iconLib, null, 2), {
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
  console.log(`[iconLib] populating ${cat.name}`);
  for (const dirent of await readdir(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      let curCat = cat.addCategory(dirent.name);
      await ls(posix.join(path, dirent.name), curCat);
    } else if (dirent.isFile() && EXTENSION === extname(dirent.name)) {
      cat.addIcon(posix.join(path, dirent.name));
      posix.join(path, dirent.name);
    }
  }
  return cat;
}

(async () => {
  console.log("[iconLib] start building");
  let lib = await openIconLib();
  lib = await ls(posix.join(BASE_PATH, "/"), lib);
  writeIconLib(lib).then(console.log, console.error);
})();
