require({
    packages: [{
        name: 'root',
        location: document.location.pathname + '/..'
    }]
}, [
    'esri/Map',
    'esri/Camera',
    'esri/views/SceneView',
    'esri/views/3d/externalRenderers',
    'root/renderer',
    'dojo/number',
    'dojo/string',
    'dojo/domReady!'
],
    function (
        Map,
        Camera,
        SceneView,
        ExternalRenderers,
        Renderer,
        number,
        string
    ) {
        $(document).ready(function () {
            // Enforce strict mode
            'use strict';

            // Files
            var TLE = 'data/tle.20200714.txt';
            var OIO = 'data/oio.20200714.txt';

            // Well known satellite constellations.
            var STARLINK = [
                46798, 46797, 46796, 46795, 46794, 46793, 46792, 46791, 46790, 46789, 46788, 46787, 46786, 46785, 46784, 46783, 46782, 46781, 46780, 46779, 46777, 46776, 46775, 46774, 46773, 46772, 46771, 46770, 46769, 46768, 46767, 46766, 46765, 46764, 46763, 46762, 46761, 46760, 46759, 46758, 46757, 46756, 46755, 46754, 46753, 46752, 46751, 46749, 46748, 46747, 46746, 46745, 46744, 46743, 46742, 46741, 46740, 46739, 46729, 46728, 46727, 46726, 46725, 46724, 46723, 46722, 46721, 46720, 46719, 46718, 46717, 46716, 46715, 46714, 46713, 46712, 46711, 46710, 46709, 46708, 46707, 46706, 46705, 46704, 46703, 46702, 46701, 46700, 46699, 46698, 46697, 46696, 46695, 46694, 46693, 46692, 46691, 46690, 46689, 46688, 46687, 46686, 46685, 46684, 46683, 46682, 46681, 46680, 46679, 46678, 46677, 46676, 46675, 46674, 46673, 46672, 46671, 46591, 46590, 46589, 46588, 46587, 46586, 46585, 46584, 46583, 46582, 46581, 46580, 46579, 46578, 46577, 46576, 46575, 46574, 46573, 46572, 46571, 46570, 46569, 46568, 46567, 46566, 46565, 46564, 46563, 46562, 46561, 46560, 46559, 46558, 46557, 46556, 46555, 46554, 46553, 46552, 46551, 46550, 46549, 46548, 46547, 46546, 46545, 46544, 46543, 46542, 46541, 46540, 46539, 46538, 46537, 46536, 46535, 46534, 46533, 46532, 46384, 46383, 46382, 46381, 46380, 46379, 46378, 46377, 46376, 46375, 46374, 46373, 46372, 46371, 46370, 46369, 46368, 46367, 46366, 46365, 46364, 46363, 46362, 46361, 46360, 46359, 46358, 46357, 46356, 46355, 46354, 46353, 46352, 46351, 46350, 46349, 46348, 46347, 46346, 46345, 46344, 46343, 46342, 46341, 46340, 46339, 46338, 46337, 46336, 46335, 46334, 46333, 46332, 46331, 46330, 46329, 46328, 46327, 46326, 46174, 46173, 46172, 46171, 46170, 46169, 46168, 46167, 46166, 46165, 46164, 46163, 46162, 46161, 46160, 46159, 46158, 46157, 46156, 46155, 46154, 46153, 46152, 46151, 46150, 46149, 46148, 46147, 46146, 46145, 46144, 46143, 46142, 46141, 46140, 46139, 46138, 46137, 46136, 46135, 46134, 46133, 46132, 46131, 46130, 46129, 46128, 46127, 46126, 46125, 46124, 46123, 46122, 46121, 46120, 46119, 46118, 46117, 46083, 46082, 46081, 46080, 46079, 46078, 46077, 46076, 46075, 46074, 46073, 46072, 46071, 46070, 46069, 46068, 46067, 46066, 46065, 46064, 46063, 46062, 46061, 46060, 46059, 46058, 46057, 46056, 46055, 46054, 46053, 46052, 46051, 46050, 46049, 46048, 46047, 46046, 46045, 46044, 46043, 46042, 46041, 46040, 46039, 46038, 46037, 46036, 46035, 46034, 46033, 46032, 46031, 46030, 46029, 46028, 46027, 45787, 45786, 45785, 45784, 45783, 45782, 45781, 45780, 45779, 45778, 45777, 45776, 45775, 45774, 45773, 45772, 45771, 45770, 45769, 45768, 45767, 45766, 45765, 45764, 45763, 45762, 45761, 45760, 45759, 45758, 45757, 45756, 45755, 45754, 45753, 45752, 45751, 45750, 45749, 45748, 45747, 45746, 45745, 45744, 45743, 45742, 45741, 45740, 45739, 45738, 45737, 45736, 45735, 45734, 45733, 45732, 45731, 45730, 45716, 45715, 45714, 45713, 45712, 45711, 45710, 45709, 45708, 45707, 45706, 45705, 45704, 45703, 45702, 45701, 45700, 45699, 45698, 45697, 45696, 45695, 45694, 45693, 45692, 45691, 45690, 45689, 45688, 45687, 45686, 45685, 45684, 45683, 45682, 45681, 45680, 45679, 45678, 45677, 45676, 45675, 45674, 45673, 45672, 45671, 45670, 45669, 45668, 45667, 45666, 45665, 45664, 45663, 45662, 45661, 45660, 45659, 45658, 45590, 45589, 45588, 45587, 45586, 45585, 45584, 45583, 45582, 45581, 45580, 45579, 45578, 45577, 45576, 45575, 45574, 45573, 45572, 45571, 45570, 45569, 45568, 45567, 45566, 45565, 45564, 45563, 45562, 45561, 45560, 45559, 45558, 45557, 45556, 45555, 45554, 45553, 45552, 45551, 45550, 45549, 45548, 45547, 45546, 45545, 45544, 45543, 45542, 45541, 45540, 45419, 45418, 45417, 45416, 45415, 45414, 45413, 45412, 45411, 45410, 45409, 45408, 45407, 45406, 45405, 45404, 45403, 45402, 45401, 45400, 45399, 45398, 45397, 45396, 45395, 45394, 45393, 45392, 45391, 45390, 45389, 45388, 45387, 45386, 45385, 45384, 45383, 45382, 45381, 45380, 45379, 45378, 45377, 45376, 45375, 45374, 45373, 45372, 45371, 45370, 45369, 45368, 45367, 45366, 45365, 45364, 45362, 45361, 45360, 45237, 45236, 45235, 45234, 45233, 45232, 45231, 45230, 45229, 45228, 45227, 45226, 45225, 45224, 45223, 45222, 45221, 45220, 45219, 45218, 45217, 45216, 45215, 45214, 45213, 45212, 45210, 45209, 45208, 45207, 45206, 45205, 45204, 45203, 45202, 45201, 45200, 45199, 45198, 45197, 45196, 45195, 45194, 45193, 45192, 45191, 45190, 45189, 45188, 45187, 45186, 45185, 45184, 45183, 45182, 45181, 45180, 45179, 45178, 45103, 45102, 45101, 45100, 45099, 45098, 45097, 45096, 45095, 45094, 45093, 45092, 45091, 45090, 45089, 45088, 45087, 45086, 45085, 45084, 45083, 45082, 45081, 45080, 45079, 45078, 45077, 45076, 45075, 45074, 45073, 45072, 45071, 45070, 45069, 45068, 45067, 45066, 45065, 45064, 45063, 45062, 45061, 45060, 45059, 45058, 45057, 45056, 45054, 45053, 45052, 45051, 45050, 45049, 45048, 45047, 45046, 45045, 45044, 44973, 44972, 44971, 44970, 44969, 44968, 44967, 44966, 44964, 44963, 44962, 44961, 44960, 44959, 44958, 44957, 44956, 44955, 44954, 44953, 44952, 44951, 44950, 44949, 44947, 44946, 44945, 44944, 44943, 44942, 44941, 44940, 44939, 44938, 44937, 44936, 44935, 44934, 44933, 44932, 44931, 44930, 44929, 44928, 44927, 44926, 44925, 44924, 44923, 44922, 44921, 44920, 44919, 44918, 44917, 44916, 44915, 44914, 44772, 44771, 44770, 44769, 44768, 44767, 44766, 44765, 44764, 44763, 44762, 44761, 44760, 44759, 44758, 44757, 44756, 44755, 44754, 44753, 44752, 44751, 44750, 44749, 44748, 44747, 44746, 44744, 44743, 44742, 44741, 44740, 44739, 44738, 44737, 44736, 44735, 44734, 44733, 44732, 44731, 44730, 44729, 44728, 44727, 44726, 44725, 44724, 44723, 44722, 44721, 44720, 44719, 44718, 44717, 44716, 44715, 44714, 44713, 44289, 44287, 44286, 44282, 44281, 44279, 44275, 44273, 44268, 44257, 44252, 44249, 44240, 44238
            ];
            var GPS = [20959, 22877, 23953, 24876, 25933, 26360, 26407, 26605, 26690, 27663, 27704, 28129, 28190, 28361, 28474, 28874, 29486, 29601, 32260, 32384, 32711, 35752, 36585, 37753, 38833, 39166, 39533, 39741, 40105, 40294, 40534];
            var GLONASS = [28915, 29672, 29670, 29671, 32276, 32275, 32393, 32395, 36111, 36112, 36113, 36400, 36402, 36401, 37139, 37138, 37137, 37829, 37869, 37867, 37868, 39155, 39620, 40001];
            var INMARSAT = [20918, 21149, 21814, 21940, 23839, 24307, 24674, 24819, 25153, 28628, 28899, 33278, 40384, 39476];
            var LANDSAT = [25682, 39084];
            var DIGITALGLOBE = [25919, 32060, 33331, 35946, 40115];
            var SPACESTATIONS = [
                25544, // International Space Station
                41765  // Tiangong-2
            ];

            // Orbital altitude definitions.
            var LOW_ORBIT = 2000;
            var GEOSYNCHRONOUS_ORBIT = 35786;

            // Satellite database urls.
            var NASA_SATELLITE_DATABASE = 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id='; // use International id
            var N2YO_SATELLITE_DATABASE = 'https://www.n2yo.com/satellite/?s=';                            // use NORAD id

            // Rendering variables.
            var renderer = null;

            // Create map and view
            var view = new SceneView({
                map: new Map({
                    basemap: 'satellite'
                }),
                container: 'map',
                ui: {
                    components: [
                        'zoom',
                        'compass'
                    ]
                },
                environment: {
                    lighting: {
                        directShadowsEnabled: false,
                        ambientOcclusionEnabled: false,
                        cameraTrackingEnabled: false
                    },
                    atmosphereEnabled: true,
                    atmosphere: {
                        quality: 'high'
                    },
                    starsEnabled: false
                },
                constraints: {
                    altitude: {
                        max: 12000000000
                    }
                }
            });
            view.when(function () {
                // Set initial camera position
                view.set('camera', Camera.fromJSON({
                    'position': {
                        'x': -1308000,
                        'y': 2670000,
                        'spatialReference': {
                            'wkid': 102100,
                            'latestWkid': 3857
                        },
                        'z': 110000000
                    }
                }));

                // Increase far clipping plane
                view.constraints.clipDistance.far *= 4;

                // Load satellites
                loadSatellites().done(function (satellites) {
                    // Load satellite layer
                    renderer = new Renderer(satellites);
                    ExternalRenderers.add(
                        view,
                        renderer
                    );

                    // Show satellite count
                    updateCounter();

                    // Load metadata
                    loadMetadata().done(function (metadata) {
                        $.each(renderer.satellites, function () {
                            this.metadata = metadata[this.id];
                        });
                    });
                });
            });
            view.on('click', function (e) {
                // Highlighted satellite
                var sat = renderer.satelliteHover;

                // Nothing selected. Hide orbit and close information window.
                if (sat === null) {
                    renderer.hideOrbit();
                    showDialog('main');
                    return;
                }

                // Display information panel
                $('#infoWindow-title').html(sat.metadata.name);
                $('#infoWindow-norad').html(sat.id);
                $('#infoWindow-int').html(sat.metadata.int);
                $('#infoWindow-name').html(sat.metadata.name);
                $('#infoWindow-country').html(sat.metadata.country);
                $('#infoWindow-period').html(number.format(sat.metadata.period, {
                    places: 2
                }) + ' min');
                $('#infoWindow-inclination').html(sat.metadata.inclination + '°');
                $('#infoWindow-apogee').html(number.format(sat.metadata.apogee, {
                    places: 0
                }) + ' km');
                $('#infoWindow-perigee').html(number.format(sat.metadata.perigee, {
                    places: 0
                }) + ' km');
                $('#infoWindow-size').html(sat.metadata.size);
                $('#infoWindow-launch').html(sat.metadata.launch.toLocaleDateString());
                $('#link-nasa').attr('href', string.substitute(NASA_SATELLITE_DATABASE + '${id}', { id: sat.metadata.int }));
                $('#link-n2yo').attr('href', string.substitute(N2YO_SATELLITE_DATABASE + '${id}', { id: sat.id }));
                showDialog('info');

                // Display the orbit for the click satellite
                renderer.showOrbit();
            });

            $('#map').mousemove(function (e) {
                if (!renderer) { return; }
                renderer.mousemove(e.offsetX, e.offsetY);
            });

            $('#bottom-left-help a').attr('target', '_blank');
            $('#bottom-left-about a').attr('target', '_blank');
            $('#link-nasa, #link-n2yo').attr('target', '_blank');

            $('.rc-close').click(function () {
                $.each(renderer.satellites, function () {
                    this.highlighted = false;
                });
                renderer.hideOrbit();
                showDialog('main');
            });

            // Enable bootstrap tooltips
            //$('[data-toggle="tooltip"]').tooltip();

            // Handle quick link presets
            $('#dropdown-presets > li > a').click(function () {
                resetUI();
                switch ($(this).attr('data-value')) {
                    case 'space-stations':
                        $.each(renderer.satellites, function () {
                            this.selected = SPACESTATIONS.indexOf(this.id) !== -1;
                        });
                        break;
                    case 'starlink':
                        $.each(renderer.satellites, function () {
                            this.selected = STARLINK.indexOf(this.id) !== -1;
                        });
                        break;
                    case 'gps':
                        $.each(renderer.satellites, function () {
                            this.selected = GPS.indexOf(this.id) !== -1;
                        });
                        break;
                    case 'glonass':
                        $.each(renderer.satellites, function () {
                            this.selected = GLONASS.indexOf(this.id) !== -1;
                        });
                        break;
                    case 'inmarsat':
                        $.each(renderer.satellites, function () {
                            this.selected = INMARSAT.indexOf(this.id) !== -1;
                        });
                        break;
                    case 'landsat':
                        $.each(renderer.satellites, function () {
                            this.selected = LANDSAT.indexOf(this.id) !== -1;
                        });
                        break;
                    case 'digitalglobe':
                        $.each(renderer.satellites, function () {
                            this.selected = DIGITALGLOBE.indexOf(this.id) !== -1;
                        });
                        break;
                    case 'reset':
                        selectSatellites();
                        break;
                }
                updateCounter();
                renderer.updateSelection();
            });

            // Reset UI
            $('#buttonReset').click(function () {
                resetUI();
                selectSatellites();
                updateCounter();
                renderer.updateSelection();
            });

            // Country
            $('.rc-country > button').click(function () {
                $('.rc-country > button').removeClass('active');
                $(this).addClass('active');
                selectSatellites();
                updateCounter();
                renderer.updateSelection();
            });

            function showDialog(name) {
                $('.rc-panel[data-panel!="' + name + '"]').animate({ 'margin-left': '-250px' }, {
                    duration: 300,
                    easing: 'swing',
                    queue: false,
                    complete: function () {
                        $('.rc-panel[data-panel="' + name + '"]').animate({ 'margin-left': '0px' }, {
                            duration: 300,
                            easing: 'swing',
                            queue: false
                        });
                    }
                });
            }

            function selectSatellites() {
                // Country
                var country = $('.rc-country > button.active').attr('data-value');

                // Exit if nothing selected
                if (country === 'none') {
                    $.each(renderer.satellites, function () {
                        this.selected = false;
                    });
                    return;
                }

                //
                $.each(renderer.satellites, function () {
                    // Reset selection
                    this.selected = false;

                    // Exit if metadata is missing
                    if (this.metadata === null || this.metadata === undefined) { return true; }

                    // Select by country
                    if (country !== 'none') {
                        if (this.metadata.country !== country) { return true; }
                    }

                    // Select satellite
                    this.selected = true;
                });
            }

            function updateCounter() {
                var selected = 0;
                $.each(renderer.satellites, function () {
                    if (this.selected) {
                        selected++;
                    }
                });
                if (selected === 0) {
                    $('#satellite-count').html(
                        string.substitute('${count} satellites loaded', {
                            count: number.format(renderer.satellites.length, {
                                places: 0
                            })
                        })
                    );
                } else {
                    $('#satellite-count').html(
                        string.substitute('${found} of ${count} satellites found', {
                            found: number.format(selected, {
                                places: 0
                            }),
                            count: number.format(renderer.satellites.length, {
                                places: 0
                            })
                        })
                    );
                }
            }

            function loadSatellites() {
                var defer = new $.Deferred();
                $.get(TLE, function (data) {
                    var lines = data.split('\n');
                    var count = (lines.length / 2).toFixed(0);
                    var satellites = [];
                    for (var i = 0; i < count; i++) {
                        var line1 = lines[i * 2 + 0];
                        var line2 = lines[i * 2 + 1];
                        var satrec = null;
                        try {
                            satrec = satellite.twoline2satrec(line1, line2);
                        }
                        catch (err) {
                            continue;
                        }
                        if (satrec === null || satrec === undefined) { continue; }
                        satellites.push({
                            id: Number(line1.substring(2, 7)),
                            satrec: satrec,
                            selected: false,
                            highlighted: false,
                            metadata: null
                        });
                    }
                    defer.resolve(satellites);
                });
                return defer.promise();
            }

            function loadMetadata() {
                var defer = new $.Deferred();
                $.get(OIO, function (data) {
                    var metadata = {};
                    var lines = data.split('\n');
                    $.each(lines, function () {
                        var items = this.split(',');
                        var int = items[0];
                        var name = items[1];
                        var norad = Number(items[2]);
                        var country = items[3];
                        var period = items[4];
                        var inclination = items[5];
                        var apogee = items[6];
                        var perigee = items[7];
                        var size = items[8];
                        var launch = new Date(items[10]);
                        metadata[norad] = {
                            int: int,
                            name: name,
                            country: country,
                            period: period,
                            inclination: inclination,
                            apogee: apogee,
                            perigee: perigee,
                            size: size,
                            launch: launch
                        };
                    });
                    defer.resolve(metadata);
                });
                return defer.promise();
            }

            function resetUI() {
                $('.rc-country > button').removeClass('active').siblings('[data-value="none"]').addClass('active');
                $('.rc-type > button').removeClass('active').siblings('[data-value="none"]').addClass('active');
                $('.rc-size > button').removeClass('active').siblings('[data-value="none"]').addClass('active');
            }

        });
    }
);
