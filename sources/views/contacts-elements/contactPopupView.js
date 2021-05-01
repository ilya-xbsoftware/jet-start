import PopupView from "../window/popup";

export default class ContactPopupView extends PopupView {
	init() {
		super.init();
		this._window = this.$$("popup");
		this._contactInput = this.$$("contactId");
		this._contactInput.define("readonly", true);

		this._window.attachEvent("onBeforeShow", () => {
			const urlId = this.getParam("id", true);
			const contactValue = this._contactInput.getValue();
			if (!contactValue) {
				this._contactInput.setValue(urlId);
			}
		});
	}
}
