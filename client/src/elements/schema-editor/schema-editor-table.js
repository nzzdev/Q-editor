import { bindable, inject, Loader } from "aurelia-framework";
import array2d from "array2d";
import ObjectFromSchemaGenerator from "resources/ObjectFromSchemaGenerator.js";
import AvailabilityChecker from "resources/checkers/AvailabilityChecker.js";

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

function trimAllStrings(data) {
  array2d.eachCell(data, (cell, i, j) => {
    if (typeof data[i][j] === "string") {
      data[i][j] = cell.trim();
    }
  });
  return data;
}

function emptyToNull(data) {
  array2d.eachCell(data, (cell, i, j) => {
    if (cell === "" || cell === undefined) {
      data[i][j] = null;
    }
  });
  return data;
}

function hasNonEmptyProperty(obj, excludedProperties = []) {
  return Object.keys(obj)
    .filter((prop) => !excludedProperties.includes(prop))
    .some((prop) => {
      if (obj[prop] === undefined || obj[prop] === null) {
        return false;
      }
      if (typeof obj[prop] === "object") {
        return hasNonEmptyProperty(obj[prop]);
      }
      if (obj[prop] !== "") {
        return true;
      }
      return false;
    });
}

class MetaData {
  constructor(initialMetaData, metaDataSchemas, objectFromSchemaGenerator) {
    this.data = initialMetaData;
    this.metaDataSchemas = metaDataSchemas;
    this.objectFromSchemaGenerator = objectFromSchemaGenerator;
    // set up the proxies
    if (this.data.cells) {
      this.setupCellsProxy();
    }
  }

  setupCellsProxy() {
    const rowProxies = [];
    this.cells = new Proxy(rowProxies, {
      get: (rowTarget, rowIndex, receiver) => {
        // here we fake the array of row indexes
        // and return a new Proxy for this row array if there is none already

        // parse the rowIndex to an int if its a string
        if (typeof rowIndex === "string") {
          rowIndex = parseInt(rowIndex, 10);
        }

        if (!rowProxies[rowIndex]) {
          rowProxies[rowIndex] = new Proxy(this.data.cells, {
            get: (cellTarget, colIndex) => {
              // parse this to an int if its a string
              if (typeof colIndex === "string") {
                colIndex = parseInt(colIndex, 10);
              }
              let cellMetaDataObject = this.data.cells.find(
                (cellMetaDataObjectCandidate) =>
                  cellMetaDataObjectCandidate.rowIndex === rowIndex &&
                  cellMetaDataObjectCandidate.colIndex === colIndex
              );

              // if there is no cellMetaData object yet for the selected cell, create it from the schema
              if (!cellMetaDataObject) {
                cellMetaDataObject = this.objectFromSchemaGenerator.generateFromSchema(
                  this.metaDataSchemas.cells
                );
                // set the selected indexes
                cellMetaDataObject.rowIndex = rowIndex;
                cellMetaDataObject.colIndex = colIndex;
                // and push it to the array to store it with the item
                this.data.cells.push(cellMetaDataObject);
              }
              return cellMetaDataObject;
            },
          });
        }
        return rowProxies[rowIndex];
      },
    });
  }

  hasMetaDataForCell(rowIndex, colIndex) {
    return !!this.data.cells.find((cell) => {
      return cell.rowIndex === rowIndex && cell.colIndex === colIndex;
    });
  }

  // used to remove empty metadata objects
  cleanup() {
    const cleanedUpCells = [];
    // cleanup cells
    this.data.cells = this.data.cells.filter((cell) => {
      // keep the cells that have at least one property besides the indexes that is not empty
      if (hasNonEmptyProperty(cell, ["colIndex", "rowIndex"])) {
        return true;
      }
      cleanedUpCells.push(cell);
      return false;
    });
    return cleanedUpCells;
  }
}

@inject(Loader, ObjectFromSchemaGenerator, AvailabilityChecker)
export class SchemaEditorTable {
  @bindable
  schema;
  @bindable
  data;
  @bindable
  change;
  @bindable
  required;
  @bindable
  showNotifications;

  options = {
    allowTranspose: true,
    minRowsDataTable: 8,
  };

  constructor(loader, objectFromSchemaGenerator, availabilityChecker) {
    this.loader = loader;
    this.objectFromSchemaGenerator = objectFromSchemaGenerator;
    this.availabilityChecker = availabilityChecker;
  }

  setData(data) {
    if (this.metaDataEditorEnabled) {
      this.data[this.options.metaDataEditor.dataPropertyName] = data;
    } else {
      this.data = data;
    }
  }

  getData() {
    if (this.metaDataEditorEnabled) {
      return this.data[this.options.metaDataEditor.dataPropertyName];
    }
    return this.data;
  }

  reloadHotData() {
    if (this.hot) {
      this.hot.loadData(JSON.parse(JSON.stringify(this.getData())));
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

      if (this.schema["Q:options"].hasOwnProperty("predefinedContent")) {
        const predefinedValues = this.schema["Q:options"].predefinedContent
          .values;
        if (predefinedValues) {
          let lastColumnWithValues = 0;
          array2d.eachColumn(this.data, (column, index) => {
            if (hasNonNullInArray(column)) {
              lastColumnWithValues = index;
            }
          });
          if (lastColumnWithValues === 0) {
            this.setData(predefinedValues);
            this.reloadHotData();
          }
        }
      }
    }
  }

  async attached() {
    if (this.options.metaDataEditor) {
      await this.enableMetaDataEditorIfAvailable();
    }

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
      copyPaste: {
        rowsLimit: 10000,
        columnsLimit: 100,
      },
      cells: (row, col, prop) => {
        const cellProperties = {};
        if (this.schema["Q:options"].hasOwnProperty("predefinedContent")) {
          const predefinedContent = this.schema["Q:options"].predefinedContent;
          if (predefinedContent.readOnly) {
            if (
              (predefinedContent.type === "column" &&
                col === predefinedContent.index) ||
              (predefinedContent.type === "row" &&
                row === predefinedContent.index) ||
              (predefinedContent.type === "cell" &&
                row === predefinedContent.index[0] &&
                col === predefinedContent.index[1])
            ) {
              cellProperties.readOnly = true;
            }
          }
        }
        return cellProperties;
      },
      afterChange: (changes, source) => {
        if (source !== "loadData") {
          this.setData(
            trimNull(emptyToNull(trimAllStrings(this.hot.getData())))
          );
          this.reloadHotData();
          this.change();
        }
        if (this.hot) {
          this.replaceCommaWithPointIfDecimal();
          this.hot.updateSettings({
            height: this.getGridHeight(),
          });
        }
      },
      afterSelectionEnd: (row, column, row2, column2, selectionLayerLevel) => {
        // if we do not have the medaDataEditor enabled, there is nothing to do here
        if (!this.metaDataEditorEnabled || !this.metaDataEditorAvailable) {
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
        if (
          row === 0 &&
          this.options.metaDataEditor.features.cells.notForFirstRow === true
        ) {
          return this.hideMetaDataEditor();
        }

        // a single cell is selected
        if (row === row2 && column === column2) {
          // only if the cell metaData feature is enabled
          if (this.options.metaDataEditor.features.cells) {
            const cellData = this.hot.getDataAtCell(row, column);
            // only if the cell is not empty or there is already metaData for this cell
            if (
              (cellData !== undefined &&
                cellData !== null &&
                cellData.length > 0) ||
              this.metaEditorData.hasMetaDataForCell(row, column)
            ) {
              return this.showMetaDataEditorForCell(row, column);
            }
          }
          return this.hideMetaDataEditor();
        }

        // any other case (multiple cells selected) leads to hiding the metadata editor
        return this.hideMetaDataEditor();
      },
    });

    this.reloadHotData();
    if (this.metaDataEditorEnabled) {
      this.setCellClassesFromMetaEditorState();
    }
  }

  detached() {
    this.availabilityChecker.unregisterReevaluateCallback(
      this.reevaluateMetaDataEditorAvailabilityCallback
    );
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
    // if the selected cell is different than before, handle change to cleanup
    if (this.selectedRow !== rowIndex || this.selectedColumn !== colIndex) {
      this.handleMetaEditorChange();
    }
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
  }

  async enableMetaDataEditorIfAvailable() {
    // if this has availabilityChecks, we need to check them first
    if (Array.isArray(this.options.metaDataEditor.availabilityChecks)) {
      await this.applyMetaDataEditorAvailability();

      this.reevaluateMetaDataEditorAvailabilityCallback = this.applyMetaDataEditorAvailability.bind(
        this
      );
      this.availabilityChecker.registerReevaluateCallback(() => {
        this.reevaluateMetaDataEditorAvailabilityCallback;
      });
    } else {
      // if there are not checks configured, the metaData editor is available
      this.metaDataEditorAvailable = true;
    }

    this.metaDataEditorEnabled = true;

    this.metaEditorSchema = getSchemaAtPath(
      this.schema,
      this.options.metaDataEditor.features.cells.propertyPath
    ).items;

    this.metaEditorData = new MetaData(
      this.data.metaData,
      {
        cells: this.metaEditorSchema,
      },
      this.objectFromSchemaGenerator
    );
  }

  async applyMetaDataEditorAvailability() {
    const availability = await this.availabilityChecker.getAvailabilityInfo(
      this.options.metaDataEditor.availabilityChecks
    );
    if (availability.isAvailable) {
      this.metaDataEditorAvailable = true;
    } else {
      this.metaDataEditorAvailable = false;
    }
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
        this.setData(trimNull(emptyToNull(trimAllStrings(newData))));
        this.reloadHotData();
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
      height: this.getGridHeight(),
    });
    this.change();
  }
}
