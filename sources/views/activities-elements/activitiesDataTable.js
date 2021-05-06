import {JetView} from "webix-jet";

import events from "../../constants/events";
import activities from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contacts from "../../models/contacts";
import {confirmMessage} from "../../utils/utils";
import PopupView from "../window/popup";

export default class ActivitiesDataTable extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return 	{
			view: "datatable",
			localId: "datatable",
			scrollX: false,
			scrollY: "auto",
			select: true,
			columns: [
				{
					id: "State",
					header: "",
					template: "{common.checkbox()}",
					width: 50
				},
				{
					id: "TypeID",
					header: [
						_("activityType"),
						{content: "multiSelectFilter"}
					],
					sort: "text",
					collection: activityTypes,
					template: obj => this._getActivityCloumnTemplate(obj.TypeID),
					fillspace: 1,
					minWidth: 100
				},
				{
					id: "DueDate",
					header: [_("dueDate"), {
						content: "datepickerFilter",
						compare(value, filter) {
							if (webix.isDate(value)) {
								const date = webix.Date.copy(value);
								date.setHours(0, 0, 0);
								return filter * 1 === date * 1;
							}
							return false;
						}
					}],
					format: webix.i18n.longDateFormatStr,
					sort: "date",
					fillspace: 1,
					minWidth: 200
				},
				{
					id: "Details",
					header: [_("details"), {content: "textFilter"}],
					sort: "text",
					fillspace: 3,
					minWidth: 300
				},
				{
					id: "ContactID",
					header: [_("contact"), {content: "richSelectFilter"}],
					collection: contacts,
					sort: "text",
					fillspace: 1,
					minWidth: 150
				},
				{
					id: "editRow",
					header: "",
					template: "<i class='far fa-edit edit-row'></i>",
					width: 30
				},
				{
					id: "deleteRow",
					header: "",
					template: "<i class='fas fa-trash-alt delete-row'></i>",
					width: 50
				}
			],
			onClick: {
				"delete-row": (event, id) => this._deleteActivity(id.row),
				"edit-row": (event, id) => {
					const editingItem = this._dataTable.getItem(id.row);
					this.app.callEvent(events.SHOW_POPUP, [editingItem]);
				}
			}
		};
	}

	init() {
		this._dataTable = this.$$("datatable");
		this._activitiesCollection = activities;
		this._dataTable.sync(activities);
		activities.filter();
		this._dataTable.filterByAll();
		this.initPopupView();
	}

	initPopupView() {
		this.popup = this.ui(PopupView);
	}

	urlChange() {
		this._urlId = this.getParam("id");
		activities.waitData.then(() => {
			const id = this.getParam("id") || activities.getFirstId();

			if (id && activities.exists(id)) {
				this._dataTable.select(id);
			}
			else {
				this.show("../activities");
			}
		});
	}

	_deleteActivity(id) {
		const _ = this.app.getService("locale")._;
		if (id) {
			confirmMessage(_, "areYouSure")
				.then(() => {
					activities.remove(id);
				});
		}
	}

	_getActivityCloumnTemplate(item) {
		const getActivityTypeData = activityTypes.getItem(item) || false;
		const icon = getActivityTypeData.Icon || "remove-format";
		const activity = getActivityTypeData.Value || "n/a";
		return `<div class="activity-column-icons">
              <i class="fas fa-${icon}"></i>
              <span>${activity}</span>
            </div>`;
	}

	get $activitiesTable() {
		if (!this._dataTable) {
			this._dataTable = this.$$("datatable");
		}
		return this._dataTable;
	}
}
