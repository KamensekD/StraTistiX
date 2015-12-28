var CyclingGradeDataView = AbstractGradeDataView.extend(function(base) {

    return {

        init: function(gradeData, units) {

            this.setViewId('CyclingGradeDataView_pdskdj4475');

            base.init.call(this, gradeData, units);
        },

        insertGradeDataIntoGrid: function() {

            base.insertGradeDataIntoGrid.call(this);

            var speedUnitPerhour = this.speedUnitsData[0];
            var speedUnitFactor = this.speedUnitsData[1];
            var distanceUnits = this.speedUnitsData[2];
            
            this.insertContentAtGridPosition(0, 3, (this.gradeData.upFlatDownSpeed.down * speedUnitFactor).toFixed(1), 'Avg downhill speed', speedUnitPerhour, 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(1, 3, (this.gradeData.upFlatDownSpeed.flat * speedUnitFactor).toFixed(1), 'Avg flat speed', speedUnitPerhour, 'displayAdvancedGradeData');
            this.insertContentAtGridPosition(2, 3, (this.gradeData.upFlatDownSpeed.up * speedUnitFactor).toFixed(1), 'Avg climbing speed', speedUnitPerhour, 'displayAdvancedGradeData');
        }
    }
});
