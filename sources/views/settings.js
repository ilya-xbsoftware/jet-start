import {JetView} from "webix-jet";

import activityTypes from "../models/activityTypes";
import icons from "../models/icons";
import statuses from "../models/statuses";
import settingsChangeLang from "./settings/settingsChangeLang";
import SettingsTable from "./settings/settingsTable";

export default class Settings extends JetView {
	constructor(app, name) {
		super(app, name);
		this.activityTable = new SettingsTable(this.app, "", activityTypes, icons.activity);
		this.contactTable = new SettingsTable(this.app, "", statuses, icons.contact);
	}

	config() {
		const _ = this.app.getService("locale")._;

		return {
			padding: 30,
			rows: [
				{
					padding: 30,
					rows: [
						settingsChangeLang
					]
				},
				{
					view: "tabview",
					localId: "tabView",
					cells: [
						{
							header: _("activityTypes"),
							id: "settingsActivityTypes",
							body: this.activityTable
						},
						{
							header: _("contactStatuses"),
							id: "settingsContactStatuses",
							body: this.contactTable
						}
					]
				}
			]
		};
	}
}
