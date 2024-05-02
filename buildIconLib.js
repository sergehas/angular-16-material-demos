const { resolve, extname, join } = require("node:path");
const { readdir, readFile, writeFile } = require("node:fs/promises");

// root folder to build relative paths from
const RELATIVE_PATH = "src";
// base bas to walk
const BASE_PATH = join(RELATIVE_PATH, "assets");
// icon exctension
const EXTENSION = ".svg";
const ICON_LIB = join(BASE_PATH, "iconlib.json");

class Category {
	name = null;
	icons = [];
	categories = [];

	static from(obj) {
		return Object.assign(new Category(), obj);
	}

	addCategory(name) {
		console.debug(`adding cat ${name} to ${this.name}`);
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
		console.debug(`adding icon ${iconPath} to ${this.name}`);
		let p = iconPath.substring(RELATIVE_PATH.length + 1);
		const existing = this.icons.find((i) => i.name === p);
		if (!existing) {
			this.icons.push(p);
		}
		return this;
	}
}

async function openIconLib() {
	return readFile(ICON_LIB, { flag: "a" }).then((file) => {
		let iconlib;
		try {
			iconlib = JSON.parse(file);
		} catch (error) {
			console.log("unparsable lib");
			iconlib = new Category();
			iconlib.name = "root";
		}
		console.log("read: ", iconlib);
		return Category.from(iconlib);
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
	console.log(`populating ${cat.name}`);
	for (const dirent of await readdir(path, { withFileTypes: true })) {
		if (dirent.isDirectory()) {
			let curCat = cat.addCategory(dirent.name);
			//			yield* ls(join(path, dirent.name), curCat);
			await ls(join(path, dirent.name), curCat);
		} else {
			if (dirent.isFile() && EXTENSION === extname(dirent.name)) {
				cat.addIcon(join(path, dirent.name));
				//				yield join(path, dirent.name);
				join(path, dirent.name);
			}
		}
	}
	return cat;
}

(async () => {
	let lib = await openIconLib();
	// lib = await ls(join(BASE_PATH, "countries"), lib);
	// lib = await ls(join(BASE_PATH, "brands"), lib);
	lib = await ls(join(BASE_PATH, "/"), lib);
	writeIconLib(lib).then(console.log, console.error);
})();
