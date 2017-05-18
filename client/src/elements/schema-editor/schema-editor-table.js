import { bindable, inject, Loader } from 'aurelia-framework';
import array2d from 'array2d';

function hasNonNullInArray(arr) {
  for (let val of arr) {
    if (val !== null) {
      return true;
    }
  }
  return false;
}

function trimNull(data) {
  let lastColumnWithValues = 0;
  array2d.eachColumn(data, (column, index) => {
    if (hasNonNullInArray(column)) {
      lastColumnWithValues = index;
    }
  });

  let lastRowWithValues = 0;
  array2d.eachRow(data, (row, index) => {
    if (hasNonNullInArray(row)) {
      lastRowWithValues = index;
    }
  });

  return array2d.crop(data, 0, 0, lastColumnWithValues + 1, lastRowWithValues + 1);
}

function emptyToNull(data) {
  array2d.eachCell(data, (cell, i, j) => {
    if (cell === '' || cell === undefined) {
      data[i][j] = null;
    }
  });
  return data;
}

@inject(Loader)
export class SchemaEditorTable {

  @bindable schema;
  @bindable data;
  @bindable change;

  constructor(loader) {
    this.loader = loader;
  }

  dataChanged() {
    this.hotData = JSON.parse(JSON.stringify(this.data));
  }

  async attached() {
    this.loader.loadModule('handsontable/dist/handsontable.full.css!');
    const Handsontable = await this.loader.loadModule('handsontable/dist/handsontable.full.js');

    this.hot = new Handsontable(this.tableContainerElement, {
      dataSchema: [],
      height: this.getGridHeight(),
      minRows: 5,
      minCols: 5,
      minSpareRows: 1,
      minSpareCols: 1,
      rowHeaders: true,
      colHeaders: false,
      contextMenu: false,
      colWidths: 70,
      rowHeights: 23,
      afterChange: (changes, source) => {
        if (this.hot) {
          this.replaceCommaWithPointIfDecimal();
          this.hot.updateSettings({
            height: this.getGridHeight()
          });
        }
        if (source !== 'loadData') {
          this.data = trimNull(emptyToNull(this.hot.getData()));
          this.change();
        }
      }
    });
    if (Array.isArray(this.hotData)) {
      this.hot.loadData(this.hotData);
    }
  }

  getGridHeight() {
    return Math.min(280, Math.max(5, this.data.length) * 23) + 30;
  }

  replaceCommaWithPointIfDecimal() {
    let changed = false;
    try {
      const newData = this.data
        .map((row, rowIndex) => row.map((cell, colIndex) => {
          // do not change the first row or column
          if (rowIndex === 0 || colIndex === 0) {
            return cell;
          }

          if (!cell) {
            return cell;
          }

          if (cell.indexOf(',') === -1) {
            return cell;
          }

          // replace first , with .
          let str = cell.replace(',', '.');

          // only one comma, if more, we dont change it
          if (str.indexOf(',') > -1) {
            return cell;
          }

          // if we do not have a floating point number now, return the original
          if (str.search(/-*\d*\.\d*/) !== 0) {
            return cell;
          }

          changed = true;
          return str;
        }));

      if (changed) {
        this.hot.loadData(newData);
        this.data = trimNull(emptyToNull(this.hot.getData()));
        this.change();
      }
    } catch (e) {
      // just ignore errors, if no data is here, we don't need to replace any ,
    }
    return changed;
  }

  transpose() {
    this.hot.loadData(array2d.transpose(this.hot.getData()));
    this.data = trimNull(emptyToNull(this.hot.getData()));
    this.change();
  }
}
