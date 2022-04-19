import React ,{useState,useEffect}from 'react';
import ReactDataGrid from "react-data-grid";
//import DataGrid from 'react-data-grid';
import DataGrid , { SelectColumn, TextEditor,Column, DataGridHandle, FillEvent, PasteEvent }  from 'react-data-grid';
//import 'react-data-grid/dist/react-data-grid.css';


const Grid = () => {

    const [rows, setRows] = useState([]);
   
  useEffect(() => {
    setRows([
        { id: 0, title: 'Example' },
        { id: 1, title: 'Demo' }
      ]);
  }, [])
    const columns = [
        { key: 'id', name: 'ID' , resizable: true,frozen: false, editor: TextEditor, editorOptions: { editOnClick: true  } },
        { key: 'title', name: 'Title' , editor: TextEditor, editorOptions: { editOnClick: true  } }
      ];
       
    
  return (
    <ReactDataGrid
     columns={columns}
     rows={rows}
     onRowsChange={setRows}
   
  />
  );
};

export default Grid;
