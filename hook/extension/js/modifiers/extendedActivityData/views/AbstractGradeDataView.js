var AbstractGradeDataView = AbstractDataView.extend(function(base) {

    return {

        gradeData: null,

        mainColor: [0, 128, 0],

        init: function(gradeData, units) {
            
            base.init.call(this);

            this.units = units;

            this.gradeData = gradeData;

            this.setupDistributionGraph(this.gradeData.gradeZones);

            this.setupDistributionTable(this.gradeData.gradeZones);

            this.speedUnitsData = this.getSpeedUnitData();

        },

        render: function() {

            base.render.call(this);

            // Add a title
            this.content += this.generateSectionTitle('Grade stats <a style="font-size: 16px;" target="_blank" href="' + this.appResources.settingsLink + '#/zonesSettings">(customize)</a>');

            // Creates a grid
            this.makeGrid(3, 6); // (col, row)

            this.insertGradeDataIntoGrid();
            this.generateCanvasForGraph();

            // Push grid, graph and table to content view
            this.content += this.grid.html();
            this.content += this.graph.html();
            this.content += this.table.html();
        },

        insertGradeDataIntoGrid: function() {

            this.insertContentAtGridPosition(0, 0, this.gradeData.gradeProfile, 'Grade Profile', '', 'displayAdvancedGradeData');


            this.insertContentAtGridPosition(0, 1, (this.gradeData.upFlatDownInSeconds.down / this.gradeData.upFlatDownInSeconds.total * 100).toFixed(1), 'downhill time', '%', 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(1, 1, (this.gradeData.upFlatDownInSeconds.flat / this.gradeData.upFlatDownInSeconds.total * 100).toFixed(1), 'flat time', '%', 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(2, 1, (this.gradeData.upFlatDownInSeconds.up / this.gradeData.upFlatDownInSeconds.total * 100).toFixed(1), 'climbing time', '%', 'displayAdvancedGradeData');

            this.insertContentAtGridPosition(0, 2, Helper.secondsToHHMMSS(this.gradeData.upFlatDownInSeconds.down), 'Time downhill', '', 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(1, 2, Helper.secondsToHHMMSS(this.gradeData.upFlatDownInSeconds.flat), 'Time flat', '', 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(2, 2, Helper.secondsToHHMMSS(this.gradeData.upFlatDownInSeconds.up), 'Time climbing', '', 'displayAdvancedGradeData');

            this.insertContentAtGridPosition(0, 4, (this.gradeData.upFlatDownInMeters.down/1000).toFixed(1), 'distance downhill', 'km', 'displayAdvancedElevationData');
            this.insertContentAtGridPosition(1, 4, (this.gradeData.upFlatDownInMeters.flat/1000).toFixed(1), 'distance flat', 'km', 'displayAdvancedElevationData');
            this.insertContentAtGridPosition(2, 4, (this.gradeData.upFlatDownInMeters.up/1000).toFixed(1), 'distance climbing', 'km', 'displayAdvancedElevationData');

            this.insertContentAtGridPosition(0, 5, this.gradeData.upperQuartileGrade, '75% Quartile Grade', '%', 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(1, 5, this.gradeData.medianGrade, '50% Quartile Grade', '%', 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(2, 5, this.gradeData.lowerQuartileGrade, '25% Quartile Grade', '%', 'displayAdvancedGradeData');

        }
    }
});
