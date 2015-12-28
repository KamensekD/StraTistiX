var CyclingCadenceDataView = AbstractCadenceDataView.extend(function(base) {

    return {

        cadenceData: null,

        mainColor: [213, 0, 195],

        init: function(cadenceData, units) {

            this.setViewId('CyclingCadenceDataView_p8a5d4gl56ds4');

            this.units = units;

            base.init.call(this, cadenceData);
        },

        render: function() {

            this.viewTitle += ' <a style="font-size: 16px;" target="_blank" href="' + this.appResources.settingsLink + '#/zonesSettings">(customize)</a>';

            base.render.call(this);

            // Creates a grid
            this.makeGrid(3, 4); // (col, row)

            this.insertCadenceDataIntoGrid();
            this.generateCanvasForGraph();

            // Push grid, graph and table to content view
            this.content += this.grid.html();
            this.content += this.graph.html();
            this.content += this.table.html();
        },

        insertCadenceDataIntoGrid: function() {

            this.insertContentAtGridPosition(0, 0, Helper.secondsToHHMMSS(this.cadenceData.cadenceTimeMoving), 'Pedaling Time', '', 'displayCadenceData');
            this.insertContentAtGridPosition(1, 0, this.cadenceData.cadencePercentageMoving.toFixed(2), 'Pedaling %', '%', 'displayCadenceData');
            this.insertContentAtGridPosition(2, 0, this.cadenceData.crankRevolutions.toFixed(0), 'Crank Revolutions', '', 'displayCadenceData');

            this.insertContentAtGridPosition(1, 1, this.cadenceData.averageCadenceMoving.toFixed(1), 'Average Cadence', this.units, 'displayCadenceData');

            this.insertContentAtGridPosition(0, 2, this.cadenceData.lowerQuartileCadence, '25% Quartile Cadence', 'rpm', 'displayCadenceData');
            this.insertContentAtGridPosition(1, 2, this.cadenceData.medianCadence, '50% Quartile Cadence', 'rpm', 'displayCadenceData');
            this.insertContentAtGridPosition(2, 2, this.cadenceData.upperQuartileCadence, '75% Quartile Cadence', 'rpm', 'displayCadenceData');

            this.insertContentAtGridPosition(1, 3, this.cadenceData.standardDeviationCadence, 'Std Deviation &sigma;', this.units, 'displayCadenceData');
        }
    }
});
