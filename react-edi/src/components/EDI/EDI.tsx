import VendorSelect from "./VendorSelect"
const EDI_Generator = () =>{
    const inlineStyles = {
        color: 'white',
        // border:'1px solid white',
        borderRadius:'20px',
        padding:'2em',
        marginTop:'5em',
        
        
        // Add more styles as needed
      }
    return(<>
    <div>
    <div style={inlineStyles}>
        <h1>Generate EDIs</h1>
        <p>Making data entry easy with EDIs. Upload invoices to generate EDIs</p>
        <VendorSelect/>
        {/* <FileInput/> */}
    </div>
    </div>
    </>)
}
export default EDI_Generator