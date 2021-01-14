import { run } from "../../ts/app";
import "./sass/main.scss";

import { form } from "../../ts/app/index";

const options = {
  // backgroundImage: [
  //   "https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10069/earthisland-background.jpg"
  // ],
  submitLabel: "Donate"
};

if (document.readyState !== "loading") {
  run(options);
} else {
  document.addEventListener("DOMContentLoaded", function () {
    run(options);
  });
}

// Custom Client Code
// Upland / Mobilecommons Script
function getFieldValue(id: string) {
  let field = document.getElementById(id) as HTMLInputElement;
  return field && "value" in field ? field.value : "";
}
function getPageType() {
  if (
    window.hasOwnProperty("pageJson") &&
    window.pageJson.hasOwnProperty("pageType")
  ) {
    switch (window.pageJson.pageType) {
      case "e-card":
        return "ECARD";
        break;
      case "otherdatacapture":
        return "SURVEY";
        break;
      case "emailtotarget":
      case "advocacypetition":
        return "ADVOCACY";
        break;
      case "emailsubscribeform":
        return "SUBSCRIBEFORM";
        break;
      default:
        return "DONATION";
    }
  } else {
    return "DONATION";
  }
}
function getUserData() {
  let phone = getFieldValue("en__field_supporter_phoneNumber");
  let sms_message_opt_in = document.getElementById(
    "en__field_supporter_questions_178688"
  ) as HTMLInputElement | null;
  if (!phone || !sms_message_opt_in || !sms_message_opt_in.checked)
    return false;
  return {
    firstname: getFieldValue("en__field_supporter_firstName"),
    lastname: getFieldValue("en__field_supporter_lastName"),
    address1: getFieldValue("en__field_supporter_address1"),
    address2: getFieldValue("en__field_supporter_address2"),
    city: getFieldValue("en__field_supporter_city"),
    state: getFieldValue("en__field_supporter_region"),
    country: getFieldValue("en__field_supporter_country"),
    postal_code: getFieldValue("en__field_supporter_postcode"),
    msisdn: phone,
    email: getFieldValue("en__field_supporter_emailAddress"),
    phone: phone.replace(/\D/g, ""),
    optin_path_key: "OP1AF618AA53A977C5E6EE7A033BA8BDDB",
    donor: document.getElementsByName("transaction.donationAmt.other")
      .length,
    tags: "OC_EN_Form",
    source: getPageType(),
  };
}

function postAjax(url: string, data: any, success: Function) {
  var params =
    typeof data == "string"
      ? data
      : Object.keys(data)
        .map(function (k) {
          return (
            encodeURIComponent(k) + "=" + encodeURIComponent(data[k])
          );
        })
        .join("&");

  var xhr = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open("POST", url);
  xhr.onreadystatechange = function () {
    if (
      xhr.readyState > 3 &&
      (xhr.status == 200 || xhr.status == 202)
    ) {
      success(xhr.responseText);
    }
  };
  xhr.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  xhr.send(params);
  return xhr;
}
form.onSubmit.subscribe(() => {
  console.log('%c Upland / Mobilecommons Script', 'font-size: 30px; background-color: #000; color: #FF0');
  return new Promise(function (resolve, reject) {
    let userData = getUserData();
    console.log("User Data", userData);
    if (!userData) return resolve(true);
    postAjax(
      "https://oceanconservancy.org/wp-admin/admin-ajax.php?action=upland_sms_signup",
      userData,
      function (data: string) {
        console.log("Response Data", data);
        var response = JSON.parse(data);
        if (response.error) console.log("error adding contact");
        else console.log(response.message);
        resolve(true);
      }
    );
  });
});