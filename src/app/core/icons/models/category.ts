export const NAMESPACE = "parameter";

export class Icon {
	name: string;
	path: string;

	/**
	 * build icon name form itis path:
	 *  1. remove "assets/" prefix
	 *  1. remove file extension
	 *  1. replce "/" by "-"
	 *  1. add icon registry namespace
	 *
	 *  example: "assets/level1/level2/icon.svg" : name = parameter:level1-level2-icon
	 *
	 */
	constructor(path: string) {
		this.path = path;
		this.name =
			NAMESPACE +
			":" +
			path
				.replace(/^assets\//, "")
				.replace(/\//g, "-")
				.replace(/\.[^.]+$/, "");
	}
  
}

export class Category {
	name: string;
	private _icons: Array<Icon> = [];
	categories: Array<Category> = [];

	constructor(name: string) {
		this.name = name;
	}

	addCategory(name: string): Category {
		const c = new Category(name);
		this.categories.push(c);
		return c;
	}
	addIcon(path: string): Icon {
		const i = new Icon(path);
		this._icons.push(i);
		return i;
	}

	get icons(): Icon[] {
		return this._icons;
	}
}
