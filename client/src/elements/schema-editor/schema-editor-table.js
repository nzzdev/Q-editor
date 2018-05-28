import { bindable, inject, Loader } from "aurelia-framework";
import { checkAvailability } from "resources/schemaEditorDecorators.js";
import array2d from "array2d";

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

  return array2d.crop(
    data,
    0,
    0,
    lastColumnWithValues + 1,
    lastRowWithValues + 1
  );
}

function emptyToNull(data) {
  array2d.eachCell(data, (cell, i, j) => {
    if (cell === "" || cell === undefined) {
      data[i][j] = null;
    }
  });
  return data;
}

@checkAvailability()
@inject(Loader)
export class SchemaEditorTable {
  @bindable schema;
  @bindable data;
  @bindable change;

  options = {
    allowTranspose: true,
    minRowsDataTable: 8
  };

  constructor(loader) {
    this.loader = loader;
  }

  dataChanged() {
    this.hotData = JSON.parse(JSON.stringify(this.data));
  }

  async schemaChanged() {
    this.applyOptions();
  }

  applyOptions() {
    if (!this.schema) {
      return;
    }
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
    }
  }

  async attached() {
    this.loader.loadModule("handsontable/dist/handsontable.full.css!");
    const Handsontable = await this.loader.loadModule(
      "handsontable/dist/handsontable.full.js"
    );

    this.hot = new Handsontable(this.tableContainerElement, {
      dataSchema: [],
      height: this.getGridHeight(),
      minRows: this.options.minRowsDataTable,
      minCols: 5,
      minSpareRows: 1,
      minSpareCols: 1,
      rowHeaders: true,
      colHeaders: true,
      manualColumnResize: true,
      wordWrap: false,
      contextMenu: false,
      stretchH: "all",
      rowHeights: 23,
      afterChange: (changes, source) => {
        if (source !== "loadData") {
          this.data = trimNull(emptyToNull(this.hot.getData()));
          this.change();
        }
        if (this.hot) {
          this.replaceCommaWithPointIfDecimal();
          this.hot.updateSettings({
            height: this.getGridHeight()
          });
        }
      }
    });
    if (Array.isArray(this.hotData)) {
      this.hot.loadData(this.hotData);
    }
  }

  getGridHeight() {
    return (
      Math.min(
        280,
        Math.max(this.options.minRowsDataTable, this.data.length) * 23
      ) + 30
    );
  }

  replaceCommaWithPointIfDecimal() {
    let changed = false;
    try {
      const newData = this.hot.getData().map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // do not change the first row or column
          if (rowIndex === 0 || colIndex === 0) {
            return cell;
          }

          if (!cell) {
            return cell;
          }

          if (cell.indexOf(",") === -1) {
            return cell;
          }

          // replace first , with .
          let str = cell.replace(",", ".");

          // only one comma, if more, we dont change it
          if (str.indexOf(",") > -1) {
            return cell;
          }

          // if we do not have a floating point number now, return the original
          if (str.search(/-*\d*\.\d*/) !== 0) {
            return cell;
          }

          changed = true;
          return str;
        })
      );

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
