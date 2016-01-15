var map, buoys;
var timeIndex = 0;
var activeBuoy;
var baseUrl = "http://dapper.pmel.noaa.gov/dapper/epic/tao_time_series.cdp";


/*
 * Create the initial map, download location data &
 * variables names.
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
    jsdap.loadData(url, plotBuoys, '/proxy/');

    // Read variables in each location.
    jsdap.loadDataset(baseUrl, loadVariables, '/proxy/');
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
    selected.each(function(i) {
        if (this.id == 'location.time_series.time') timeIndex = i;
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
    //url += '&location.time>1.1e12';  // get only a couple of points for this demo.
    url += '&location._id=' + id;

    jsdap.loadData(url, plotData, '/proxy/');
}


function plotData(data) {
    var timeSeries = data[0][0][0];
    var d = [];
    var n = timeSeries[0].length;
    for (var i=0; i<n; i++) {
        if (i != timeIndex) {
            variable = [];
            for (var j=0; j<timeSeries.length; j++) {
                variable.push([timeSeries[j][timeIndex], timeSeries[j][i]]);
            }
            d.push(variable);
        }
    }
    $.plot($("#plot"), d, { xaxis: { mode: "time" } });
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


function removeNaN(data) {
    var i = 0;
    while (i<data.length) {
        // Remove all lines with NaN
        for (var j=0; j<data[i].length; j++) {
            if (isNaN(data[i][j])) {
                data.splice(i, 1);
                i--;
                break
            }
        }
        i++;
    }
    return data;
}
