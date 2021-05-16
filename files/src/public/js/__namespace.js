(function($, _){

	/**
	 * @summary A reference to the jQuery object the plugin is registered with.
	 * @memberof {$config.namespace}.
	 * @name $
	 * @type {jQuery}
	 * @description This is used internally for all jQuery operations to help work around issues where multiple jQuery libraries have been included in a single page.
	 */
	_.$ = $;

})(
	// dependencies
	jQuery,
	/**
	 * @summary The core namespace for the plugin containing all its code.
	 * @global
	 * @namespace {$config.namespace}
	 * @description This plugin houses all it's code within a single `{$config.namespace}` global variable to prevent polluting the global namespace and to make accessing its various members simpler.
	 */
	window["{$config.namespace}"] = window["{$config.namespace}"] || {}
);