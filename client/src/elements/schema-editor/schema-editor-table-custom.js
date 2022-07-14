import { bindable, inject, Loader } from "aurelia-framework";
import array2d from "array2d";
import ObjectFromSchemaGenerator from "resources/ObjectFromSchemaGenerator.js";
import AvailabilityChecker from "resources/checkers/AvailabilityChecker.js";

@inject(Loader, ObjectFromSchemaGenerator, AvailabilityChecker)
export class SchemaEditorTableCustom {
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

  reloadHotData() {
    if (this.hot) {
      this.hot.loadData(JSON.parse(JSON.stringify(this.data)));
    }
  }

  isOverwritingAllowed(predefinedContent) {
    if (predefinedContent.allowOverwrites) {
      return true;
    }

    let hasNonPredefinedData = false;
    const predefinedValues = predefinedContent.data;
    if (array2d.cells(this.data) > 0) {
      // predefinedValues can be of different dimensions (amount of rows and columns).
      // rows and columns which are not in the predefinedValues range are ignored
      const dimensions = array2d.dimensions(predefinedValues);
      const data = array2d.crop(this.data, 0, 0, dimensions[0], dimensions[1]);
      array2d.eachCell(data, (cell, i, j) => {
        // if overwrites are not allowed per default we check if there are values in cells
        // which are not cells with predefined content and block overwrites in that case
        if (cell !== undefined && cell !== null && cell !== "") {
          const predefinedRow = predefinedValues[i];
          if (predefinedRow) {
            const predefinedCell = predefinedRow[j];
            if (!predefinedCell) {
              hasNonPredefinedData = true;
            }
          } else {
            hasNonPredefinedData = true;
          }
        }
      });
    }
    return !hasNonPredefinedData;
  }

  applyOptions() {
    if (!this.schema) {
      return;
    }

    console.log("apply");
    const predefinedData = this.getPredefinedContent();
    if (predefinedData && this.isOverwritingAllowed(predefinedData)) {
      // const defaultData = predefinedData.data;
      this.data = predefinedData.data;
      this.reloadHotData();
      console.log("ohno")
    }
    // if (this.schema.hasOwnProperty("Q:options")) {
    //   this.options = Object.assign(this.options, this.schema["Q:options"]);

    //   if (this.schema["Q:options"].hasOwnProperty("predefinedContent")) {
    //     const predefinedContent = this.schema["Q:options"].predefinedContent;

    //     if (this.isOverwritingAllowed(predefinedContent)) {
    //       let predefinedValues = [];

    //       if (this.options.table && this.options.table.columns) {
    //         predefinedValues = predefinedContent.data;
    //       } else {
    //         predefinedValues = this.getValuesFromPredefinedContent(
    //           predefinedContent.data
    //         );
    //       }

    //       this.setData(predefinedValues);
    //       this.reloadHotData();
    //     }
    //   }
    // }
  }

  async schemaChanged() {
    this.applyOptions();
  }

  getPredefinedContent() {
    if (this.schema.hasOwnProperty("Q:options")) {
      this.options = Object.assign(this.options, this.schema["Q:options"]);
      if (this.options.hasOwnProperty("predefinedContent")) {
        return this.options.predefinedContent;
      }
    }
  }

  getGridHeight() {
    const minHeight = this.options.table && this.options.table.minHeight ? this.options.table.minHeight : 280;
    console.log(minHeight)
    return (
      Math.min(
        minHeight,
        Math.max(this.options.minRowsDataTable, this.data.length) * 23
      ) + 30
    );
  }

  async attached() {
    this.loader.loadModule("handsontable/dist/handsontable.full.css!");
    const Handsontable = await this.loader.loadModule(
      "handsontable/dist/handsontable.full.js"
    );
    if (!this.data) {

      const predefinedData = this.getPredefinedContent();
      if (predefinedData) {
        this.data = predefinedData.data;
      }
    }
    this.hot = new Handsontable(this.tableCustomContainerElement, {
      afterChange: (changes, source) => {
        if (changes) {
          const firstChange = changes[0];
          if (firstChange[1] === "isManual") {
            const row = firstChange[0];
            const newValue = firstChange[3];

            if (newValue) {
              this.data[row].lastAutoVotes = JSON.parse(
                JSON.stringify(this.data[row].votes)
              );
            } else if (!newValue) {
              this.data[row].hasImportChanges = false;
              this.hot.loadData(this.data);
            }
          }
        }

        if (source !== "loadData") {
          console.log("change")
          this.change();
        }
      },
      data: [],
      height: this.getGridHeight(),
      manualColumnResize: true,
      wordWrap: false,
      contextMenu: false,
      stretchH: "all",
      rowHeights: 23,
      colHeaders: [
        "ID",
        "Name",
        "Ja",
        "Ja %",
        "Nein",
        "Nein %",
        "Stimmbet. %",
        "Zwischenres.",
        "Manuelle Eingabe",
        "Neue auto. Data",
      ],
      columns: [
        {
          data: "id",
          type: "text",
          editor: false,
        },
        {
          data: "name",
          type: "text",
          editor: false,
        },
        {
          data: "votes.yes",
          type: "numeric",
        },
        {
          editor: false,
          renderer: (instance, td, row, col, prop, value, cellProperties) => {
            if (
              Number.isInteger(this.data[row].votes.yes) &&
              Number.isInteger(this.data[row].votes.no)
            ) {
              td.innerHTML =
                (
                  (100 * this.data[row].votes.yes) /
                  (this.data[row].votes.yes + this.data[row].votes.no)
                ).toFixed(2) + "%";
            } else {
              td.innerHTML = "";
            }
            td.style.color = "lightgray";
          },
        },
        {
          data: "votes.no",
          type: "numeric",
        },
        {
          editor: false,
          renderer: (instance, td, row, col, prop, value, cellProperties) => {
            if (
              Number.isInteger(this.data[row].votes.yes) &&
              Number.isInteger(this.data[row].votes.no)
            ) {
              td.innerHTML =
                (
                  (100 * this.data[row].votes.no) /
                  (this.data[row].votes.yes + this.data[row].votes.no)
                ).toFixed(2) + "%";
            } else {
              td.innerHTML = "";
            }
            td.style.color = "lightgray";
          },
        },
        {
          data: "turnout",
          type: "numeric",
          format: "0.00",
        },
        {
          data: "isIntermediate",
          type: "checkbox",
        },
        {
          data: "isManual",
          type: "checkbox",
        },
        {
          renderer: (instance, td, row, col, prop, value, cellProperties) => {
            if (this.data[row].hasImportChanges) {
              td.style.textAlign = "center";
              td.innerHTML = `<div style="display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;"><svg style="width:18px;height:18px" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8,13H10.55V10H13.45V13H16L12,17L8,13M19.35,10.04C21.95,10.22 24,12.36 24,15A5,5 0 0,1 19,20H6A6,6 0 0,1 0,14C0,10.91 2.34,8.36 5.35,8.04C6.6,5.64 9.11,4 12,4C15.64,4 18.67,6.59 19.35,10.04M19,18A3,3 0 0,0 22,15C22,13.45 20.78,12.14 19.22,12.04L17.69,11.93L17.39,10.43C16.88,7.86 14.62,6 12,6C9.94,6 8.08,7.14 7.13,8.97L6.63,9.92L5.56,10.03C3.53,10.24 2,11.95 2,14A4,4 0 0,0 6,18H19Z" />
          </svg></div>`;
              return td;
            }
            td.innerHTML = "";
            return td;
          },
        },
      ],
    });
    console.log(this.data);
    if (this.data) {
      this.hot.loadData(this.data);
      this.hot.updateSettings({
        cells: (row, col) => {
          const header = this.hot.getColHeader(col);
          const cellProperties = {};

          if (
            this.data[row] &&
            !this.data[row].isManual &&
            header !== "Manuelle Eingabe"
          ) {
            cellProperties.readOnly = true;
          } else {
            cellProperties.readOnly = false;
          }

          return cellProperties;
        },
      });
    }
  }

  dataChanged(data) {
    if (this.hot) {
      this.hot.loadData(this.data);
    }
  }
}

// function getSchemaAtPath(schema, path) {
//   if (path.includes(".")) {
//     const pathParts = path.split(".");
//     const firstPathPart = pathParts.shift();
//     const remainingPath = pathParts.join(".");
//     return getSchemaAtPath(schema.properties[firstPathPart], remainingPath);
//   }
//   return schema.properties[path];
// }

// function hasNonNullInArray(arr) {
//   for (let val of arr) {
//     if (val !== null) {
//       return true;
//     }
//   }
//   return false;
// }

// function trimNull(data) {
//   let lastColumnWithValues = 0;
//   array2d.eachColumn(data, (column, index) => {
//     if (hasNonNullInArray(column)) {
//       lastColumnWithValues = index;
//     }
//   });

//   let lastRowWithValues = 0;
//   array2d.eachRow(data, (row, index) => {
//     if (hasNonNullInArray(row)) {
//       lastRowWithValues = index;
//     }
//   });

//   return array2d.crop(
//     data,
//     0,
//     0,
//     lastColumnWithValues + 1,
//     lastRowWithValues + 1
//   );
// }

// function trimAllStrings(data) {
//   array2d.eachCell(data, (cell, i, j) => {
//     if (typeof data[i][j] === "string") {
//       data[i][j] = cell.trim();
//     }
//   });
//   return data;
// }

// function emptyToNull(data) {
//   array2d.eachCell(data, (cell, i, j) => {
//     if (cell === "" || cell === undefined) {
//       data[i][j] = null;
//     }
//   });
//   return data;
// }

// function hasNonEmptyProperty(obj, excludedProperties = []) {
//   return Object.keys(obj)
//     .filter((prop) => !excludedProperties.includes(prop))
//     .some((prop) => {
//       if (obj[prop] === undefined || obj[prop] === null) {
//         return false;
//       }
//       if (typeof obj[prop] === "object") {
//         return hasNonEmptyProperty(obj[prop]);
//       }
//       if (obj[prop] !== "") {
//         return true;
//       }
//       return false;
//     });
// }

// function isNumeric(cell) {
//   if (!cell) {
//     return false;
//   }
//   cell = cell.trim(); // remove whitespaces
//   // check if positive or negative decimal number
//   if (cell.match(/^[+-]?\d+(\.\d+)?$/) === null) {
//     return false;
//   }
//   return cell && !Number.isNaN(parseFloat(cell));
// }

// class MetaData {
//   constructor(initialMetaData, metaDataSchemas, objectFromSchemaGenerator) {
//     this.data = initialMetaData;
//     this.metaDataSchemas = metaDataSchemas;
//     this.objectFromSchemaGenerator = objectFromSchemaGenerator;
//     // set up the proxies
//     if (this.data.cells) {
//       this.setupCellsProxy();
//     }
//   }

//   setupCellsProxy() {
//     const rowProxies = [];
//     this.cells = new Proxy(rowProxies, {
//       get: (rowTarget, rowIndex, receiver) => {
//         // here we fake the array of row indexes
//         // and return a new Proxy for this row array if there is none already

//         // parse the rowIndex to an int if its a string
//         if (typeof rowIndex === "string") {
//           rowIndex = parseInt(rowIndex, 10);
//         }

//         if (!rowProxies[rowIndex]) {
//           rowProxies[rowIndex] = new Proxy(this.data.cells, {
//             get: (cellTarget, colIndex) => {
//               // parse this to an int if its a string
//               if (typeof colIndex === "string") {
//                 colIndex = parseInt(colIndex, 10);
//               }
//               let cellMetaDataObject = this.data.cells.find(
//                 (cellMetaDataObjectCandidate) =>
//                   cellMetaDataObjectCandidate.rowIndex === rowIndex &&
//                   cellMetaDataObjectCandidate.colIndex === colIndex
//               );

//               // if there is no cellMetaData object yet for the selected cell, create it from the schema
//               if (!cellMetaDataObject) {
//                 cellMetaDataObject =
//                   this.objectFromSchemaGenerator.generateFromSchema(
//                     this.metaDataSchemas.cells
//                   );
//                 // set the selected indexes
//                 cellMetaDataObject.rowIndex = rowIndex;
//                 cellMetaDataObject.colIndex = colIndex;
//                 // and push it to the array to store it with the item
//                 this.data.cells.push(cellMetaDataObject);
//               }
//               return cellMetaDataObject;
//             },
//           });
//         }
//         return rowProxies[rowIndex];
//       },
//     });
//   }

//   hasMetaDataForCell(rowIndex, colIndex) {
//     return !!this.data.cells.find((cell) => {
//       return cell.rowIndex === rowIndex && cell.colIndex === colIndex;
//     });
//   }

//   // used to remove empty metadata objects
//   cleanup() {
//     const cleanedUpCells = [];
//     // cleanup cells
//     this.data.cells = this.data.cells.filter((cell) => {
//       // keep the cells that have at least one property besides the indexes that is not empty
//       if (hasNonEmptyProperty(cell, ["colIndex", "rowIndex"])) {
//         return true;
//       }
//       cleanedUpCells.push(cell);
//       return false;
//     });
//     return cleanedUpCells;
//   }
// }

// @inject(Loader, ObjectFromSchemaGenerator, AvailabilityChecker)
// export class SchemaEditorTable {
//   @bindable
//   schema;
//   @bindable
//   data;
//   @bindable
//   change;
//   @bindable
//   required;
//   @bindable
//   showNotifications;

//   options = {
//     allowTranspose: true,
//     minRowsDataTable: 8,
//   };

//   constructor(loader, objectFromSchemaGenerator, availabilityChecker) {
//     this.loader = loader;
//     this.objectFromSchemaGenerator = objectFromSchemaGenerator;
//     this.availabilityChecker = availabilityChecker;
//   }

//   setData(data) {
//     if (this.metaDataEditorEnabled) {
//       this.data[this.options.metaDataEditor.dataPropertyName] = data;
//     } else {
//       this.data = data;
//     }
//   }

//   getData() {
//     if (this.metaDataEditorEnabled) {
//       return this.data[this.options.metaDataEditor.dataPropertyName];
//     }
//     return this.data;
//   }

//   reloadHotData() {
//     if (this.hot) {
//       this.hot.loadData(JSON.parse(JSON.stringify(this.getData())));
//     }
//   }

//   async schemaChanged() {
//     this.applyOptions();
//   }

//   isOverwritingAllowed(predefinedContent) {
//     if (predefinedContent.allowOverwrites) {
//       return true;
//     }

//     let hasNonPredefinedData = false;
//     const predefinedValues = predefinedContent.data;
//     if (array2d.cells(this.data) > 0) {
//       // predefinedValues can be of different dimensions (amount of rows and columns).
//       // rows and columns which are not in the predefinedValues range are ignored
//       const dimensions = array2d.dimensions(predefinedValues);
//       const data = array2d.crop(this.data, 0, 0, dimensions[0], dimensions[1]);
//       array2d.eachCell(data, (cell, i, j) => {
//         // if overwrites are not allowed per default we check if there are values in cells
//         // which are not cells with predefined content and block overwrites in that case
//         if (cell !== undefined && cell !== null && cell !== "") {
//           const predefinedRow = predefinedValues[i];
//           if (predefinedRow) {
//             const predefinedCell = predefinedRow[j];
//             if (!predefinedCell) {
//               hasNonPredefinedData = true;
//             }
//           } else {
//             hasNonPredefinedData = true;
//           }
//         }
//       });
//     }
//     return !hasNonPredefinedData;
//   }

//   getValuesFromPredefinedContent(predefinedContent) {
//     return array2d.map(predefinedContent, (cell, i, j) => {
//       if (typeof cell === "object" && cell !== null) {
//         return cell.value;
//       } else {
//         return cell;
//       }
//     });
//   }

//   async attached() {
//     let tableConfig = {
//       dataSchema: [],
//       height: this.getGridHeight(),
//       minRows: this.options.minRowsDataTable,
//       minCols: 5,
//       minSpareRows: 1,
//       minSpareCols: 1,
//       rowHeaders: true,
//       colHeaders: true,
//       manualColumnResize: true,
//       wordWrap: false,
//       contextMenu: false,
//       stretchH: "all",
//       rowHeights: 23,
//       copyPaste: {
//         rowsLimit: 10000,
//         columnsLimit: 100,
//       },
//       afterChange: (changes, source) => {
//         if (source !== "loadData") {
//           console.log(
//             trimNull(emptyToNull(trimAllStrings(this.hot.getData())))
//           );
//           if (this.options.table && this.options.table.columns) {
//             console.log(this.hot.getData())
//             this.setData(this.hot.getData());
//           } else {
//             this.setData(
//               trimNull(emptyToNull(trimAllStrings(this.hot.getData())))
//             );
//           }
//           this.reloadHotData();
//           this.change();
//         }
//         if (this.hot) {
//           this.replaceCommaWithPointIfDecimal();
//           this.hot.updateSettings({
//             height: this.getGridHeight(),
//           });
//         }
//       },
//       afterSelectionEnd: (row, column, row2, column2, selectionLayerLevel) => {
//         // if we do not have the medaDataEditor enabled, there is nothing to do here
//         if (!this.metaDataEditorEnabled || !this.metaDataEditorAvailable) {
//           return;
//         }

//         // a column is selected
//         if (
//           column === column2 &&
//           row === 0 &&
//           row2 === this.hot.countRows() - 1
//         ) {
//           // todo: implement the column metadata editing
//           return this.hideMetaDataEditor();
//         }

//         // a row is selected
//         if (
//           row === row2 &&
//           column === 0 &&
//           column2 === this.hot.countCols() - 1
//         ) {
//           // todo: implement the row metadata editing
//           return this.hideMetaDataEditor();
//         }

//         // a cell in the the first row is not valid as it contains the headers
//         if (
//           row === 0 &&
//           this.options.metaDataEditor.features.cells.notForFirstRow === true
//         ) {
//           return this.hideMetaDataEditor();
//         }

//         // a single cell is selected
//         if (row === row2 && column === column2) {
//           // only if the cell metaData feature is enabled
//           if (this.options.metaDataEditor.features.cells) {
//             const cellData = this.hot.getDataAtCell(row, column);
//             // only if the cell is not empty or there is already metaData for this cell
//             if (
//               (cellData !== undefined &&
//                 cellData !== null &&
//                 cellData.length > 0) ||
//               this.metaEditorData.hasMetaDataForCell(row, column)
//             ) {
//               return this.showMetaDataEditorForCell(row, column);
//             }
//           }
//           return this.hideMetaDataEditor();
//         }

//         // any other case (multiple cells selected) leads to hiding the metadata editor
//         return this.hideMetaDataEditor();
//       },
//     };

//     if (this.options.metaDataEditor) {
//       await this.enableMetaDataEditorIfAvailable();
//     }

//     // TODO:
//     if (this.options.table && this.options.table.columns) {
//       tableConfig.columns = [];
//       tableConfig.colHeaders = this.options.table.columns.map(
//         (column) => column.label
//       );

//       this.options.table.columns.forEach((column) => {
//         const type =
//           column.type === "count" || column.type === "notify-upload"
//             ? "text"
//             : column.type;
//         let columnOpt = { type };
//         if (column.data) {
//           columnOpt.data = column.data;
//         }

//         // if(column.editor) {
//         //   columnOpt.editor = column.editor;
//         // }

//         tableConfig.columns.push(columnOpt);
//       });
//     } else {
//       tableConfig.cells = (row, col, prop) => {
//         const cellProperties = {};
//         if (this.schema["Q:options"].hasOwnProperty("predefinedContent")) {
//           const predefinedContent =
//             this.schema["Q:options"].predefinedContent.data;
//           if (predefinedContent) {
//             try {
//               const predefinedCell = predefinedContent[row][col];
//               if (
//                 predefinedCell !== undefined &&
//                 predefinedCell !== null &&
//                 typeof predefinedCell === "object" &&
//                 predefinedCell.readOnly
//               ) {
//                 cellProperties.readOnly = true;
//               }
//             } catch (ignore) {}
//           } // if anything goes wrong we just do not set the cell readonly
//         }
//         return cellProperties;
//       };
//     }

//     this.loader.loadModule("handsontable/dist/handsontable.full.css!");
//     const Handsontable = await this.loader.loadModule(
//       "handsontable/dist/handsontable.full.js"
//     );

//     console.log(tableConfig);
//     this.hot = new Handsontable(this.tableContainerElement, tableConfig);
//     console.log(this.hot);

//     this.reloadHotData();
//     if (this.metaDataEditorEnabled) {
//       this.setCellClassesFromMetaEditorState();
//     }
//   }

//   detached() {
//     this.availabilityChecker.unregisterReevaluateCallback(
//       this.reevaluateMetaDataEditorAvailabilityCallback
//     );
//   }

//   hideMetaDataEditor() {
//     this.metaEditorWrapper.classList.add(
//       "schema-editor-table__meta-editor--hidden"
//     );
//     this.selectedRow = undefined;
//     this.selectedColumn = undefined;
//     if (this.selectedCellElement) {
//       this.selectedCellElement.classList.remove(
//         "schema-editor-table__cell--selected"
//       );
//       this.selectedCellElement = undefined;
//     }
//   }

//   showMetaDataEditorForCell(rowIndex, colIndex) {
//     // if the selected cell is different than before, handle change to cleanup
//     if (this.selectedRow !== rowIndex || this.selectedColumn !== colIndex) {
//       this.handleMetaEditorChange();
//     }
//     this.metaEditorWrapper.classList.remove(
//       "schema-editor-table__meta-editor--hidden"
//     );
//     // remove selected class from any old cell
//     if (this.selectedCellElement) {
//       this.selectedCellElement.classList.remove(
//         "schema-editor-table__cell--selected"
//       );
//     }
//     this.selectedRow = rowIndex;
//     this.selectedColumn = colIndex;
//     this.selectedCellElement = this.hot.getCell(
//       this.selectedRow,
//       this.selectedColumn
//     );
//     this.selectedCellElement.classList.add(
//       "schema-editor-table__cell--selected"
//     );
//   }

//   async enableMetaDataEditorIfAvailable() {
//     // if this has availabilityChecks, we need to check them first
//     if (Array.isArray(this.options.metaDataEditor.availabilityChecks)) {
//       await this.applyMetaDataEditorAvailability();

//       this.reevaluateMetaDataEditorAvailabilityCallback =
//         this.applyMetaDataEditorAvailability.bind(this);
//       this.availabilityChecker.registerReevaluateCallback(() => {
//         this.reevaluateMetaDataEditorAvailabilityCallback;
//       });
//     } else {
//       // if there are not checks configured, the metaData editor is available
//       this.metaDataEditorAvailable = true;
//     }

//     this.metaDataEditorEnabled = true;

//     this.metaEditorSchema = getSchemaAtPath(
//       this.schema,
//       this.options.metaDataEditor.features.cells.propertyPath
//     ).items;

//     this.metaEditorData = new MetaData(
//       this.data.metaData,
//       {
//         cells: this.metaEditorSchema,
//       },
//       this.objectFromSchemaGenerator
//     );
//   }

//   async applyMetaDataEditorAvailability() {
//     const availability = await this.availabilityChecker.getAvailabilityInfo(
//       this.options.metaDataEditor.availabilityChecks
//     );
//     if (availability.isAvailable) {
//       this.metaDataEditorAvailable = true;
//     } else {
//       this.metaDataEditorAvailable = false;
//     }
//   }

//   setCellClassesFromMetaEditorState() {
//     for (const cell of this.metaEditorData.data.cells) {
//       const cellElement = this.hot.getCell(cell.rowIndex, cell.colIndex);
//       if (cellElement) {
//         cellElement.classList.add("schema-editor-table__cell--has-meta");
//       }
//     }
//   }

//   handleMetaEditorChange() {
//     // cleanup on every change
//     const cleanedUpCells = this.metaEditorData.cleanup();
//     for (const cell of cleanedUpCells) {
//       const cellElement = this.hot.getCell(cell.rowIndex, cell.colIndex);
//       if (cellElement) {
//         cellElement.classList.remove("schema-editor-table__cell--has-meta");
//       }
//     }
//     this.setCellClassesFromMetaEditorState();
//     // call the bound change function if given
//     if (typeof this.change === "function") {
//       this.change();
//     }
//   }

//   getGridHeight() {
//     return (
//       Math.min(
//         280,
//         Math.max(this.options.minRowsDataTable, this.getData().length) * 23
//       ) + 30
//     );
//   }

//   replaceCommaWithPointIfDecimal() {
//     let changed = false;
//     try {
//       const newData = this.hot.getData().map((row, rowIndex) =>
//         row.map((cell, colIndex) => {
//           // do not change the first row or column
//           if (rowIndex === 0 || colIndex === 0) {
//             return cell;
//           }

//           if (!cell) {
//             return cell;
//           }

//           if (cell.indexOf(",") === -1) {
//             return cell;
//           }

//           // replace first , with .
//           let str = cell.replace(",", ".");

//           // only one comma, if more, we dont change it
//           if (str.indexOf(",") > -1) {
//             return cell;
//           }

//           // if we do not have a floating point number now, return the original
//           if (isNumeric(str) === false) {
//             return cell;
//           }

//           changed = true;
//           return str;
//         })
//       );

//       if (changed) {
//         this.setData(trimNull(emptyToNull(trimAllStrings(newData))));
//         this.reloadHotData();
//         this.change();
//       }
//     } catch (e) {
//       // just ignore errors, if no data is here, we don't need to replace any ,
//     }
//     return changed;
//   }

//   transpose() {
//     this.hot.loadData(array2d.transpose(this.hot.getData()));
//     this.setData(trimNull(emptyToNull(this.hot.getData())));
//     this.hot.updateSettings({
//       height: this.getGridHeight(),
//     });
//     this.change();
//   }
// }
