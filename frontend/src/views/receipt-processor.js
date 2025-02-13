import React from 'react';

function ReceiptProcessor() {

    const [receipt_data, setReceiptData] = useState([]);


    const handleFileUpload = async (event) => {
        const file = event.target.files[0]; 
        console.log(file); 
    }

    const uploadReceipt = async (image) => {
        // gets image from file upload
        const formData = new FormData(); 
        formData.append('file', image);

        //try api request
        try {
            const response = await fetch('http://localhost:8000/process_image')
                .then(response => response.json())
                .then(response => console.log(response))
                .then(response => setReceiptData(response))
        } catch (error) {
            throw new Error("Failed to process image");
            console.log(error);
        }
    }

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
                {receipt_data && <pre>{JSON.stringify(receipt_data, null, 2)}</pre>}
            </div>
        </div>
    );
}

export default ReceiptProcessor;