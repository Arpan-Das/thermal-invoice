import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "./InvoiceGenerator.css";

const InvoiceGenerator = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalAmountMain, setTotalAmountMain] = useState(0);


  useEffect(() => {
    let tempTotalItem  = 0;
    let tempTotalAmount  = 0;
    items.forEach(element => {
      tempTotalItem += element.qty;
      tempTotalAmount += element.qty*element.price;
    });
    setTotalItem(tempTotalItem);
    setTotalAmountMain(tempTotalAmount);
  },[items]);

  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  // Add new item row
  const addItem = () => {
    setItems([...items, { name: "", qty: 1, price: 0 }]);    
  };

  // Update item values
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 100 + items.length * 6], // Adjust height dynamically
    });

    let y = 5;
  
    doc.setFont("courier", "bold");
    doc.setFontSize(12);    
    doc.text("Raj Enteprice", 25, y);
    y += 6;
    doc.setFontSize(8);
    doc.text("No 00000 Address Line One", 20, y);
    y += 6;
    doc.text("Address Line 02, SRI LANKA", 20, y);
    y += 6;
    doc.text("www.facebook.com", 28, y);
    y += 6;
    doc.text("+94700000000", 32, y);
    y += 6;
    doc.setFontSize(9);
    doc.text("-------------------------------------", 5, y);
    y += 6;
   
    doc.setFontSize(12);
    doc.text("Thermal Invoice", 25, y);
    y += 6;
    doc.setFontSize(9);
    doc.text(`Customer: ${name}`, 10, y);
    y += 6;
    doc.text(`Mobile: ${mobile}`, 10, y);
    y += 6;
    doc.text("-------------------------------------", 5, y);
    y += 6;

    doc.setFontSize(10);
    doc.text("Item Name", 10, y);  
    doc.text("Qty", 40, y);
    doc.text("Rate", 55, y);  
    doc.text("Total", 65, y);    
    y += 6;
    doc.setFontSize(9);
    doc.text("-------------------------------------", 5, y);
    y += 6;
    doc.setFontSize(10);
    items.forEach((item) => {
      doc.text(`${item.name}`, 10, y);
      doc.text(`${item.qty}`, 45, y);
      doc.text(`${item.price}`, 55, y);
      doc.text(`${item.price * item.qty}`, 65, y);
      y += 6;
    });

    doc.setFontSize(9);
    doc.text("-------------------------------------", 5, y);
    y += 5;
    doc.setFontSize(10);
    doc.text(`Total amount:  ${totalAmount}.0`, 10, y);
    y += 6;    

    doc.text("*********************************", 5, y);
    y += 6;
    doc.text(" THANK YOU COME AGAIN ", 15, y);
    y += 6;
    doc.text("*********************************", 5, y);

    doc.save(`${name}_thermal_invoice.pdf`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Generate Thermal Invoice</h2>

        {/* Customer Details */}
        <input
          type="text"
          placeholder="Customer Name"
          className="w-full mb-2 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mobile Number"
          className="w-full mb-2 p-2 border rounded"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <div className="row">
            <p>Item Name</p>
            <p>Quantity</p>
            <p>Rate</p>
            <p>Total</p>
        </div>


        {/* Item Inputs */}
        {items.map((item, index) => (
          <div key={index} className="row">
            <input
              type="text"
              placeholder="Item Name"
              className="w-1/2 p-2 border rounded"
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
            />
            <input
              type="number"
              placeholder="Qty"
              className="w-1/4 p-2 border rounded"
              value={item.qty}
              onChange={(e) => updateItem(index, "qty", Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Price"
              className="w-1/4 p-2 border rounded"
              value={item.price}
              onChange={(e) => updateItem(index, "price", Number(e.target.value))}
            />
            <input type="text" value={item.qty * item.price} disabled />
          </div>
        ))}

        <button
          onClick={addItem}
          className="w-full bg-gray-500 text-white p-2 rounded mb-2"
          style={{marginBottom: "5px"}}
        >
          + Add Item
        </button>

        
        <div className="row">
          <input type="text" value="Total" disabled />
          <input type="text" value={totalItem} disabled />
          <input type="text" value="---" disabled />
          <input type="text" value={`Rs. ${totalAmountMain}`} disabled />
        </div>

      
        {/* Generate PDF Button */}
        <button
          onClick={generatePDF}
          className="w-full bg-blue-500 text-white p-2 rounded mt-2"
        >
          Generate PDF
        </button>                
      </div>
    </div>
  )
};

export default InvoiceGenerator;
