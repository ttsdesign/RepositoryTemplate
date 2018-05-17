var App = {Name: "Make",	Version: "1.0"};

Fs = require("fs");
var pkg = JSON.parse(Fs.readFileSync("package.json", "utf8"));

//////////////////////////////////////////////////////////////////////////////////
///// Process CLI ///////////////////////////////////////////////////////////////
var opts = GetOpts();
if (opts.includes("-v") || opts.includes("--version")) {Version()}
if (opts.includes("-h") || opts.includes("--help")) {Help()}
if (opts.includes("-t") || opts.includes("--targets")) {Targets()}

var validTarget = false, targets = GetTargets();
targets.forEach(function (target) {
	if (!pkg.targets.includes(target)) {Exit("Invalid Target: "+target)}
	else {validTarget = true}
});
if (!validTarget) {Exit("No valid target specified")}
//////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////
///// Main //////////////////////////////////////////////////////////////////////
targets.forEach(function (target) {
	Make(target)
});

function Make (target, required) {
	required = required || true;
	switch (target) {
		case "all":
			pkg.targets.forEach(function (target) {
				if (target != "all" && target != "clean") {
					Make(target);
				}
			});
			break;
		case "clean":
			Fs.readdirSync(pkg.directories.dist).forEach(function (f) {
				Fs.unlinkSync((pkg.directories.dist.endsWith("/") ? pkg.directories.dist : pkg.directories.dist+"/")+f);
			});
			break;
		case "docs":
			Make("lib", false);
			require("./tools/DocsGenerator.js")(pkg);
			break;
		case "examples":
			Make("lib", false);
			require("./tools/ExamplesGenerator.js")(pkg);
			break;
		case "lib":
			if (required || !Fs.existsSync((pkg.directories.dist.endsWith("/") ? pkg.directories.dist : pkg.directories.dist+"/")+pkg.name+"-"+pkg.version+".min.js")) {
				require("./tools/MakeImporter.js")(pkg, "lib");
			}
			break;
		case "tests":
			Make("lib", false);
			require("./tools/TestGenerator.js")(pkg);
			break;
		default:
			require("./tools/MakeImporter.js")(pkg, target);
	}
}
//////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////
///// Helper Functions /////////////////////////////////////////////////////////
function Exit (msg) {console.log(msg);	process.exit(1);}
function GetOpts () {var opts = [];for (var i=2; i<process.argv.length; i++) {if (process.argv[i].startsWith("-")) {opts.push(process.argv[i])}}return opts;}
function GetTargets () {var targets = [];for (var i=2; i<process.argv.length; i++) {if (!process.argv[i].startsWith("-")) {targets.push(process.argv[i])}}return targets;}
function Help () {console.log(App.Name+" Usage");console.log("\t...tbd...");process.exit(0);}
function Targets () {console.log("Targets: " + pkg.targets.join(", "));process.exit(0);}
function Version () {console.log(App.Name+" Version: "+App.Version);process.exit(0);}
//////////////////////////////////////////////////////////////////////////////////
