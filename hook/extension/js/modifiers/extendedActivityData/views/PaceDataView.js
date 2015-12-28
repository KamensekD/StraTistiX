var PaceDataView = AbstractDataView.extend(function(base) {

    return {

        paceData: null,

        mainColor: [9, 123, 219],

        init: function(paceData, units) {

            this.setViewId('PaceDataView_sqfdsf584ds1a');

            base.init.call(this);

            this.units = units;

            this.paceData = paceData;

            this.speedUnitsData = this.getSpeedUnitData();
            var speedUnitFactor = this.speedUnitsData[1];

            // To be overriden..
            this.setupDistributionGraph(this.paceData.paceZones, 1 / speedUnitFactor);
            this.setupDistributionTable(this.paceData.paceZones, 1 / speedUnitFactor);

        },

        render: function() {

            // Super render () call
            base.render.call(this);

            // Add a title
            this.content += this.generateSectionTitle('Pace stats <a style="font-size: 16px;" target="_blank" href="' + this.appResources.settingsLink + '#/zonesSettings">(customize)</a>');

            // Creates a grid
            this.makeGrid(3,5); // (col, row)

            this.insertPaceDataIntoGrid();
            this.generateCanvasForGraph();


            // Push grid, graph and table to content view
            this.content += this.grid.html();
            this.content += this.graph.html();
            this.content += this.table.html();
        },

        insertPaceDataIntoGrid: function() {

            var speedUnitPerhour = this.speedUnitsData[0];
            var speedUnitFactor = this.speedUnitsData[1];
            var distanceUnits = this.speedUnitsData[2];


            this.insertContentAtGridPosition(1, 0, this.paceData.realAvgSpeed.toFixed(1), 'Real Average Speed', this.units, 'displayCadenceData');

            // Quartiles Speed
            this.insertContentAtGridPosition(0, 1, (this.paceData.lowerQuartileSpeed * speedUnitFactor).toFixed(1), '25% Quartile Speed', speedUnitPerhour, 'displayAdvancedSpeedData');
            this.insertContentAtGridPosition(1, 1, (this.paceData.medianSpeed * speedUnitFactor).toFixed(1), '50% Quartile Speed', speedUnitPerhour, 'displayAdvancedSpeedData');
            this.insertContentAtGridPosition(2, 1, (this.paceData.upperQuartileSpeed * speedUnitFactor).toFixed(1), '75% Quartile Speed', speedUnitPerhour, 'displayAdvancedSpeedData');

            this.insertContentAtGridPosition(1, 2, Helper.secondsToHHMMSS((this.paceData.realAvgPace / speedUnitFactor).toFixed(0)).replace('00:', ''), 'Average Pace', this.units, 'displayCadenceData');

          // Quartiles Pace
            this.insertContentAtGridPosition(0, 3, Helper.secondsToHHMMSS((this.paceData.lowerQuartilePace / speedUnitFactor).toFixed(0)).replace('00:', ''), '25% Quartile Pace', this.units, 'displayAdvancedSpeedData');
            this.insertContentAtGridPosition(1, 3, Helper.secondsToHHMMSS((this.paceData.medianPace / speedUnitFactor).toFixed(0)).replace('00:', ''), '50% Quartile Pace', this.units, 'displayAdvancedSpeedData');
            this.insertContentAtGridPosition(2, 3, Helper.secondsToHHMMSS((this.paceData.upperQuartilePace / speedUnitFactor).toFixed(0)).replace('00:', ''), '75% Quartile Pace', this.units, 'displayAdvancedSpeedData');

//            this.insertContentAtGridPosition(2, 0, Helper.secondsToHHMMSS((this.paceData.standardDeviationPace / speedUnitFactor).toFixed(0)).replace('00:', ''), 'Std Deviation &sigma;', this.units, 'displayAdvancedSpeedData');
			if (this.paceData.standardDeviationSpeed) this.insertContentAtGridPosition(1, 4, (this.paceData.standardDeviationSpeed * speedUnitFactor).toFixed(1), 'Std Deviation &sigma;', speedUnitPerhour, 'displayAdvancedSpeedData');

            // this.insertContentAtGridPosition(1, 1, (this.paceData.genuineAvgSpeed * speedUnitFactor).toFixed(1), 'Genuine average speed', speedUnitPerhour, 'displayAdvancedSpeedData'); // DELAYED_FOR_TESTING
            // this.insertContentAtGridPosition(2, 1, paceTimePerDistance, 'Genuine average pace', '/' + distanceUnits, 'displayAdvancedSpeedData'); // DELAYED_FOR_TESTING

        },

        setupDistributionTable: function(zones, ratio) {

            if (!ratio) {
                ratio = 1;
            }

            if (!this.units) {
                console.error('View must have unit');
                return;
            }

            var table = '';
            table += '<div>';
            table += '<div>';
            table += '<table class="distributionTable">';

            // Generate table header
            table += '<tr>'; // Zone
            table += '<td></td>'; // Zone
            table += '<td><strong>From<br/>time' + this.units.toLowerCase() + '</strong></td>'; // bpm
            table += '<td><strong>To<br/>time' + this.units.toLowerCase() + '</strong></td>'; // bpm
            table += '<td><strong>Time</strong><br/>(hh:mm:ss)</td>'; // Time
            table += '<td><strong>%</strong></td>'; // % in zone
            table += '</tr>';

            var zoneId = 1;
            for (var zone in zones) {
                
                var from = (zones[zone].from === 'infinite') ? '&infin;' : Helper.secondsToHHMMSS((zones[zone].from * ratio).toFixed(0)).replace('00:', '');

                table += '<tr>'; // Zone
                table += '<td>Z' + zoneId + '</td>'; // Zone
                table += '<td>' + from + '</th>'; // %HRR
                table += '<td>' + Helper.secondsToHHMMSS((zones[zone].to * ratio).toFixed(0)).replace('00:', '') + '</th>'; // %HRR
                table += '<td>' + Helper.secondsToHHMMSS(zones[zone].s) + '</td>'; // Time%
                table += '<td>' + zones[zone].percentDistrib.toFixed(1) + '%</td>'; // % in zone
                table += '</tr>';
                zoneId++;
            }

            table += '</table>';
            table += '</div>';
            table += '</div>';
            this.table = $(table);
        },

        setupDistributionGraph: function(zones, ratio) {

            if (!ratio) {
                ratio = 1;
            }

            var labelsData = [];
            for (var zone in zones) {
                var from = (zones[zone].from === 'infinite') ? 'Infinite' : Helper.secondsToHHMMSS((zones[zone].from * ratio).toFixed(0)).replace('00:', '');
//                var label = "Z" + (parseInt(zone) + 1) + ": " + from + " - " + Helper.secondsToHHMMSS((zones[zone].to * ratio).toFixed(0)).replace('00:', '') + " " + this.units;
                var label = "Z" + (parseInt(zone) + 1) + ":   " + from + " - " + Helper.secondsToHHMMSS((zones[zone].to * ratio).toFixed(0)).replace('00:', '');
                labelsData.push(label);
            }

            var distributionArray = [];
            for (var zone in zones) {
                distributionArray.push((zones[zone].s / 60).toFixed(2));
            }

            this.graphData = {
                labels: labelsData,
                datasets: [{
                    label: "Distribution",
                    fillColor: "rgba(" + this.mainColor[0] + ", " + this.mainColor[1] + ", " + this.mainColor[2] + ", 0.5)",
                    strokeColor: "rgba(" + this.mainColor[0] + ", " + this.mainColor[1] + ", " + this.mainColor[2] + ", 0.8)",
                    highlightFill: "rgba(" + this.mainColor[0] + ", " + this.mainColor[1] + ", " + this.mainColor[2] + ", 0.75)",
                    data: distributionArray
                }]
            };
        }
    }
});
