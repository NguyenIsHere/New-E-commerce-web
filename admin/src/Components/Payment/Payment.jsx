import React, { useEffect, useState } from 'react'
import './Payment.css'
import * as XLSX from 'xlsx';

const Payment = () => {
    const [allpayments, setAllPayments] = useState([])
    const fetchInfo = async () => {
        await fetch('http://localhost:4000/listpayment')
            .then((res) => res.json())
            .then((data) => {setAllPayments(data)})
    }
    useEffect(() => {
        fetchInfo()
    }, [])

    const exportToExcel = () => {
        const paymentsForExcel = allpayments.map(({ orderId, user_email,amount, date,status}) => ({orderId, user_email,amount, date,status}));
    
        const ws = XLSX.utils.json_to_sheet(paymentsForExcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Payments");
        XLSX.writeFile(wb, "payments.xlsx");
    }

    return (
        <div className="list-payment">
            <button className='export-excel' onClick={exportToExcel}>Export to Excel</button>
            <h1>All Payments List</h1>
            <div className="listpayment-format-main">
                <p>Order Id</p>
                <p>User Email</p>
                <p>Total Fee</p>
                <p>Transaction Status</p>
                <p>Payment Date</p>
            </div>
            <div className="listpayment-allpayments">
                <hr />
                {allpayments.map((payment,index)=>{
                    return <>
                        <div key={index} className='listpayment-format-main listpayment-format'>
                            <p>{payment.orderId}</p>
                            <p>{payment.user_email}</p>
                            <p>{payment.amount}</p>
                            <p>{payment.status}</p>
                            <p>{payment.date}</p>
                        </div>
                        <hr />
                    </>
                })}
            </div>
        </div>
    )
}

export default Payment