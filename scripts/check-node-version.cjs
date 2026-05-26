const major = Number(process.versions.node.split('.')[0]);

if (major !== 22) {
	console.error(
		`This project requires Node.js 22.x. Current version: ${process.version}. Run "nvm use" from the repo root and try again.`,
	);
	process.exit(1);
}
