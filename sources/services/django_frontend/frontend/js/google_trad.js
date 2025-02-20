function translate_page(language) {
	var translateElement = new google.translate.TranslateElement({
		pageLanguage: "en",
		includedLanguages: "en,es,fr,de,it",
		// autoDisplay: false,
		layout: google.translate.TranslateElement.InlineLayout.SIMPLE
	}, "google_translate_element");

	setTimeout(function()
	{
		var selectElement = document.querySelector(".goog-te-combo");
		if (selectElement)
		{
			selectElement.value = language;
			selectElement.dispatchEvent(new Event("change"));
		}
	}, 500);
}
