class Weather {
    constructor() { }

// date updated current
    setDate() {
        var d = new Date();
        var n = d.toDateString();
        $("#date").text(n);
      }

// current location js 
    getLocation() {
        var defaultLocation = "New Delhi";
        var self = this;
        var inputLocation = $("#location").val();

        if (isNaN(inputLocation)) {
            this.location = inputLocation;
            this.currentWeather();
            this.forecast();
        } else {
            var apiUrl = "https://api.openweathermap.org/data/2.5/weather" + inputLocation;
            $.getJSON(apiUrl)
                .done(function (data) {
                    var city = data.places[0]["place name"];
                    var country = data.places[0]["country"];
                    self.location = city + ", " + country;
                    self.currentWeather();
                    self.forecast();
                })
                .fail(function () {
                    self.location = defaultLocation;
                    $("#location").val(defaultLocation);
                    self.currentWeather();
                    self.forecast();
                });
        }
    }


    setLocation() {
        var self = this;
        $("#search2").on("click", function (e) {
            e.preventDefault();
            self.location = $("#location").val();
            self.currentWeather();
            self.forecast();
        });
    }

    currentWeather() {
        if (this.location) {
            function setMain(res) {
                if (res.main) {
                    $("#temperature").text(Math.round(res.main.temp) + "°C");
                    if (res.main.humidity) {
                        $("#humidity").text(res.main.humidity);
                    } else {
                        $("#humidity").text("0");
                    }
                }
            }

            $.getJSON("https://api.openweathermap.org/data/2.5/weather", { q: this.location, units: "metric", appid: "bc1301b0b23fe6ef52032a7e5bb70820" }, (function (json) {
                setMain(json);
            }).bind(this));
        }
    }

    forecast() {
        function setForecast(res) {
            this.daily = [];
            var list = res.list;
            for (var i = 0, len = list.length; i < len; i++) {
                this.daily[i] = this.daily[i] ? this.daily[i] : {};
                this.daily[i].maxTemp = Math.round(list[i].temp.max);
                this.daily[i].minTemp = Math.round(list[i].temp.min);
                this.daily[i].day = new Date(list[i].dt * 1000).getDay();
                var iconId = list[i].weather[0].id;
                this.daily[i].icon = "wi-" + iconId;
            }
        }

        function displayForecast() {
            var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], _this = this;
            $(".days_box").each(function (index) {
                if (_this.daily[index] !== undefined) {
                    $(this).find('.week_day').text(days[_this.daily[index].day]);
                    $(this).find('.days-temp').text(_this.daily[index].minTemp + "°");
                    $(this).find('.days-temp-red').text(_this.daily[index].maxTemp + "°");
                    $(this).find('.wi').addClass(_this.daily[index].icon);
                }
            });
        }

        $.getJSON("https://api.openweathermap.org/data/2.5/forecast/daily", { q: this.location, cnt: 5, units: "metric", appid: "bc1301b0b23fe6ef52032a7e5bb70820" }, (function (json) {
            setForecast.call(this, json);
            displayForecast.call(this);
        }).bind(this));
    }

    setUnit() {
        var prevUnit = "C";
        $("#unit-switch").on("click", function () {
            var newUnit = prevUnit == "C" ? "F" : "C";
            $("span:contains('°')").each(function (index, el) {
                var temp_current = parseFloat($(el).text());
                var temp_new;
                if (newUnit == "F") {
                    temp_new = Math.round((temp_current * 1.8) + 32);
                    $(el).text(temp_new + "°F");
                } else if (newUnit == "C") {
                    temp_new = Math.round((temp_current - 32) / 1.8);
                    $(el).text(temp_new + "°C");
                }
            });
    
            prevUnit = newUnit;
        });
    }
    
}

var weather = new Weather();
$(document).ready(function () {
    $("#unit-switch").prop('checked', true);
    weather.setDate();
    weather.getLocation();
    weather.setLocation();
    weather.setUnit();
});
