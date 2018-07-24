import { bindable, inject, Loader } from "aurelia-framework";
import array2d from "array2d";

function getSchemaAtPath(schema, path) {
  if (path.includes(".")) {
    const pathParts = path.split(".");
    const firstPathPart = pathParts.shift();
    const remainingPath = pathParts.join(".");
    return getSchemaAtPath(schema.properties[firstPathPart], remainingPath);
  }
  return schema.properties[path];
}

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

class MetaData {
  constructor(initialMetaData) {
    this.data = initialMetaData;
    // set up the proxies
    if (this.data.cells) {
      this.setupCellsProxy();
    }
  }

  setupCellsProxy() {
    const rowProxies = [];
    this.cells = new Proxy(rowProxies, {
      get: (rowProxies, rowIndex, receiver) => {
        // here we fake the array of row indexes
        // and return a new Proxy for this row array if there is none already

        // parse this to an int if its a string
        if (typeof rowIndex === "string") {
          rowIndex = parseInt(rowIndex, 10);
        }

        if (!rowProxies[rowIndex]) {
          rowProxies[rowIndex] = new Proxy(this.data.cells, {
            get: (target, colIndex) => {
              // parse this to an int if its a string
              if (typeof colIndex === "string") {
                colIndex = parseInt(colIndex, 10);
              }
              let cellMetaDataObject = this.data.cells.find(
                cellMetaDataObject =>
                  cellMetaDataObject.rowIndex === rowIndex &&
                  cellMetaDataObject.colIndex === colIndex
              );
              if (!cellMetaDataObject) {
                cellMetaDataObject = {
                  colIndex: colIndex,
                  rowIndex: rowIndex,
                  data: {}
                };
                this.data.cells.push(cellMetaDataObject);
              }
              return cellMetaDataObject;
            }
          });
        }
        return rowProxies[rowIndex];
      }
    });
  }

  // used to remove empty metadata objects
  cleanup() {
    const cleanedUpCells = [];
    // cleanup cells
    this.data.cells = this.data.cells.filter(cell => {
      return Object.keys(cell.data).some(cellMetaDataProp => {
        if (
          cell.data[cellMetaDataProp] !== undefined &&
          cell.data[cellMetaDataProp] !== ""
        ) {
          return true;
        } else {
          cleanedUpCells.push(cell);
          return false;
        }
      });
    });
    return cleanedUpCells;
  }
}

@inject(Loader, Element)
export class SchemaEditorTable {
  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable required;

  options = {
    allowTranspose: true,
    minRowsDataTable: 8
  };

  constructor(loader, element) {
    this.loader = loader;
    this.element = element;
  }

  enabledMetaDataEditor() {
    this.metaDataEditorEnabled = true;
    this.metaEditorData = new MetaData(this.data.metaData);

    this.metaEditorSchema = getSchemaAtPath(
      this.schema,
      this.options.metaDataEditor.features.cells.propertyPath
    ).items;
  }

  setCellClassesFromMetaEditorState() {
    for (const cell of this.metaEditorData.data.cells) {
      const cellElement = this.hot.getCell(cell.rowIndex, cell.colIndex);
      if (cellElement) {
        cellElement.classList.add("schema-editor-table__cell--has-meta");
      }
    }
  }

  handleMetaEditorChange() {
    // cleanup on every change
    const cleanedUpCells = this.metaEditorData.cleanup();
    for (const cell of cleanedUpCells) {
      const cellElement = this.hot.getCell(cell.rowIndex, cell.colIndex);
      if (cellElement) {
        cellElement.classList.remove("schema-editor-table__cell--has-meta");
      }
    }
    this.setCellClassesFromMetaEditorState();
    // call the bound change function if given
    if (typeof this.change === "function") {
      this.change();
    }
  }

  setData(data) {
    if (this.metaDataEditorEnabled) {
      this.data[this.options.metaData.dataPropertyName] = data;
    } else {
      this.data = data;
    }
  }

  getData() {
    if (this.metaDataEditorEnabled) {
      return this.data[this.options.metaDataEditor.dataPropertyName];
    } else {
      return this.data;
    }
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
    if (this.options.metaDataEditor) {
      this.enabledMetaDataEditor();
    }

    this.hotData = JSON.parse(JSON.stringify(this.getData()));

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
      copyRowsLimit: 10000,
      afterChange: (changes, source) => {
        if (source !== "loadData") {
          this.setData(trimNull(emptyToNull(this.hot.getData())));
          this.change();
        }
        if (this.hot) {
          this.replaceCommaWithPointIfDecimal();
          this.hot.updateSettings({
            height: this.getGridHeight()
          });
        }
      },
      afterSelectionEnd: (row, column, row2, column2, selectionLayerLevel) => {
        // if we do not have the medaDataEditor enabled, there is nothing to do here
        if (!this.metaDataEditorEnabled) {
          return;
        }

        // a column is selected
        if (
          column === column2 &&
          row === 0 &&
          row2 === this.hot.countRows() - 1
        ) {
          // todo: implement the column metadata editing
          return this.hideMetaDataEditor();
        }

        // a row is selected
        if (
          row === row2 &&
          column === 0 &&
          column2 === this.hot.countCols() - 1
        ) {
          // todo: implement the row metadata editing
          return this.hideMetaDataEditor();
        }

        // a cell in the the first row is not valid as it contains the headers
        if (row === 0) {
          return this.hideMetaDataEditor();
        }

        // a single cell is selected
        if (row === row2 && column === column2) {
          // only if the cell metaData feature is enabled
          if (this.options.metaDataEditor.features.cells) {
            return this.showMetaDataEditorForCell(row, column);
          } else {
            return this.hideMetaDataEditor();
          }
        }
      }
    });
    if (Array.isArray(this.hotData)) {
      this.hot.loadData(this.hotData);
    }
    if (this.metaDataEditorEnabled) {
      this.setCellClassesFromMetaEditorState();
    }
  }

  hideMetaDataEditor() {
    this.metaEditorWrapper.classList.add(
      "schema-editor-table__meta-editor--hidden"
    );
    this.selectedRow = undefined;
    this.selectedColumn = undefined;
    if (this.selectedCellElement) {
      this.selectedCellElement.classList.remove(
        "schema-editor-table__cell--selected"
      );
      this.selectedCellElement = undefined;
    }
  }

  showMetaDataEditorForCell(rowIndex, colIndex) {
    this.metaEditorWrapper.classList.remove(
      "schema-editor-table__meta-editor--hidden"
    );
    // remove selected class from any old cell
    if (this.selectedCellElement) {
      this.selectedCellElement.classList.remove(
        "schema-editor-table__cell--selected"
      );
    }
    this.selectedRow = rowIndex;
    this.selectedColumn = colIndex;
    this.selectedCellElement = this.hot.getCell(
      this.selectedRow,
      this.selectedColumn
    );
    this.selectedCellElement.classList.add(
      "schema-editor-table__cell--selected"
    );

    // draw guiding line
    // we need some triangle math for this
    // first get the top/left position of the guidingline origin
    const metaEditorLeft = this.metaEditorGuidingLine.parentNode.getBoundingClientRect()
      .left;
    const metaEditorTop = this.metaEditorGuidingLine.parentNode.getBoundingClientRect()
      .top;
    const selectedCellLeft = this.selectedCellElement.getBoundingClientRect()
      .left;
    const selectedCellBottom = this.selectedCellElement.getBoundingClientRect()
      .bottom;

    const a = metaEditorTop - selectedCellBottom;
    const b = selectedCellLeft - metaEditorLeft;
    this.metaEditorGuidingLine.style.width = Math.sqrt(a * a + b * b) + "px";
    this.metaEditorGuidingLine.style.transform = `rotate(${Math.atan(a / b) *
      -1}rad)`;
  }

  getGridHeight() {
    return (
      Math.min(
        280,
        Math.max(this.options.minRowsDataTable, this.getData().length) * 23
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
        this.setData(trimNull(emptyToNull(this.hot.getData())));
        this.change();
      }
    } catch (e) {
      // just ignore errors, if no data is here, we don't need to replace any ,
    }
    return changed;
  }

  transpose() {
    this.hot.loadData(array2d.transpose(this.hot.getData()));
    this.setData(trimNull(emptyToNull(this.hot.getData())));
    this.hot.updateSettings({
      height: this.getGridHeight()
    });
    this.change();
  }
}
