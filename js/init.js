"use strict";

var channel;
var about;
var map;
var units;

$(document).ready(function() {

    $.ajax({
        type: "GET",
        url: "json/torontoWeather.json",
        dataType: "json"
    }).done(initMain);

    $.ajax({
        type: "GET",
        url: "json/about.json",
        dataType: "json"
    }).done(initAbout);
});



function initMain(data) {

    channel = data.query.results.channel;
    units = channel.units;

    $("#main header").html(
        "<div style='text-align: right'><small>Last build date: " +
            new Date(channel.lastBuildDate).toDateString() +
        "</small></div>" +
        "<a href='" + channel.image.link + "'>" +
            "<img src='" + channel.image.url  + "'>" +
        "</a>"

    );

    $("#location-info").html(
        "<div>City: " + channel.location.city + "</div>" +
        "<div>Country: " + channel.location.country +"</div>" +
        "<div>Region: " + channel.location.region +"</div>"
    );

    $(".btn-panel").click(function() {
        initPanel(this.innerHTML, channel[this.innerHTML.toLowerCase()]);
    });

    var forecastSet = $("#forecast-set");

    $(channel.item.forecast).each(function() {

        forecastSet.append(
            "<div data-role='collapsible' data-collapsed='true'>" +
                "<h3>" + this.date + ", " + this.day.toUpperCase() + "</h3>" +
                "<p><strong>" + this.text + "</strong><br><br>" +
                    "High: " + this.high + " " + units.temperature + "<br>" +
                    "Low: " + this.low + " " + units.temperature + "<br>" +
                "</p>" +
            "</div>"
        ).collapsibleset("refresh");
    });

    var posToronto = {
        lat: Number(channel.item.lat),
        lng: Number(channel.item.long)
    };

    map = new google.maps.Map(document.querySelector("#map"), {
        center: posToronto,
        scrollwheel: true,
        zoom: 8
    });

    new google.maps.Marker({
        map: map,
        position: posToronto,
        title: channel.item.title
    });

    $("#btn-show-map").click(function() {

        $("#btn-show-map").html(
            document.querySelector("#map").style.display == "block" ? "Show Map" : "Hide Map"
        );
        $("#map").toggle();
    });


    $("#btn-last-comment").click(function() {

        var comment = localStorage.getItem("comment");

        if (comment) {
            comment = JSON.parse(comment);

            $("#email")[0].value = comment.email;
            $("#radio-purpose-" + comment.purpose)[0].checked = true;
            $("#radio-type-" + comment.type)[0].checked = true;
            $("#user-input")[0].value = comment.userInput;
        };

        $("input[type='radio']").prop("checked", true).checkboxradio("refresh");
    });

    $("#panel-content").trigger("updatelayout");
}

function initPanel(title, obj) {

    $("#panel-content").html(
        "<h1 class='panel-header'>" + title + "</h1>"
    );

    $(Object.keys(obj)).each(function() {
        $("#panel-content").append(
            "<h4>" + this.toUpperCase() + ": " + obj[this] + "</h4>"
        );
    });
}


function initAbout(data) {

    about = data;

    $("#about header").html("<h4 style='text-align: center'>About</h4>");
    $("#about section").html(
        "<img id='my-pic' src='img/" + about.img + "'>" +
        "<div>Name: " + about.name + "</div>" +
        "<div>Student#: " + about.sNumber + "</div>" +
        "<div>Program: " + about.sProgram + "</div>"
    );
}

function submit() {
    var email = $("#email")[0].value;
    var purpose = $("input[name='radio-purpose']:checked")[0].value;
    var type = $("input[name='radio-type']:checked")[0].value;
    var userInput = $("#user-input")[0].value;

    localStorage.setItem("comment", JSON.stringify({
        email: email,
        purpose: purpose,
        type: type,
        userInput: userInput
    }));
}