import { useState, useEffect,ChangeEvent } from "react";
import { BackOfficeType } from "../../interface";
import axios from "axios";
import './FileUpload.css'

interface FileInputProps{
  backOfficetype:BackOfficeType,
}

function FileInput({backOfficetype}:FileInputProps) {
 
    
    const [selectedFile, setSelectedFile] = useState<File|null>(null);
    const [progress,setProgress]=useState({started:false, pc:0})
    const [msg,setMsg] = useState('')
    const [ediFile,setEDIFile] = useState<File|null>();


    useEffect(()=>{
      setSelectedFile(null)
      setProgress({started:false, pc:0})
      setMsg('')
    },[backOfficetype])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDownload = (data:any)=>{
      const blob = new Blob([data]);

      // Create a URL for the Blob object
      const url = window.URL.createObjectURL(blob);

      // Create an <a> element
      const link = document.createElement('a');
      link.href = url;
      if(selectedFile)
      link.setAttribute('download', selectedFile?.name.split('.')[0]); // Set the filename for download
      document.body.appendChild(link);

      // Trigger a click event on the <a> element
      link.click();

      // Clean up: remove the <a> element and revoke the URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }

    const handleFileChange = (e:ChangeEvent<HTMLInputElement>) => {
      if(e.target.files!=undefined)
      setSelectedFile(e.target.files[0]);
      };
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      
    const handleUpload = async () => {
        if (selectedFile) {
          const formData = new FormData();

          formData.append('invoice', selectedFile)
          // formData.append('id','123')
          formData.append('backofficetype_id',String(backOfficetype.id))
          console.log(selectedFile.name)
          console.log(formData.values())

          setMsg('uploading...')
          setProgress((prevState) =>{
            return {...prevState,started:true}
          })
          try{
          const response = await axios.post(import.meta.env.VITE_API_ENDPOINT+'/main/edi-generator/',formData ,
            { headers:{
                'Content-Type': 'multipart/form-data',
              },
              responseType:'blob',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onUploadProgress:(progressEvent:any)=>{
                setProgress(prevState=>{
                  return {...prevState,pc:progressEvent.progress*100}
                })
              }
            }
          )
          console.log("response: ",response)
          setEDIFile(response.data);
          setMsg('EDI Generated')
          
        }
        
        catch(error){
            console.log('error uploading file',error);
        }
           
        }
      };
  
    return (
      <div>
        <p>Step 2:  Upload invoice</p>
        <input className="edi-button" type="file" onChange={handleFileChange} />
        {selectedFile && (<>
          {/* <p style={inlineStyles}>
            Selected file: {selectedFile.name} (Size: {selectedFile.size} bytes)
          </p> */}
          <button className = "edi-button"onClick={handleUpload}>Generate EDI</button>
          {progress.started && <progress className="edi-progress" max="100" value={progress.pc}></progress>}
          {msg!='' && <div style={{color:'#65e765'}}><br></br><span>{msg}</span></div> }
          </>
        )}
        {ediFile && 
        <div>
          
          <button onClick={()=>{
            handleDownload(ediFile)
          }}>Download File</button>
      
        </div>
          }
      </div>
    );
  }

  export default FileInput;