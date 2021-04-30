import {JetView} from "webix-jet";

import activityTypes from "../models/activityTypes";
import statuses from "../models/statuses";
import settingsChangeLang from "./settings/settingsChangeLang";
import SettingsTable from "./settings/settingsTable";

export default class Settings extends JetView {
	config() {
		return {
			padding: 30,
			rows: [
				{
					cols: [
						{
							rows: [
								{
									rows: [
										settingsChangeLang
									]
								},
								{
									view: "form",
									cols: [
										{
											view: "text",
											localId: "inputValue"
										},
										{
											view: "button",
											value: "Add new",
											width: 100,
											css: "webix_primary",
											click: () => this._addNewRow()
										},
										{}
									]
								},
								{
									view: "tabview",
									cells: [
										{
											header: "Activity types",
											id: "settingsActivityTypes",
											body: new SettingsTable(this.app, "", activityTypes, "activity")
										},
										{
											header: "Contact statuses",
											id: "settingsContactStatuses",
											body: new SettingsTable(this.app, "", statuses, "contact")
										}
									]
								}
							]
						}
					]
				},
				{}
			]
		};
	}

	_addNewRow() {
		const getInputValue = this.$$("inputValue").getValue();
		if (getInputValue) {

		}
	}
}
