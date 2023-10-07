import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const BASE_PATH = "src/assets";
const EXTENSION = ".svg";
const ICON_LIB = `${BASE_PATH}/parameter-icons.json`;

class Category {
	name = null;
	icons = [];
	categories = [];

	addCategory(name) {
		console.log(`adding cat ${name} to ${this.name}`);
		const cat = new Category();
		cat.name = name;
		this.categories.push(cat);
		return cat;
	}
	addIcon(name) {
		console.log(`adding icon ${name} to ${this.name}`);
		this.icons.push(name);
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
		}
		console.log(`read: ${iconlib}`);
		return iconlib as Category;
	});
}
async function writeIconLib(iconlib) {
	return writeFile(ICON_LIB, JSON.stringify(iconlib), { flag: "w" }).then(
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
	for (const dirent of await readdir(path, { withFileTypes: true }))
		if (dirent.isDirectory()) {
			let curCat = cat.addCategory(dirent.name);
			//			yield* ls(join(path, dirent.name), curCat);
			ls(join(path, dirent.name), curCat);
		} else {
			if (dirent.isFile() && dirent.name.endsWith(EXTENSION)) {
				cat.addIcon(join(path, dirent.name));
				//				yield join(path, dirent.name);
				join(path, dirent.name);
			}
		}
}

async function* empty() {}

async function toArray(iter = empty(), lib) {
	let r = [];
	//for await (const x of iter) r.push(x);
	await iter;
	await writeIconLib(lib);
	console.log(`lib2: ${lib}`);
	return r;
}
openIconLib()
	.then((lib) => {
		console.log(`lib1: ${lib}`);
		toArray(ls("src/assets", lib), lib);
	})
	.then(console.log, console.error);
