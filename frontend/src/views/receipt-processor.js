import React from 'react';

function ReceiptProcessor() {

    const handleFileUpload = (event) => {
        const file = event.target.files[0]; 
        console.log(file); 
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
        </div>
    );
}

export default ReceiptProcessor;