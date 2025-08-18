const fs = require("fs")
const path = require("path")

if (process.argv[2] == "verify") {
	if (path.basename(process.cwd()) != "dist-package") {
		console.error("--------------------------")
		console.error("use 'npm run pub' instead")
		console.error("--------------------------")
		process.exit(1)
	}
}

if (process.argv[2] == "symlink") {
	process.chdir(__dirname)
	if (!fs.existsSync("dist")) {
		fs.mkdirSync("dist")
	}
	if (!fs.existsSync("link")) {
		fs.symlinkSync("dist", "link")
	}
	if (!fs.existsSync("dist/package.json")) {
		fs.symlinkSync("../package.json", "dist/package.json")
	}
}

if (process.argv[2] == "pre-publish") {
	process.chdir(__dirname)
	fs.rmSync("dist-package", {force: true, recursive: true})
	fs.mkdirSync("dist-package")
	fs.writeFileSync("dist-package/.npmignore", "publish.js")
	fs.copyFileSync("publish.js", "dist-package/publish.js")
	fs.copyFileSync("package.json", "dist-package/package.json")

	const autoInclude = fs.readdirSync(".").filter(x => /^(README|LICENSE|LICENCE)([.].+)?$/i.test(x))
	for (const item of autoInclude) {
		fs.copyFileSync(item, path.join("dist-package", item))
	}
}

if (process.argv[2] == "post-publish") {
	process.chdir(__dirname)
	fs.rmSync("dist-package", {force: true, recursive: true})
}
