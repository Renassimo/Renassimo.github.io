$(document).ready(function () {
    // alert($('table td').html());

    var data;

    var $tbody = $('table tbody');

    $.ajax({
        url: 'data.json'
    }).done(function (arr) {
            // var dat = JSON.parse(arr);
        data = arr;

        data.forEach(function (item) {

            var reg;

            if (item.aircraftReg === undefined) {
                reg = '-';
            } else {
                reg = '<a href="' + item.aircraftRegHref + '" target="_blank">' + item.aircraftReg + '</a>'
            }

            $tbody.append('<tr></tr>').children('tr:last').append(
                '<td>' + item.number + '</td><td>' + item.date + '</td><td>' + item.airline + '</td>' +
                '<td>' + item.aircraft + '</td><td>' + item.flightNumber + '</td><td title="' + item.originTitle + '">' + item.origin + '</td>' +
                '<td title="' + item.destinationTitle + '">' + item.destination + '</td><td>' + item.seat + '</td>' + '<td>' + reg + '</td>' +
                '<td>' + item.cn + '</td><td><a target="_blank" href="' + item.picHref + '"><img src="' + item.picHref + '"></a><br/>' + item.name + '</td>'
            );
        });

        });




});