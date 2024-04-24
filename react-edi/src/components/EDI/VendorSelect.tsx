import { useState,useEffect } from "react"
import { BackOfficeType} from "../../interface"
import axios from "axios"
import FileInput from "./FileUpload"

const VendorSelect = () =>{
    const [vendors,setVendors] = useState<BackOfficeType[]>([])
    const [vendorSelected,setVendorSelected] = useState<BackOfficeType|undefined|null>(null)

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
            const result = await axios.get(import.meta.env.VITE_API_ENDPOINT+'/main/backOfficeTypes/')
            if(result.data){
                console.log("Backoffice Types: ",result.data)
                setVendors(result.data)
            }
        }
        catch(error){
            console.log('error fetching vendors: ',error)
        }
    }
    fetchData()
        

    },[])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelect = (event:any)=>{
        console.log('handling select')
        const vendor_name = event.target.value;
        console.log(vendor_name)
        const thisVendor = vendors.find((vendor) => vendor.name === vendor_name);
        
        if(thisVendor!=undefined){
        console.log(thisVendor)
        setVendorSelected(thisVendor)
        }
        
    }

    return(
        <>
        {vendors &&
            <>
            <div className="form-select-container">
            <p>Step 1:  Select BackOffice Type</p>
            <select className="form-select" aria-label="Default select example" onChange={handleSelect}>
            <option selected>BackOffice Types</option>
            {vendors.map((vendor)=>(
                <option key={vendor.id} 
                >{vendor.name}</option>
            ))}
          </select>
          {vendorSelected &&
                <FileInput backOfficetype={vendorSelected}/>  
          }
          </div>
          </>
          
        }
        
        </>
    )

}
export default VendorSelect