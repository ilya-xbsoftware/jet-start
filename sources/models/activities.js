import {dueDateDataFormat} from "../utils/utils";

const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (item) => {
			item.DueDate = webix.i18n.parseFormatDate(item.DueDate);
		},

		$save: (item) => {
			item.DueDate = dueDateDataFormat(item.DueDate);
		}
	}
});

export default activities;
