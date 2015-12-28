var RunnningGradeDataView = AbstractGradeDataView.extend(function(base) {

    return {

        init: function(gradeData, units) {

            this.setViewId('RunnningGradeDataView_pdskdj4475');

            base.init.call(this, gradeData, units);
        },

        insertGradeDataIntoGrid: function() {

            base.insertGradeDataIntoGrid.call(this);

            var speedUnitPerhour = this.speedUnitsData[0];
            var speedUnitFactor = this.speedUnitsData[1];
            var distanceUnits = this.speedUnitsData[2];

            this.gradeData.upFlatDownSpeed.down = this.convertSpeedToPace(this.gradeData.upFlatDownSpeed.down);
            this.gradeData.upFlatDownSpeed.flat = this.convertSpeedToPace(this.gradeData.upFlatDownSpeed.flat);
            this.gradeData.upFlatDownSpeed.up = this.convertSpeedToPace(this.gradeData.upFlatDownSpeed.up);

            this.insertContentAtGridPosition(0, 3, (this.gradeData.upFlatDownSpeed.down / speedUnitFactor != 0) ? Helper.secondsToHHMMSS((this.gradeData.upFlatDownSpeed.down / speedUnitFactor).toFixed(0)).replace('00:', '') : '-', 'Avg downhill pace', '/' + distanceUnits, 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(1, 3, (this.gradeData.upFlatDownSpeed.flat / speedUnitFactor != 0) ? Helper.secondsToHHMMSS((this.gradeData.upFlatDownSpeed.flat / speedUnitFactor).toFixed(0)).replace('00:', '') : '-', 'Avg flat pace', '/' + distanceUnits, 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(2, 3, (this.gradeData.upFlatDownSpeed.up / speedUnitFactor != 0) ? Helper.secondsToHHMMSS((this.gradeData.upFlatDownSpeed.up / speedUnitFactor).toFixed(0)).replace('00:', '') : '-', 'Avg climbing pace', '/' + distanceUnits, 'displayAdvancedGradeData');
        }
    }
});
