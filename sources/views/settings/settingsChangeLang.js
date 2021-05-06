import {JetView} from "webix-jet";

export default class settingsChangeLang extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();

		return {
			rows: [
				{
					view: "segmented",
					inputWidth: 400,
					height: 50,
					label: _("language"),
					options: [
						{id: "en", value: _("english")},
						{id: "ru", value: _("russian")}
					],
					click: () => this.toggleLanguage(),
					value: lang
				}
			]
		};
	}

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.getRoot().queryView({view: "segmented"}).getValue();
		langs.setLang(value);
	}
}
