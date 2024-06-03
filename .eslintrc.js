/** @type { import("eslint").Linter.Config } */
const config = {
	extends: [
		'./node_modules\\dts-cli\\conf\\eslint-config-react-app\\index.js',
		'./node_modules\\eslint-config-prettier\\index.js',
		'plugin:prettier/recommended',
	],
};

module.exports = config;
