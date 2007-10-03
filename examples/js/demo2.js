var map, timeplot, eventSource, buoys;
var activeBuoy;
var baseUrl = "http://dapper.pmel.noaa.gov/dapper/epic/tao_time_series.cdp";


Date.prototype.toISO8601String = function (format, offset) {
    if (!format) { var format = 6; }
    if (!offset) {
        var offset = 'Z';
        var date = this;
    } else {
        var d = offset.match(/([-+])([0-9]{2}):([0-9]{2})/);
        var offsetnum = (Number(d[2]) * 60) + Number(d[3]);
        offsetnum *= ((d[1] == '-') ? -1 : 1);
        var date = new Date(Number(Number(this) + (offsetnum * 60000)));
    }

    var zeropad = function (num) { return ((num < 10) ? '0' : '') + num; }

    var str = "";
    str += date.getUTCFullYear();
    if (format > 1) { str += "-" + zeropad(date.getUTCMonth() + 1); }
    if (format > 2) { str += "-" + zeropad(date.getUTCDate()); }
    if (format > 3) {
        str += "T" + zeropad(date.getUTCHours()) +
               ":" + zeropad(date.getUTCMinutes());
    }
    if (format > 5) {
        var secs = Number(date.getUTCSeconds() + "." +
                   ((date.getUTCMilliseconds() < 100) ? '0' : '') +
                   zeropad(date.getUTCMilliseconds()));
        str += ":" + zeropad(secs);
    } else if (format > 4) { str += ":" + zeropad(date.getUTCSeconds()); }

    if (format > 3) { str += offset; }
    return str;
}


/*
 * Create the initial map, download location data & 
 * variables names, and prepare time plot.
 */
function onLoad() {
    // Load map.
    OpenLayers.ProxyHost = '/proxy/';
    map = new OpenLayers.Map('map');
    map.addControl(new OpenLayers.Control.LayerSwitcher());

    var layer = new OpenLayers.Layer.WMS('OpenLayers WMS',
            'http://labs.metacarta.com/wms/vmap0',
            {layers: 'basic'}, 
            {wrapDateLine: true});
    map.addLayer(layer);
    map.setCenter(new OpenLayers.LonLat(-145, 0), 3);

    // Add layer for the buoys.
    buoys = new OpenLayers.Layer.Markers('TAO array');
    map.addLayer(buoys);

    // Add buoys. Apparently, dapper always returns the data
    // in the order lon/lat/_id, independently of the projection.
    var url = baseUrl + ".dods?location.lon,location.lat,location._id";
    loadData(url, plotBuoys, '/proxy/');

    // Read variables in each location.
    loadDataset(baseUrl, loadVariables, '/proxy/');
}


/*
 * Load variables stored in each location.
 */
function loadVariables(dataset) {
    var series = dataset.location.time_series;

    $('#variables').append('<p id="buoy">No buoy selected.</p>');
    var name, id, isTime;
    for (child in series) {
        if (series[child].attributes) {
            name = series[child].attributes.long_name;
            id = series[child].id;
            isTime = (child == 'time') ? 'class="time" checked="checked"' : '';
            $('#variables').append('<input ' + isTime + ' disabled="disabled" type="checkbox" name="' + id + '" id="' + id + '" value="' + id + '" /><label for="' + id + '">&nbsp;' + name + '</label><br />');
        }
    }
    $('<p><input type="button" value="Plot" /></p>').click(getData).appendTo('#variables');
}


/*
 * Plot the buoys as markers.
 */
function plotBuoys(data) {
    var seqData = data[0];
    var station, lon, lat, _id;

    var size = new OpenLayers.Size(21,25);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    var icon = new OpenLayers.Icon('js/OpenLayers/img/marker-blue.png',size,offset);

    for (var i=0; i<seqData.length; i++) {
        station = seqData[i];
        lon = station[0] - 360.0;
        lat = station[1];
        _id = station[2];
        
        var marker = new OpenLayers.Marker(new OpenLayers.LonLat(lon,lat), icon.clone());
        marker.metadata = {id: _id, lat: lat, lon: lon};
        marker.events.register('click', marker, selectBuoy);
        buoys.addMarker(marker);
    }
}


/*
 * Select a buoy. We show the location and 
 * allow variables to be selected.
 */
function selectBuoy() {
    // Reset all buttons.
    for (var i=0; i<buoys.markers.length; i++) {
        buoys.markers[i].icon.imageDiv.firstChild.setAttribute(
                'src', 'js/OpenLayers/img/marker-blue.png');
    }
    this.icon.imageDiv.firstChild.setAttribute('src', 'js/OpenLayers/img/marker.png');

    $('#buoy').html('Buoy ' + this.metadata.id + ': ' + 
            decToDeg(this.metadata.lat, 'NS') + ' ' + 
            decToDeg(this.metadata.lon, 'EW'));
    $(':checkbox').not('.time').removeAttr('disabled');
}


/*
 * Download data for all the requested variables.
 */
function getData() {
    var url = baseUrl + '.dods?';
    var selected = $('#variables :checkbox').filter(':checked');
    selected.each(function() {
        url += this.id + ',';
    });
    if (selected.length <= 1) return;

    // Get buoy id.
    for (var i=0; i<buoys.markers.length; i++) {
        var marker = buoys.markers[i];
        if (marker.icon.imageDiv.firstChild.getAttribute('src') == 'js/OpenLayers/img/marker.png') {
            var id = marker.metadata.id;
            break;
        }
    }

    url = url.replace(/,$/, '');
    url += '&location.time>1.1e12';  // get only a couple of points for this demo.
    url += '&location._id=' + id;
    
    loadData(url, plotData, '/proxy/');
}


/*
 * Prepare and plot data.
 */
var timeGeometry = new Timeplot.DefaultTimeGeometry({
    gridColor: "#000000",
    axisLabelsPlacement: "top"
});

var valueGeometry = new Timeplot.DefaultValueGeometry({
    gridColor: "#000000",
    axisLabelsPlacement: "left"
});

function plotData(data) {
    var timeSeries = data[0][0][0];

    // Load timeplot.
    eventSource = new Timeplot.DefaultEventSource();

    var plotInfo = [];
    var selected = $('#variables :checkbox').filter(':checked');
    var timeIndex = 0;
    selected.each(function(i) {
        if (this.id == 'location.time_series.time') {
            timeIndex = i;
        } else {
            plotInfo.push(
                Timeplot.createPlotInfo({
                    id: 'plot_' + this.id.split('.')[2],
                    dataSource: new Timeplot.ColumnSource(eventSource, i+1),
                    timeGeometry: timeGeometry,
                    valueGeometry: valueGeometry,
                    showValues: true
                })
            );
        }
    });
    timeplot = Timeplot.create(document.getElementById('timeplot'), plotInfo);
    eventSource.loadSequence(timeSeries, timeIndex, baseUrl);
}


/*
 * Resizer function for the plot.
 */
var resizeTimerID = null;
function onResize() {
    if (resizeTimerID == null) {
        resizeTimerID = window.setTimeout(function() {
            resizeTimerID = null;
            timeplot.repaint();
        }, 100);
    }
}


/*
 * Pretty-formatter for lat/lon.
 */
function decToDeg(dec, axis) {
    var index = dec > 0 ? axis[0] : axis[1];
    dec = Math.abs(dec);
    var deg = parseInt(dec);
    var min = parseInt((dec - deg) * 60);
    var sec = parseInt(((dec - deg) * 60 - min) * 60);
    var minPad = min < 10 ? '0' : '';
    var secPad = sec < 10 ? '0' : '';
    return deg + '&deg;' + minPad + min + "'" + secPad + sec + '"' + index;
}


Timeplot.DefaultEventSource.prototype.loadSequence = function(data, timeIndex, url) {
    if (data == null) {
        return;
    }

    this._events.maxValues = new Array();
    var base = this._getBaseURL(url);

    var added = false;

    if (data) {
        //for (var i=0; i<data.length; i++) {
        for (var i=0; i<100; i++) {
            var row = data[i];
            if (row.length > 1) {
                // units "msec since 1970-01-01 00:00:00 GMT"
                var date = new Date();
                date.setTime(row[timeIndex]);

                var evt = new Timeplot.DefaultEventSource.NumericEvent(
                    date,
                    row // we can leave row whole here, because all vars are indexed.
                );
                this._events.add(evt);
                added = true;
            }
        }
    }

    if (added) {
        this._fire("onAddMany", []);
    }
}
