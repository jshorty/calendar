(function () {
  if (typeof Calendar === "undefined") {
    window.Calendar = function () {
      this.date = new Date();
      this.day = this.date.getDate();
      this.weekday = this.date.getDay();
      this.month = this.date.getMonth();
      this.year = this.date.getFullYear();
      this.addMonthChangeListeners();
    };
  };

  WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday",
              "Thursday", "Friday", "Saturday"];

  MONTHS = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"]

  Calendar.prototype.nextMonth = function () {
    if (this.month === 11) {
      this.month = 0;
      this.year += 1;
    } else {
      this.month += 1;
    }
    this.updateDate();
    this.render();
  };

  Calendar.prototype.prevMonth = function () {
    if (this.month === 0) {
      this.month = 11;
      this.year -= 1;
    } else {
      this.month -= 1;
    }
    this.updateDate();
    this.render();
  };

  Calendar.prototype.render = function () {
    var dayName = document.getElementById('day');
    dayName.innerHTML = WEEKDAYS[this.weekday];

    var date = document.getElementById('date');
    date.innerHTML = this.day;

    var monthAndYear = document.getElementById('month-year')
    monthAndYear.innerHTML = MONTHS[this.month] + " " + this.year;

    var numBlanks = new Date(this.year, this.month, 1).getDay()
    this.addBlanks(numBlanks);

    var numDays = new Date(this.year, this.month + 1, 0).getDate();
    this.addDates(numDays);
  };

  Calendar.prototype.addBlanks = function (numBlanks) {
    var dayBoxes = document.getElementById("date-list");

    while (dayBoxes.firstChild) {
      dayBoxes.firstChild.removeEventListener("click", this.select.bind(this));
      dayBoxes.removeChild(dayBoxes.firstChild);
    };

    for (var blanks = 0; blanks < numBlanks; blanks++) {
      var li = document.createElement("li");
      dayBoxes.appendChild(li);
    };
  };

  Calendar.prototype.addDates = function (numDays) {
    var dayBoxes = document.getElementById("date-list");

    for (var day = 1; day <= numDays; day++) {
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(day));
      dayBoxes.appendChild(li);
      if (day === this.day) {
        li.classList.add("selected");
      } else {
        li.classList.remove("selected");
        li.addEventListener("click", this.select.bind(this));
      }
    };
  };

  Calendar.prototype.updateDate = function () {
    //day of month stays the same unless exceeding new month's max date
    var numDays = new Date(this.year, this.month + 1, 0).getDate();
    if (numDays < this.day) {
      this.day = numDays;
    }

    this.date = new Date(this.year, this.month, this.day);
    this.weekday = this.date.getDay();
  };

  Calendar.prototype.select = function (event) {
    var newDay = event.target.innerHTML;
    this.day = new Date(this.year, this.month, newDay).getDate();
    this.date = new Date (this.year, this.month, this.day);
    this.weekday = this.date.getDay();
    this.render();
  };

  Calendar.prototype.addMonthChangeListeners = function () {
    var prev = document.getElementById("prev-month")
    var next = document.getElementById("next-month")

    prev.addEventListener("click", this.prevMonth.bind(this));
    next.addEventListener("click", this.nextMonth.bind(this));

    this.addKeyBindings();
  };

  Calendar.prototype.addKeyBindings = function () {
    var calendar = this;
    document.onkeydown = function (event) {
      if (event.keyCode === 37) {
        calendar.prevMonth();
      } else if (event.keyCode === 39) {
        calendar.nextMonth();
      }
    };
  };
})();

new Calendar().render();
