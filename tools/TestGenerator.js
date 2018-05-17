module.exports = function (pkg) {
	const Fs = require("fs");
	const Path = require("path");

	//function TestsGenerator (pkg) {
		var testsFolder = pkg.directories.tests || "tests/";
		if (!testsFolder.endsWith("/")) {testsFolder += "/"}
		var outputFile = (pkg.directories.dist.endsWith("/") ? pkg.directories.dist : pkg.directories.dist+"/")+"Test-"+pkg.version+".js";
		var pkgSource = Fs.readFileSync((pkg.directories.dist.endsWith("/") ? pkg.directories.dist : pkg.directories.dist+"/")+pkg.name+"-"+pkg.version+".min.js", "utf8");

		//Object.defineProperty(this, "Generate", {configurable: false, enumberable: false, value: function () {
			var names = [], output = [];
			Fs.readdirSync(testsFolder).forEach(function (f) {
				if (Fs.statSync(testsFolder+f).isFile()) {
					var test = Import(testsFolder+f);
					names.push("Tests[\"" + test.name + "\"]();");
					output.push("Tests[\"" + test.name + "\"] = " + test.code);
				}
			});

			Fs.writeFileSync(outputFile, pkgSource + "\r\n\r\nvar Tests = {};\r\n\r\n" + output.join("\r\n\r\n") + "\r\n\r\n" + names.join("\r\n") + "\r\n", "utf8");

		//}});

		//return this;

	//}

	function Import (file) {
		return {
			name: Path.basename(file, Path.extname(file)),
			code: "function () {\r\n" + "\t" + Fs.readFileSync(file, "utf8").replace(/^\s*/, "").replace(/^\s*$/, "").split("\r\n").join("\n"+"\t") + "\r\n}"
		};
		
	}

	//return new TestsGenerator(path);

}
