function zfill(string, length) {
  if (typeof string != "string") {
    string = string.toString();
  };
  if (string.length >= length) {
    return string;
  };
  let new_string = "";
  for (let index of Array(length - string.length)) {
    new_string += "0";
  };
  return new_string + string;
};

var data;
var online = 0;

function update() {
  try {
    fetch(new URL("http://76.20.40.178:25565/history.txt"), {"method": "GET", "cache": "no-store"}).catch(function(error) {
      return {response: {ok: false}};
    }).then(function(response) {
      if (response.ok) {
        return response.text();
      } else {
        console.log(`Server responded with error ${response.status} (${response.statusText})`);
        online = 0;
        update_status_text();
        online = null;
      };
    }).then(function(text) {
      if (online == null) {
        online = 0;
        return;
      };

      data = text;
      if (parseInt(data.split("\n").slice(-1)[0][0])) {
        online = 2;
      } else {
        online = 1;
      };

      update_status_text();
      while (document.getElementById("history").firstChild) {
        document.getElementById("history").removeChild(document.getElementById("history").firstChild);
      };

      let element;
      for (let x of data.split("\n")) {
        element = document.createElement("p");
        element.innerHTML = "Server was turned " + ["off ", "on "][parseInt(x[0])] + "<date>" + format_time(x.slice(1)) + "</date>";
        element.classList.add("history-" + ["off", "on"][parseInt(x[0])]);
        document.getElementById("history").appendChild(element);
      };
    });
  } catch (err) {
    console.log(err);
  };
};

update();

setInterval(update, 5000);

function update_status_text() {
  if (online == 0) {
    document.body.style.background = "#f55";
    document.getElementById("status").innerHTML = "Server host is down";
    document.getElementById("history").style.display = "none";
    document.getElementById("history-label").style.display = "none";
    return;
  };

  switch (online) {
    case 1:
      document.body.style.background = "yellow";
      document.getElementById("status").innerHTML = "Server is offline";
      break;
    case 2:
      document.body.style.background = "limegreen";
      document.getElementById("status").innerHTML = "Server is online";
      break;
  };

  let old_time = data.split("\n").slice(-1)[0].slice(1);
  let difference = new Date((new Date()) - (new Date(`${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parseInt(old_time.slice(4, 6)) - 1]} ${old_time.slice(6, 8)}, ${old_time.slice(0, 4)} ${old_time.slice(8, 10)}:${old_time.slice(10, 12)}:${old_time.slice(12, 14)} UTC`)))
  document.getElementById("start-time").innerHTML = `Since <date>${format_time(data.split("\n").slice(-1)[0].slice(1))}</date> (${difference.getUTCDate() - 1} days ${difference.getUTCHours()} hours ${difference.getUTCMinutes()} minutes ${difference.getUTCSeconds()} seconds ago)`;
  document.getElementById("history").style.display = "block";
  document.getElementById("history-label").style.display = "block";
};

function format_time(time) {
  let date = new Date(`${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parseInt(time.slice(4, 6)) - 1]} ${time.slice(6, 8)}, ${time.slice(0, 4)} ${time.slice(8, 10)}:${time.slice(10, 12)}:${time.slice(12, 14)} UTC`);
  return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()] + " " + zfill(date.getDate(), 2) + ", " + date.getFullYear() + " " + zfill(date.getHours(), 2) + ":" + zfill(date.getMinutes(), 2) + ":" + zfill(date.getSeconds(), 2);
};
