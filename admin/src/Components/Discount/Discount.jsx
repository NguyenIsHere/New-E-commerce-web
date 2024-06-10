import {React,useEffect,useState} from 'react'
import './Discount.css'

const Discount = () => {
    const [discountdetails, setDiscountdetails] = useState({code:'',type:'',date:''})
    const changeHandler = (e) =>{
        setDiscountdetails({...discountdetails,[e.target.name]:e.target.value})
    }
    const Add_Discount = async () =>{
        console.log(discountdetails)
        let responseData;
        let discount = discountdetails;
        await fetch('http://localhost:4000/adddiscount', {
            method: 'POST',
            headers:
            {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discount),
        })
        .then((resp) => resp.json())
        .then((data) => {responseData = data})
        if (responseData.success)
        {
            console.log(discount)
            window.location.reload()
            alert('Discount Added')
        }
        else
        {
            alert('Added Failure! Discount code already exists')
        }
    }

    const [discounts, setDiscounts] = useState([])
    const fetchInfo = async () =>
    {
        await fetch('http://localhost:4000/listdiscount')
        .then((res) => res.json())
        .then((data) => {setDiscounts(data)})
    }
    useEffect(() =>{fetchInfo()}, [])
  return (
    <div className='add-and-list_code'>
        <div className="add-code">
            <div className="addcode-itemfield">
                <p>Code</p>
                <input value={discountdetails.code} onChange={changeHandler} type="text" name='code' placeholder='Type here'/>
            </div>
            <div className="addcode-itemfield">
                <p>Code type</p>
                <select value={discountdetails.type} onChange={changeHandler} name="type" className='add-code-selector'>
                    <option value="" hidden disabled selected>Select type</option>
                    <option value="delivery">Delivery</option>
                    <option value="product">Product</option>
                </select>
            </div>
            <div className="addcode-itemfield">
                <p>Date expired</p>
                <input value={discountdetails.date} onChange={changeHandler} type="date" name='date'/>
            </div>            
            <button onClick={Add_Discount} className='addcode-btn'>Add</button>
        </div>

        <div className="list-code">
            <h1>All Discount List</h1>
            <div className="listcode-format-main">
                <p>Code</p>
                <p>Type of code</p>
                <p>Date</p>
            </div>
            <div className="listcode-allcodes">
                <hr />
                {discounts.map((discount,index) => {
                    return <>
                        <div key={index} className='listcode-format-main listcode-format'>
                        <p>{discount.code}</p>
                        <p>{discount.type}</p>
                        <p>{discount.date}</p>
                   </div>
                    <hr />
                    </>
                })}
            </div>
        </div>
    
    </div>
  )
}

export default Discount