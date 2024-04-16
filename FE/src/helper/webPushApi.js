const showNotiWebApi = ({
  title,
  content,
  image,
  icon = "https://www.unicharm.vn/content/dam/sites/www_unicharm_vn/images/common/logo-company.svg",
}) => {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      doNotify();
    } else {
      //notification == denied
      Notification.requestPermission()
        .then(function (result) {
          if (Notification.permission === "granted") {
            doNotify();
          }
        })
        .catch((err) => {});
    }
  }

  function doNotify() {
    let t = Date.now() + 1200000; //2 mins in future
    let options = {
      body: content,
      data: { prop1: 123, prop2: "Steve" },
      lang: "vi",
      icon: icon,
      timestamp: t,
      image: image,
      vibrate: [100, 200, 100],
    };
    let n = new Notification(title, options);

    n.addEventListener("show", function (ev) {});
    n.addEventListener("click", function (ev) {
      // alert("hi");
      window?.focus();
    });
    n.addEventListener("close", function (ev) {});
    setTimeout(n.close.bind(n), 50000000); //close notification after 3 seconds
  }
};
export default showNotiWebApi;
