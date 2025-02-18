import { useState } from 'react';
import '../styles/receipt-processor.css';
import supabase from '../supabase-client';

function ReceiptProcessor() {

    //receipt data handling
    const [receipt_data, setReceiptData] = useState([]);
    
    const handleFileUpload = async (event) => {
        setIsLoading(true);
        const file = event.target.files[0]; 
        console.log(file); 
        try {
            const data = await uploadReceipt(file);
            postReceipt(data, file);
            parseExpense(data, file);
            console.log(data);
            setReceiptData(data); 
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const parseExpense = async (json_data, file) => {
        if(!json_data) {
            alert('issue with data')
            return 
        }

        try {
            const jsonObj = typeof json_data === 'string' ? JSON.parse(json_data) : json_data; 
            
            console.log("Store value:", jsonObj.name);
            console.log("Amount value:", jsonObj.total_amount);
            console.log("Category value:", jsonObj.category);
            
            const { error } = await supabase
                .from('expenses')
                .insert([{
                    name: jsonObj.name || 'Unknown',
                    amount: jsonObj.total_amount || 0.0,
                    category: jsonObj.category || 'uncategorized'
                }]);

            if (error) throw error; 

        } catch (error) {
            console.error('Error posting receipt:', error);
            alert('Failed to add expense');
        }
    }

    const postReceipt = async (json_data, file) => {
        if (!json_data) {
            alert('issue with data');
            return;
        }

        console.log("Received JSON data:", JSON.stringify(json_data, null, 2));
        console.log("File:", file);
    
        try {

            const jsonObj = typeof json_data === 'string' ? JSON.parse(json_data) : json_data;

            // Debug values
            console.log("JsonOBJ:", jsonObj);
            console.log("Store value:", jsonObj.name);
            console.log("Amount value:", jsonObj.total_amount);
            console.log("Category value:", jsonObj.category);


            const compressedFile = await compressImage(file);

            const fileByteArray = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const arrayBuffer = reader.result;
                    const byteArray = new Uint8Array(arrayBuffer);
                    resolve(byteArray);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(compressedFile);
            });
    
            // Insert into database
            const { error } = await supabase
                .from('receipts')
                .insert([{
                    image_file: fileByteArray,
                    image_json: json_data,
                    store: jsonObj.name || 'Unknown Store',
                    amount: parseFloat(jsonObj.total_amount) || 0.0, 
                    category: jsonObj.category || 'Uncategorized' 
                }]);
    
            if (error) throw error;
    
        } catch (error) {
            console.error('Error posting receipt:', error);
            alert('Failed to save receipt');
        }
        
    }

    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;
    
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        }));
                    }, 'image/jpeg', 0.7); // 70% quality
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

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