module.exports = {
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	root: true,
	settings: {
		react: {version: "detect"}
	},
	rules: {
		"@typescript-eslint/no-non-null-assertion": "off"
	}
};
