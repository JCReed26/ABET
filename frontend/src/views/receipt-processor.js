import { useState } from 'react';
import '../styles/receipt-processor.css';

function ReceiptProcessor() {

    //receipt data handling
    const [receipt_data, setReceiptData] = useState([]);
    
    const handleFileUpload = async (event) => {
        setIsLoading(true);
        const file = event.target.files[0]; 
        console.log(file); 
        try {
            const data = await uploadReceipt(file);
            console.log(data);
            setReceiptData(data); 
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const uploadReceipt = async (image) => {
        // gets image from file upload
        const formData = new FormData(); 
        formData.append('file', image);


        //try api request
        try {
            const response = await fetch('http://localhost:8000/process-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('api response failed', response);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error:', error);
            throw error;
        }
    }
    //end of receipt data handling 

    //spinny loading 
    const [isLoading, setIsLoading] = useState(false); 

    //end spinny loading 







    //react output 
    return (
        <div>
            <h1>Receipt Processor</h1>
            <h2>Add Receipt</h2>
            <div className="mb-1">
                <span className='font-css top'>*</span>
                <div className=''>
                    <input type='file' id='file-input' accept='.jpg, .png, .jpeg' className='form-control' onChange={handleFileUpload} />
                </div>
            </div>
            <div className="json-visualizer">
                <h2>JSON Output</h2>
                {isLoading ? (
                    <div className='loader'></div>
                ) : (
                    receipt_data && <pre>{receipt_data}</pre>
                )}
            </div>
        </div>
    );
}

export default ReceiptProcessor;