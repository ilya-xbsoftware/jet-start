import {birthdayDateFormat} from "../utils/utils";

const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (item) => {
			item.value = `${item.FirstName} ${item.LastName}`;
			item.birthday = birthdayDateFormat(new Date(item.Birthday));
		}
	}
});

export default contacts;
