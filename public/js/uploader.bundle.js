/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/uploader.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@uppy/core/dist/style.css":
/*!************************************************!*\
  !*** ./node_modules/@uppy/core/dist/style.css ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var content = __webpack_require__(/*! !../../../css-loader/dist/cjs.js!./style.css */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/@uppy/core/dist/style.css\");\n\nif (typeof content === 'string') {\n  content = [[module.i, content, '']];\n}\n\nvar options = {}\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = __webpack_require__(/*! ../../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\")(content, options);\n\nif (content.locals) {\n  module.exports = content.locals;\n}\n\n\n//# sourceURL=webpack:///./node_modules/@uppy/core/dist/style.css?");

/***/ }),

/***/ "./node_modules/@uppy/core/lib/index.js":
/*!**********************************************!*\
  !*** ./node_modules/@uppy/core/lib/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: ENOENT: no such file or directory, open 'C:\\\\Users\\\\Alexander\\\\Documents\\\\GitHub\\\\femto-apps\\\\web-file-uploader\\\\node_modules\\\\@uppy\\\\core\\\\lib\\\\index.js'\");\n\n//# sourceURL=webpack:///./node_modules/@uppy/core/lib/index.js?");

/***/ }),

/***/ "./node_modules/@uppy/dashboard/dist/style.css":
/*!*****************************************************!*\
  !*** ./node_modules/@uppy/dashboard/dist/style.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var content = __webpack_require__(/*! !../../../css-loader/dist/cjs.js!./style.css */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/@uppy/dashboard/dist/style.css\");\n\nif (typeof content === 'string') {\n  content = [[module.i, content, '']];\n}\n\nvar options = {}\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = __webpack_require__(/*! ../../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\")(content, options);\n\nif (content.locals) {\n  module.exports = content.locals;\n}\n\n\n//# sourceURL=webpack:///./node_modules/@uppy/dashboard/dist/style.css?");

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/index.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: ENOENT: no such file or directory, open 'C:\\\\Users\\\\Alexander\\\\Documents\\\\GitHub\\\\femto-apps\\\\web-file-uploader\\\\node_modules\\\\@uppy\\\\dashboard\\\\lib\\\\index.js'\");\n\n//# sourceURL=webpack:///./node_modules/@uppy/dashboard/lib/index.js?");

/***/ }),

/***/ "./node_modules/@uppy/xhr-upload/lib/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@uppy/xhr-upload/lib/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: ENOENT: no such file or directory, open 'C:\\\\Users\\\\Alexander\\\\Documents\\\\GitHub\\\\femto-apps\\\\web-file-uploader\\\\node_modules\\\\@uppy\\\\xhr-upload\\\\lib\\\\index.js'\");\n\n//# sourceURL=webpack:///./node_modules/@uppy/xhr-upload/lib/index.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/@uppy/core/dist/style.css":
/*!**************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/@uppy/core/dist/style.css ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/css-loader/dist/cjs.js):\\nError: ENOENT: no such file or directory, open 'C:\\\\Users\\\\Alexander\\\\Documents\\\\GitHub\\\\femto-apps\\\\web-file-uploader\\\\node_modules\\\\@uppy\\\\core\\\\dist\\\\style.css'\");\n\n//# sourceURL=webpack:///./node_modules/@uppy/core/dist/style.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/@uppy/dashboard/dist/style.css":
/*!*******************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/@uppy/dashboard/dist/style.css ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/css-loader/dist/cjs.js):\\nError: ENOENT: no such file or directory, open 'C:\\\\Users\\\\Alexander\\\\Documents\\\\GitHub\\\\femto-apps\\\\web-file-uploader\\\\node_modules\\\\@uppy\\\\dashboard\\\\dist\\\\style.css'\");\n\n//# sourceURL=webpack:///./node_modules/@uppy/dashboard/dist/style.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/css/uploader.css":
/*!********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/css/uploader.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\")(false);\n// Module\nexports.push([module.i, \":root {\\r\\n    --color-highlight: #0DB4CE;\\r\\n    --color-highlight-accent: #19647E;\\r\\n    --color-highlight-hover: #19647E;\\r\\n    --color-highlight-secondary: #EEC643;\\r\\n\\r\\n    --color-primary-bg: #202020;\\r\\n    --color-primary-fg: #d1d2d3;\\r\\n    --color-inverted-bg: #d1d2d3;\\r\\n    --color-inverted-fg: #1a1d21;\\r\\n    --color-secondary-bg: #292c33;\\r\\n\\r\\n    --color-foreground-max: #9a9c9e;\\r\\n    --color-foreground-high: #75777a;\\r\\n    --color-foreground-low: #323538; \\r\\n    --color-foreground-min: #212428;\\r\\n\\r\\n    --color-button-bg: #9b4dca;\\r\\n    --color-button-fg: #ffffff;\\r\\n    --color-button-hover: #606c76;\\r\\n\\r\\n    --color-seperator: #1b1c1d;\\r\\n    --color-hyplinker: #b881d9;\\r\\n}\\r\\n\\r\\n/**\\r\\n * Uppy overrides\\r\\n */\\r\\n\\r\\n.uppy-Root {\\r\\n  color: var(--color-primary-fg);\\r\\n}\\r\\n\\r\\n.uppy-Dashboard-inner {\\r\\n  background-color: var(--color-primary-bg);\\r\\n  border: 1px solid var(--color-foreground-high);\\r\\n}\\r\\n\\r\\n.uppy-StatusBar {\\r\\n  background-color: var(--color-foreground-low);\\r\\n  color: inherit;\\r\\n}\\r\\n\\r\\n.uppy-StatusBar-content {\\r\\n  color: var(--color-primary-fg);\\r\\n}\\r\\n\\r\\n.uppy-DashboardContent-bar {\\r\\n  background-color: var(--color-foreground-low);\\r\\n  border-bottom: 1px solid var(--color-foreground-high);\\r\\n}\\r\\n\\r\\n.uppy-DashboardContent-back {\\r\\n  color: var(--color-highlight);\\r\\n\\r\\n  &:hover {\\r\\n    color: var(--color-highlight);\\r\\n    text-decoration: underline;\\r\\n  }\\r\\n  &:focus {\\r\\n    background-color: var(--color-primary-bg);\\r\\n  }\\r\\n}\\r\\n\\r\\n.uppy-DashboardContent-addMore {\\r\\n  color: var(--color-highlight);\\r\\n\\r\\n  &:hover {\\r\\n    color: var(--color-highlight-hover);\\r\\n  }\\r\\n  &:focus {\\r\\n    background-color: var(--color-primary-bg);\\r\\n  }\\r\\n}\\r\\n\\r\\n.uppy-DashboardContent-addMoreCaption {\\r\\n  color: var(--color-highlight);\\r\\n  border-bottom: none;\\r\\n\\r\\n  &:hover {\\r\\n    color: var(--color-highlight-hover);\\r\\n    text-decoration: underline;\\r\\n  }\\r\\n}\\r\\n\\r\\n.uppy-size--md .uppy-DashboardAddFiles {\\r\\n  border: 1px dashed var(--color-foreground-high);\\r\\n  background-color: var(--color-primary-bg);\\r\\n}\\r\\n\\r\\n.uppy-Dashboard-AddFilesPanel {\\r\\n  background: linear-gradient(0deg, var(--color-primary-bg) 35%, var(--color-foreground-high) 100%);\\r\\n}\\r\\n\\r\\n.uppy-Dashboard-browse {\\r\\n  color: var(--color-highlight);\\r\\n\\r\\n  &:hover, &:focus {\\r\\n    text-decoration: underline;\\r\\n    border-bottom: none;\\r\\n  }\\r\\n}\\r\\n\\r\\n.uppy-StatusBar-progress {\\r\\n  background-color: var(--color-highlight);\\r\\n}\\r\\n\\r\\n.uppy-StatusBar-spinner {\\r\\n  fill: var(--color-highlight);\\r\\n}\\r\\n\\r\\n.uppy-StatusBar.is-waiting .uppy-StatusBar-actions {\\r\\n    background-color: var(--color-secondary-bg);\\r\\n}\\r\\n\\r\\n.uppy-DashboardItem-previewInnerWrap {\\r\\n    background-color: var(--color-primary-bg) !important;\\r\\n}\\r\\n\\r\\n.uppy-Dashboard-dropFilesHereHint {\\r\\n  border: 1px dashed var(--color-highlight);\\r\\n  background-image: url(\\\"data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 1v1C11.85 2 2 11.85 2 24s9.85 22 22 22 22-9.85 22-22S36.15 2 24 2V1zm0 0V0c13.254 0 24 10.746 24 24S37.254 48 24 48 0 37.254 0 24 10.746 0 24 0v1zm7.707 19.293a.999.999 0 1 1-1.414 1.414L25 16.414V34a1 1 0 1 1-2 0V16.414l-5.293 5.293a.999.999 0 1 1-1.414-1.414l7-7a.999.999 0 0 1 1.414 0l7 7z' fill='%230DB4CE' fill-rule='nonzero'/%3E%3C/svg%3E\\\");\\r\\n}\\r\\n\\r\\n.uppy-StatusBar-actionBtn, .uppy-StatusBar.is-waiting .uppy-StatusBar-actionBtn--upload, .uppy-Dashboard-FileCard-actionsBtn {\\r\\n  background-color: var(--color-button-bg);\\r\\n  color: var(--color-button-fg);\\r\\n}\\r\\n\\r\\n.uppy-StatusBar-actionBtn:hover, .uppy-StatusBar.is-waiting .uppy-StatusBar-actionBtn--upload:hover, .uppy-Dashboard-FileCard-actionsBtn:hover {\\r\\n  background-color: var(--color-button-hover);\\r\\n  color: var(--color-button-fg);\\r\\n}\\r\\n\\r\\n.uppy-StatusBar:not([aria-hidden=\\\"true\\\"]).is-waiting {\\r\\n  background-color: var(--color-secondary-bg);\\r\\n  border-top: .1rem solid var(--color-seperator);\\r\\n}\\r\\n\\r\\n.uppy-DashboardContent-bar {\\r\\n  border-bottom: .1rem solid var(--color-seperator);\\r\\n}\\r\\n\\r\\n.uppy-Dashboard-FileCard-preview, .uppy-Dashboard-FileCard-actions {\\r\\n  background-color: var(--color-primary-bg) !important;\\r\\n}\\r\\n\\r\\n.uppy-Dashboard-FileCard {\\r\\n  background-color: var(--color-secondary-bg);\\r\\n}\\r\\n\\r\\n.uppy-DashboardContent-bar {\\r\\n    border-bottom: .1rem solid var(--color-seperator);\\r\\n}\\r\\n\\r\\n.uppy-DashboardContent-back:focus, .uppy-DashboardContent-addMoreCaption:focus, .uppy-Dashboard-browse:focus {\\r\\n    background-color: #606c76;\\r\\n}\\r\\n\\r\\n.uppy-Dashboard-browse:focus, .uppy-Dashboard-browse:hover {\\r\\n  border-bottom: 2px solid var(--color-hyplinker);\\r\\n}\\r\\n\\r\\n.uppy-DashboardContent-back, .uppy-DashboardContent-addMoreCaption, .uppy-DashboardContent-back:hover, .uppy-DashboardContent-addMoreCaption:hover, .uppy-Dashboard-browse, .uppy-Dashboard-browse:hover {\\r\\n  color: var(--color-hyplinker);\\r\\n}\\r\\n\\r\\n.UppyIcon {\\r\\n    fill: var(--color-hyplinker);\\r\\n}\\r\\n\\r\\n.comment {\\r\\n  color: grey;\\r\\n}\\r\\n\\r\\n.link {\\r\\n  text-decoration: underline;\\r\\n}\\r\\n\\r\\n.hidden {\\r\\n  display: none;\\r\\n}\", \"\"]);\n\n\n//# sourceURL=webpack:///./src/css/uploader.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: ENOENT: no such file or directory, open 'C:\\\\Users\\\\Alexander\\\\Documents\\\\GitHub\\\\femto-apps\\\\web-file-uploader\\\\node_modules\\\\css-loader\\\\dist\\\\runtime\\\\api.js'\");\n\n//# sourceURL=webpack:///./node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed: Error: ENOENT: no such file or directory, open 'C:\\\\Users\\\\Alexander\\\\Documents\\\\GitHub\\\\femto-apps\\\\web-file-uploader\\\\node_modules\\\\style-loader\\\\dist\\\\runtime\\\\injectStylesIntoStyleTag.js'\");\n\n//# sourceURL=webpack:///./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js?");

/***/ }),

/***/ "./src/css/uploader.css":
/*!******************************!*\
  !*** ./src/css/uploader.css ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./uploader.css */ \"./node_modules/css-loader/dist/cjs.js!./src/css/uploader.css\");\n\nif (typeof content === 'string') {\n  content = [[module.i, content, '']];\n}\n\nvar options = {}\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\")(content, options);\n\nif (content.locals) {\n  module.exports = content.locals;\n}\n\n\n//# sourceURL=webpack:///./src/css/uploader.css?");

/***/ }),

/***/ "./src/uploader.js":
/*!*************************!*\
  !*** ./src/uploader.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Import the plugins\r\nconst Uppy = __webpack_require__(/*! @uppy/core */ \"./node_modules/@uppy/core/lib/index.js\")\r\nconst XHRUpload = __webpack_require__(/*! @uppy/xhr-upload */ \"./node_modules/@uppy/xhr-upload/lib/index.js\")\r\nconst Dashboard = __webpack_require__(/*! @uppy/dashboard */ \"./node_modules/@uppy/dashboard/lib/index.js\")\r\n\r\n// And their styles (for UI plugins)\r\n__webpack_require__(/*! @uppy/core/dist/style.css */ \"./node_modules/@uppy/core/dist/style.css\")\r\n__webpack_require__(/*! @uppy/dashboard/dist/style.css */ \"./node_modules/@uppy/dashboard/dist/style.css\")\r\n__webpack_require__(/*! ./css/uploader.css */ \"./src/css/uploader.css\")\r\n\r\nconst uppy = Uppy({\r\n    autoProceed: false,\r\n})\r\n    .use(Dashboard, {\r\n        trigger: '#upload-files',\r\n        showProgressDetails: true,\r\n        proudlyDisplayPoweredByUppy: false, // :( :(\r\n        metaFields: [\r\n            { id: 'expiry', name: 'Expiry', placeholder: 'seconds until expiry' },\r\n            { id: 'name', name: 'Filename', placeholder: 'name of file' },\r\n        ]\r\n    })\r\n    .use(XHRUpload, {\r\n        endpoint: '/upload/multipart', \r\n        fieldName: 'upload',\r\n        getResponseData(text, resp) {\r\n            const response = JSON.parse(text)\r\n            return { short: response.data.short, url: location.href + response.data.short }\r\n        }\r\n    })\r\n\r\nuppy.on('complete', (result) => {\r\n    console.log('Upload complete! We’ve uploaded these files:', result.successful)\r\n})\r\n\r\nuppy.on('upload-success', (file, resp) => {\r\n    console.log('Single upload complete', file, resp)\r\n\r\n    document.getElementById('upload_container').style.display = 'block'\r\n    document.getElementById('uploads').innerHTML +=\r\n        `<a class='link' href='${resp.body.url}'>${resp.body.url}</a> <span class='comment'># ${file.data.name} (<a class='link' target='_blank' href='/info/${resp.body.short}'>info</a>)</span><br>`\r\n\r\n    console.log('resp', resp)\r\n})\r\n\r\nconst shortenButton = document.getElementById('shorten-url')\r\nshortenButton.addEventListener('click', async () => {\r\n    const url = prompt('URL to Shorten')\r\n    const resp = await fetch('/upload/url', {\r\n        method: 'POST',\r\n        headers: {\r\n            'Content-Type': 'application/json'\r\n        },\r\n        body: JSON.stringify({ url })\r\n    })\r\n        .then(res => res.json())\r\n\r\n    document.getElementById('upload_container').style.display = 'block'\r\n    document.getElementById('uploads').innerHTML += \r\n        `<a class='link' href='/${resp.data.short}'>${window.location.origin}/${resp.data.short}</a> <span class='comment'># ${url} (<a class='link' target='_blank' href='/info/${resp.data.short}'>info</a>)</span>`\r\n\r\n    console.log('resp', resp)\r\n})\r\n\r\nconst apikey = document.getElementById('apikey')\r\napikey.addEventListener('click', async () => {\r\n    apikey.select()\r\n})\n\n//# sourceURL=webpack:///./src/uploader.js?");

/***/ })

/******/ });